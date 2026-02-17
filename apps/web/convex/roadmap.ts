/**
 * Roadmap management functions for Convex.
 * Handles CRUD for roadmap items and linking to feature requests.
 */
import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get all roadmap items grouped by status
export const getRoadmapGrouped = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query('roadmapItems')
      .withIndex('by_priority')
      .order('asc')
      .collect();

    const grouped: Record<string, typeof items> = {
      planned: [],
      in_progress: [],
      completed: [],
    };

    for (const item of items) {
      if (grouped[item.status]) {
        grouped[item.status].push(item);
      }
    }

    return grouped;
  },
});

// Get roadmap stats
export const getRoadmapStats = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query('roadmapItems').collect();

    const planned = items.filter(i => i.status === 'planned').length;
    const inProgress = items.filter(i => i.status === 'in_progress').length;
    const completed = items.filter(i => i.status === 'completed').length;

    return { planned, inProgress, completed, total: items.length };
  },
});

// Create a roadmap item
export const createRoadmapItem = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    status: v.string(),
    priority: v.number(),
    quarter: v.optional(v.string()),
    linkedFeatureIds: v.optional(v.array(v.id('featureRequests'))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('roadmapItems', {
      title: args.title,
      description: args.description,
      status: args.status,
      priority: args.priority,
      quarter: args.quarter,
      linkedFeatureIds: args.linkedFeatureIds ?? [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a roadmap item
export const updateRoadmapItem = mutation({
  args: {
    itemId: v.id('roadmapItems'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.number()),
    quarter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error('Roadmap item not found');

    const updates: Record<string, string | number> = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.status !== undefined) updates.status = args.status;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.quarter !== undefined) updates.quarter = args.quarter;

    await ctx.db.patch(args.itemId, updates);
    return { success: true };
  },
});

// Link a feature request to a roadmap item
export const linkFeatureToRoadmap = mutation({
  args: {
    itemId: v.id('roadmapItems'),
    featureId: v.id('featureRequests'),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error('Roadmap item not found');

    const existing = item.linkedFeatureIds ?? [];
    if (existing.includes(args.featureId)) return { success: true };

    await ctx.db.patch(args.itemId, {
      linkedFeatureIds: [...existing, args.featureId],
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
