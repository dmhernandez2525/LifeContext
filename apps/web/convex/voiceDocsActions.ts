"use node";

import { anyApi } from 'convex/server';
import { v } from 'convex/values';
import { action } from './_generated/server';
import {
  buildCacheKey,
  buildLifeContextSystemPrompt,
  getAnthropicModel,
  getFallbackResponse,
  normalizeQuestion,
} from './voiceDocsConfig';

const emitWebhook = async (payload: Record<string, unknown>): Promise<void> => {
  const webhookUrl = process.env.VOICE_DOCS_WEBHOOK_URL;
  if (!webhookUrl) {
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Monitoring should not block user responses.
  }
};

const callAnthropic = async (
  apiKey: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: getAnthropicModel(),
      max_tokens: 700,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic request failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };

  const text = payload.content?.find((item) => item.type === 'text')?.text?.trim();
  if (!text) {
    throw new Error('No text response returned by Anthropic');
  }

  return text;
};

const buildMemoryMessages = (
  memory: Array<{ role: string; content: string }>
): Array<{ role: 'user' | 'assistant'; content: string }> => {
  return memory
    .filter((message) => message.role === 'assistant' || message.role === 'user')
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content,
    }));
};

export const respond = action({
  args: {
    sessionId: v.string(),
    question: v.string(),
    appSection: v.string(),
    conversationId: v.optional(v.id('voiceDocConversations')),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sanitizedQuestion = args.question.trim();
    const normalizedQuestion = normalizeQuestion(sanitizedQuestion);
    const cacheKey = buildCacheKey(sanitizedQuestion, args.appSection);

    const rateLimit = await ctx.runMutation(anyApi.voiceDocsDb.touchRateLimit, {
      sessionId: args.sessionId,
    });

    if (!rateLimit.allowed) {
      return {
        conversationId: args.conversationId ?? null,
        response: `Rate limit reached. Retry in ${rateLimit.retryAfterSeconds}s.`,
        cacheHit: false,
        fallbackUsed: true,
      };
    }

    const conversationId =
      args.conversationId ??
      (await ctx.runMutation(anyApi.voiceDocsDb.startConversation, {
        sessionId: args.sessionId,
        appSection: args.appSection,
        userId: args.userId,
      }));

    const cached = await ctx.runQuery(anyApi.voiceDocsDb.getCacheEntry, { cacheKey });
    if (cached) {
      await ctx.runMutation(anyApi.voiceDocsDb.saveConversationTurn, {
        conversationId,
        userQuestion: sanitizedQuestion,
        assistantResponse: cached.response,
        appSection: args.appSection,
        cacheHit: true,
      });
      await ctx.runMutation(anyApi.voiceDocsDb.incrementQuestionAnalytics, {
        normalizedQuestion,
        appSection: args.appSection,
      });

      return {
        conversationId,
        response: cached.response,
        cacheHit: true,
        fallbackUsed: false,
      };
    }

    const memory = await ctx.runQuery(anyApi.voiceDocsDb.getConversationMemory, {
      conversationId,
      limit: 10,
    });

    let responseText = getFallbackResponse(args.appSection);
    let fallbackUsed = true;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      try {
        const prompt = buildLifeContextSystemPrompt(args.appSection);
        responseText = await callAnthropic(apiKey, prompt, [
          ...buildMemoryMessages(memory),
          { role: 'user', content: sanitizedQuestion },
        ]);
        fallbackUsed = false;
      } catch {
        responseText = getFallbackResponse(args.appSection);
      }
    }

    await ctx.runMutation(anyApi.voiceDocsDb.saveConversationTurn, {
      conversationId,
      userQuestion: sanitizedQuestion,
      assistantResponse: responseText,
      appSection: args.appSection,
      cacheHit: false,
    });
    await ctx.runMutation(anyApi.voiceDocsDb.incrementQuestionAnalytics, {
      normalizedQuestion,
      appSection: args.appSection,
    });

    if (!fallbackUsed) {
      await ctx.runMutation(anyApi.voiceDocsDb.upsertCacheEntry, {
        cacheKey,
        response: responseText,
        appSection: args.appSection,
      });
    }

    await emitWebhook({
      type: 'voice_docs_response',
      sessionId: args.sessionId,
      conversationId,
      appSection: args.appSection,
      cacheHit: false,
      fallbackUsed,
      timestamp: Date.now(),
    });

    return {
      conversationId,
      response: responseText,
      cacheHit: false,
      fallbackUsed,
    };
  },
});

export const summarizeConversation = action({
  args: {
    conversationId: v.id('voiceDocConversations'),
    appSection: v.string(),
  },
  handler: async (ctx, args) => {
    const memory = await ctx.runQuery(anyApi.voiceDocsDb.getConversationMemory, {
      conversationId: args.conversationId,
      limit: 40,
    });

    if (!memory.length) {
      return { summary: 'No conversation history to summarize.' };
    }

    const fallbackSummary =
      `Conversation contains ${memory.length} messages. ` +
      `Primary topic appears related to ${args.appSection}.`;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return { summary: fallbackSummary };
    }

    try {
      const transcript = memory
        .map((message) => `${message.role}: ${message.content}`)
        .join('\n');

      const summary = await callAnthropic(apiKey, 'Summarize this conversation in 4 concise bullet points.', [
        { role: 'user', content: transcript },
      ]);

      return { summary };
    } catch {
      return { summary: fallbackSummary };
    }
  },
});
