/**
 * Feature scoring and trending algorithms.
 * Combines vote count, recency, and engagement for ranking.
 */
import type { FeatureRequest } from '@/hooks/useConvexFeatures';

const DAY_MS = 86_400_000;
const WEEK_MS = 7 * DAY_MS;

/**
 * Calculate a "hot" score using a Wilson score interval variant.
 * Balances vote ratio with total volume and recency.
 */
export function calculateHotScore(feature: FeatureRequest): number {
  const netVotes = feature.upvotes - feature.downvotes;
  const totalVotes = feature.upvotes + feature.downvotes;
  const ageMs = Date.now() - feature.createdAt;
  const ageDays = Math.max(ageMs / DAY_MS, 0.1);

  // Gravity factor: newer items get a boost that decays over time
  const gravity = 1.5;
  const recencyBoost = Math.pow(ageDays, -gravity);

  // Volume factor: more votes = higher confidence
  const volumeFactor = Math.log2(totalVotes + 1);

  // Net score weighted by recency and volume
  return (netVotes + volumeFactor) * recencyBoost;
}

/**
 * Calculate trending velocity: vote rate over the last 7 days.
 * Higher velocity = feature is gaining traction quickly.
 */
export function calculateTrendingVelocity(feature: FeatureRequest): number {
  const ageMs = Date.now() - feature.createdAt;

  // If feature is less than a day old, use a full day as the window
  const windowMs = Math.min(ageMs, WEEK_MS);
  const windowDays = Math.max(windowMs / DAY_MS, 1);

  const totalVotes = feature.upvotes + feature.downvotes;
  return totalVotes / windowDays;
}

export type SortMode = 'hot' | 'trending' | 'top' | 'newest' | 'controversial';

/**
 * Sort features by the selected mode.
 */
export function sortFeatures(features: FeatureRequest[], mode: SortMode): FeatureRequest[] {
  const sorted = [...features];

  const sorters: Record<SortMode, (a: FeatureRequest, b: FeatureRequest) => number> = {
    hot: (a, b) => calculateHotScore(b) - calculateHotScore(a),
    trending: (a, b) => calculateTrendingVelocity(b) - calculateTrendingVelocity(a),
    top: (a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes),
    newest: (a, b) => b.createdAt - a.createdAt,
    controversial: (a, b) => {
      // Controversial = high total votes but close to 50/50 split
      const aTotal = a.upvotes + a.downvotes;
      const bTotal = b.upvotes + b.downvotes;
      const aRatio = aTotal > 0 ? Math.min(a.upvotes, a.downvotes) / aTotal : 0;
      const bRatio = bTotal > 0 ? Math.min(b.upvotes, b.downvotes) / bTotal : 0;
      // Weight by total volume so low-vote ties don't rank high
      return (bRatio * bTotal) - (aRatio * aTotal);
    },
  };

  sorted.sort(sorters[mode]);
  return sorted;
}

/**
 * Generate vote analytics summary for a set of features.
 */
export function calculateVoteAnalytics(features: FeatureRequest[]) {
  const totalUpvotes = features.reduce((sum, f) => sum + f.upvotes, 0);
  const totalDownvotes = features.reduce((sum, f) => sum + f.downvotes, 0);
  const totalVotes = totalUpvotes + totalDownvotes;

  const categoryVotes: Record<string, number> = {};
  for (const f of features) {
    categoryVotes[f.category] = (categoryVotes[f.category] ?? 0) + f.upvotes + f.downvotes;
  }

  const topCategories = Object.entries(categoryVotes)
    .sort(([, a], [, b]) => b - a)
    .map(([category, votes]) => ({ category, votes }));

  return {
    totalUpvotes,
    totalDownvotes,
    totalVotes,
    approvalRate: totalVotes > 0 ? Math.round((totalUpvotes / totalVotes) * 100) : 0,
    totalFeatures: features.length,
    topCategories,
  };
}
