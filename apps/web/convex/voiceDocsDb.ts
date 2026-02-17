import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import {
  VOICE_DOCS_CACHE_TTL_MS,
  VOICE_DOCS_RATE_LIMIT_MAX_REQUESTS,
  VOICE_DOCS_RATE_LIMIT_WINDOW_MS,
} from './voiceDocsConfig';

export const startConversation = mutation({
  args: {
    sessionId: v.string(),
    appSection: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('voiceDocConversations', {
      sessionId: args.sessionId,
      userId: args.userId,
      appSection: args.appSection,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getConversation = query({
  args: { conversationId: v.id('voiceDocConversations') },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      return null;
    }

    const messages = await ctx.db
      .query('voiceDocMessages')
      .withIndex('by_conversation', (queryBuilder) => queryBuilder.eq('conversationId', args.conversationId))
      .order('asc')
      .collect();

    return { conversation, messages };
  },
});

export const getMostAskedQuestions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    return await ctx.db
      .query('voiceDocQuestionAnalytics')
      .withIndex('by_count')
      .order('desc')
      .take(limit);
  },
});

export const getCacheEntry = query({
  args: { cacheKey: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const cached = await ctx.db
      .query('voiceDocCache')
      .withIndex('by_cache_key', (queryBuilder) => queryBuilder.eq('cacheKey', args.cacheKey))
      .first();

    if (!cached || cached.expiresAt < now) {
      return null;
    }

    return cached;
  },
});

export const getConversationMemory = query({
  args: {
    conversationId: v.id('voiceDocConversations'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const memoryLimit = args.limit ?? 12;
    const messages = await ctx.db
      .query('voiceDocMessages')
      .withIndex('by_conversation', (queryBuilder) => queryBuilder.eq('conversationId', args.conversationId))
      .order('asc')
      .collect();

    return messages.slice(-memoryLimit);
  },
});

export const touchRateLimit = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const current = await ctx.db
      .query('voiceDocRateLimits')
      .withIndex('by_session', (queryBuilder) => queryBuilder.eq('sessionId', args.sessionId))
      .first();

    if (!current) {
      await ctx.db.insert('voiceDocRateLimits', {
        sessionId: args.sessionId,
        windowStart: now,
        requestCount: 1,
        updatedAt: now,
      });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (current.blockedUntil && current.blockedUntil > now) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((current.blockedUntil - now) / 1000),
      };
    }

    const isNewWindow = now - current.windowStart >= VOICE_DOCS_RATE_LIMIT_WINDOW_MS;
    const nextCount = isNewWindow ? 1 : current.requestCount + 1;

    if (nextCount > VOICE_DOCS_RATE_LIMIT_MAX_REQUESTS) {
      const blockedUntil = now + VOICE_DOCS_RATE_LIMIT_WINDOW_MS;
      await ctx.db.patch(current._id, {
        blockedUntil,
        requestCount: nextCount,
        updatedAt: now,
      });
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(VOICE_DOCS_RATE_LIMIT_WINDOW_MS / 1000),
      };
    }

    await ctx.db.patch(current._id, {
      requestCount: nextCount,
      windowStart: isNewWindow ? now : current.windowStart,
      blockedUntil: undefined,
      updatedAt: now,
    });

    return { allowed: true, retryAfterSeconds: 0 };
  },
});

export const saveConversationTurn = mutation({
  args: {
    conversationId: v.id('voiceDocConversations'),
    userQuestion: v.string(),
    assistantResponse: v.string(),
    appSection: v.string(),
    cacheHit: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.insert('voiceDocMessages', {
      conversationId: args.conversationId,
      role: 'user',
      content: args.userQuestion,
      appSection: args.appSection,
      createdAt: now,
    });

    await ctx.db.insert('voiceDocMessages', {
      conversationId: args.conversationId,
      role: 'assistant',
      content: args.assistantResponse,
      appSection: args.appSection,
      cacheHit: args.cacheHit,
      createdAt: now,
    });

    await ctx.db.patch(args.conversationId, {
      appSection: args.appSection,
      updatedAt: now,
    });
  },
});

export const upsertCacheEntry = mutation({
  args: {
    cacheKey: v.string(),
    response: v.string(),
    appSection: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('voiceDocCache')
      .withIndex('by_cache_key', (queryBuilder) => queryBuilder.eq('cacheKey', args.cacheKey))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        response: args.response,
        appSection: args.appSection,
        createdAt: now,
        expiresAt: now + VOICE_DOCS_CACHE_TTL_MS,
      });
      return;
    }

    await ctx.db.insert('voiceDocCache', {
      cacheKey: args.cacheKey,
      response: args.response,
      appSection: args.appSection,
      createdAt: now,
      expiresAt: now + VOICE_DOCS_CACHE_TTL_MS,
    });
  },
});

export const incrementQuestionAnalytics = mutation({
  args: {
    normalizedQuestion: v.string(),
    appSection: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('voiceDocQuestionAnalytics')
      .withIndex('by_question', (queryBuilder) => queryBuilder.eq('normalizedQuestion', args.normalizedQuestion))
      .first();

    if (!existing) {
      await ctx.db.insert('voiceDocQuestionAnalytics', {
        normalizedQuestion: args.normalizedQuestion,
        appSection: args.appSection,
        count: 1,
        firstAskedAt: now,
        lastAskedAt: now,
      });
      return;
    }

    await ctx.db.patch(existing._id, {
      appSection: args.appSection,
      count: existing.count + 1,
      lastAskedAt: now,
    });
  },
});
