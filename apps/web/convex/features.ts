/**
 * Feature Request Functions for Convex
 * Handles CRUD operations for the feature request system
 */
import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// ============================================================
// QUERIES
// ============================================================

// Get all public feature requests, sorted by upvotes
export const listFeatures = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query('featureRequests')
      .filter(q => q.eq(q.field('isPublic'), true));
    
    if (args.status) {
      query = query.filter(q => q.eq(q.field('status'), args.status));
    }
    if (args.category) {
      query = query.filter(q => q.eq(q.field('category'), args.category));
    }
    
    return await query.order('desc').collect();
  },
});

// Get a single feature with comments
export const getFeatureWithComments = query({
  args: { featureId: v.id('featureRequests') },
  handler: async (ctx, args) => {
    const feature = await ctx.db.get(args.featureId);
    if (!feature) return null;

    const comments = await ctx.db
      .query('comments')
      .withIndex('by_feature', q => q.eq('featureId', args.featureId))
      .order('asc')
      .collect();

    return { feature, comments };
  },
});

// Check if a session has voted on a feature
export const getVoteStatus = query({
  args: { 
    featureId: v.id('featureRequests'),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query('votes')
      .withIndex('by_session_feature', q => 
        q.eq('sessionId', args.sessionId).eq('featureId', args.featureId)
      )
      .first();
    
    return vote?.voteType || null;
  },
});

// Get roadmap items
export const getRoadmap = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('roadmapItems')
      .withIndex('by_priority')
      .order('asc')
      .collect();
  },
});

// ============================================================
// MUTATIONS
// ============================================================

// Submit a new feature request
export const submitFeature = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    email: v.optional(v.string()),
    submittedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.insert('featureRequests', {
      title: args.title,
      description: args.description,
      category: args.category,
      status: 'pending',
      upvotes: 0,
      downvotes: 0,
      submittedBy: args.submittedBy,
      email: args.email,
      isPublic: true, // Will be reviewed by admin
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Vote on a feature (up or down)
export const voteOnFeature = mutation({
  args: {
    featureId: v.id('featureRequests'),
    sessionId: v.string(),
    voteType: v.string(), // 'up' or 'down'
  },
  handler: async (ctx, args) => {
    const feature = await ctx.db.get(args.featureId);
    if (!feature) throw new Error('Feature not found');

    // Check for existing vote
    const existingVote = await ctx.db
      .query('votes')
      .withIndex('by_session_feature', q => 
        q.eq('sessionId', args.sessionId).eq('featureId', args.featureId)
      )
      .first();

    if (existingVote) {
      // If same vote type, remove the vote
      if (existingVote.voteType === args.voteType) {
        await ctx.db.delete(existingVote._id);
        await ctx.db.patch(args.featureId, {
          [args.voteType === 'up' ? 'upvotes' : 'downvotes']: 
            feature[args.voteType === 'up' ? 'upvotes' : 'downvotes'] - 1,
          updatedAt: Date.now(),
        });
        return { action: 'removed' };
      }
      // If different vote type, switch the vote
      await ctx.db.patch(existingVote._id, { voteType: args.voteType });
      await ctx.db.patch(args.featureId, {
        upvotes: args.voteType === 'up' ? feature.upvotes + 1 : feature.upvotes - 1,
        downvotes: args.voteType === 'down' ? feature.downvotes + 1 : feature.downvotes - 1,
        updatedAt: Date.now(),
      });
      return { action: 'switched' };
    }

    // New vote
    await ctx.db.insert('votes', {
      featureId: args.featureId,
      sessionId: args.sessionId,
      voteType: args.voteType,
      createdAt: Date.now(),
    });
    
    await ctx.db.patch(args.featureId, {
      [args.voteType === 'up' ? 'upvotes' : 'downvotes']: 
        feature[args.voteType === 'up' ? 'upvotes' : 'downvotes'] + 1,
      updatedAt: Date.now(),
    });

    return { action: 'added' };
  },
});

// Add a comment to a feature
export const addComment = mutation({
  args: {
    featureId: v.id('featureRequests'),
    content: v.string(),
    authorName: v.optional(v.string()),
    parentCommentId: v.optional(v.id('comments')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('comments', {
      featureId: args.featureId,
      content: args.content,
      authorName: args.authorName,
      isAdmin: false, // Only admin can set this via dashboard
      parentCommentId: args.parentCommentId,
      createdAt: Date.now(),
    });
  },
});
