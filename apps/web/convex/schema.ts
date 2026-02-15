/**
 * Convex Schema for LifeContext Feature Request System
 * This defines the database structure for:
 * - Feature requests with voting
 * - Comments on features
 * - Roadmap items
 */
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Feature requests submitted by users
  featureRequests: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // 'ui', 'feature', 'integration', 'bug', 'other'
    status: v.string(), // 'pending', 'planned', 'in_progress', 'completed', 'rejected'
    upvotes: v.number(),
    downvotes: v.number(),
    submittedBy: v.optional(v.string()), // Anonymous if not logged in
    email: v.optional(v.string()), // For notifications
    isPublic: v.boolean(),
    adminNotes: v.optional(v.string()),
    targetVersion: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_category', ['category'])
    .index('by_upvotes', ['upvotes'])
    .index('by_created', ['createdAt']),

  // Votes on feature requests (one per user/session)
  votes: defineTable({
    featureId: v.id('featureRequests'),
    sessionId: v.string(), // Anonymous session tracking
    voteType: v.string(), // 'up' or 'down'
    createdAt: v.number(),
  })
    .index('by_feature', ['featureId'])
    .index('by_session_feature', ['sessionId', 'featureId']),

  // Comments on feature requests
  comments: defineTable({
    featureId: v.id('featureRequests'),
    content: v.string(),
    authorName: v.optional(v.string()),
    isAdmin: v.boolean(),
    parentCommentId: v.optional(v.id('comments')), // For replies
    createdAt: v.number(),
  })
    .index('by_feature', ['featureId'])
    .index('by_created', ['createdAt']),

  // Roadmap items (admin-managed)
  roadmapItems: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.string(), // 'planned', 'in_progress', 'completed'
    priority: v.number(), // For ordering
    quarter: v.optional(v.string()), // 'Q1 2026', 'Q2 2026', etc.
    linkedFeatureIds: v.array(v.id('featureRequests')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_priority', ['priority']),

  // Voice-docs conversations for in-app help assistant
  voiceDocConversations: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.string()),
    appSection: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_session', ['sessionId'])
    .index('by_updated', ['updatedAt']),

  voiceDocMessages: defineTable({
    conversationId: v.id('voiceDocConversations'),
    role: v.string(), // 'user' | 'assistant' | 'system'
    content: v.string(),
    appSection: v.string(),
    cacheHit: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index('by_conversation', ['conversationId'])
    .index('by_created', ['createdAt']),

  voiceDocCache: defineTable({
    cacheKey: v.string(),
    response: v.string(),
    appSection: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  })
    .index('by_cache_key', ['cacheKey'])
    .index('by_expires', ['expiresAt']),

  voiceDocQuestionAnalytics: defineTable({
    normalizedQuestion: v.string(),
    appSection: v.string(),
    count: v.number(),
    firstAskedAt: v.number(),
    lastAskedAt: v.number(),
  })
    .index('by_question', ['normalizedQuestion'])
    .index('by_count', ['count']),

  voiceDocRateLimits: defineTable({
    sessionId: v.string(),
    windowStart: v.number(),
    requestCount: v.number(),
    blockedUntil: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index('by_session', ['sessionId'])
    .index('by_updated', ['updatedAt']),
});
