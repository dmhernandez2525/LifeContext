"use node";

import { anyApi, httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';

const json = (body: unknown, status = 200): Response => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

const parseBody = async <T>(request: Request): Promise<T | null> => {
  try {
    const parsed = (await request.json()) as T;
    return parsed;
  } catch {
    return null;
  }
};

const http = httpRouter();

http.route({
  path: '/voice-docs/respond',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const body = await parseBody<{
      sessionId?: string;
      question?: string;
      appSection?: string;
      conversationId?: string;
      userId?: string;
    }>(request);

    if (!body?.sessionId || !body.question || !body.appSection) {
      return json({ error: 'Missing required fields' }, 400);
    }

    const response = await ctx.runAction(anyApi.voiceDocsActions.respond, {
      sessionId: body.sessionId,
      question: body.question,
      appSection: body.appSection,
      conversationId: body.conversationId,
      userId: body.userId,
    });

    return json(response, 200);
  }),
});

http.route({
  path: '/voice-docs/summarize',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const body = await parseBody<{ conversationId?: string; appSection?: string }>(request);

    if (!body?.conversationId || !body.appSection) {
      return json({ error: 'Missing required fields' }, 400);
    }

    const response = await ctx.runAction(anyApi.voiceDocsActions.summarizeConversation, {
      conversationId: body.conversationId,
      appSection: body.appSection,
    });

    return json(response, 200);
  }),
});

http.route({
  path: '/voice-docs/questions',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? '10');
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 10;

    const questions = await ctx.runQuery(anyApi.voiceDocsDb.getMostAskedQuestions, {
      limit: safeLimit,
    });

    return json({ questions }, 200);
  }),
});

export default http;
