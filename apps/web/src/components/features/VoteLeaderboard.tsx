/**
 * VoteLeaderboard - Top voted features with analytics.
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, ThumbsUp, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FeatureRequest } from '@/hooks/useConvexFeatures';
import { calculateVoteAnalytics, sortFeatures } from '@/lib/featureScoring';

interface VoteLeaderboardProps {
  features: FeatureRequest[];
  onSelectFeature: (featureId: string) => void;
}

export function VoteLeaderboard({ features, onSelectFeature }: VoteLeaderboardProps) {
  const analytics = useMemo(() => calculateVoteAnalytics(features), [features]);
  const topFeatures = useMemo(() => sortFeatures(features, 'top').slice(0, 5), [features]);
  const trendingFeatures = useMemo(() => sortFeatures(features, 'trending').slice(0, 5), [features]);

  return (
    <div className="space-y-6">
      {/* Analytics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Votes" value={analytics.totalVotes} icon={ThumbsUp} />
        <StatCard label="Features" value={analytics.totalFeatures} icon={BarChart3} />
        <StatCard label="Approval Rate" value={`${analytics.approvalRate}%`} icon={TrendingUp} />
        <StatCard label="Categories" value={analytics.topCategories.length} icon={Trophy} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Voted */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Voted
          </h3>
          <div className="space-y-2">
            {topFeatures.map((feature, index) => (
              <LeaderboardRow
                key={feature._id}
                rank={index + 1}
                feature={feature}
                onClick={() => onSelectFeature(feature._id)}
              />
            ))}
          </div>
        </div>

        {/* Trending */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Trending
          </h3>
          <div className="space-y-2">
            {trendingFeatures.map((feature, index) => (
              <LeaderboardRow
                key={feature._id}
                rank={index + 1}
                feature={feature}
                onClick={() => onSelectFeature(feature._id)}
                showVelocity
              />
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {analytics.topCategories.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Votes by Category</h3>
          <div className="flex gap-2 flex-wrap">
            {analytics.topCategories.map(({ category, votes }) => (
              <div
                key={category}
                className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{category}</span>
                <span className="ml-2 text-sm text-gray-500">{votes} votes</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Trophy }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center"
    >
      <Icon className="w-5 h-5 text-purple-500 mx-auto mb-2" />
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </motion.div>
  );
}

function LeaderboardRow({
  rank,
  feature,
  onClick,
  showVelocity = false,
}: {
  rank: number;
  feature: FeatureRequest;
  onClick: () => void;
  showVelocity?: boolean;
}) {
  const netVotes = feature.upvotes - feature.downvotes;
  const ageDays = Math.max((Date.now() - feature.createdAt) / 86_400_000, 1);
  const velocity = ((feature.upvotes + feature.downvotes) / ageDays).toFixed(1);

  const rankColors: Record<number, string> = {
    1: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    2: 'text-gray-400 bg-gray-50 dark:bg-gray-800',
    3: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
    >
      <span className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
        rankColors[rank] ?? "text-gray-500 bg-gray-50 dark:bg-gray-800"
      )}>
        {rank}
      </span>
      <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white truncate">
        {feature.title}
      </span>
      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 shrink-0">
        {showVelocity ? `${velocity}/day` : `+${netVotes}`}
      </span>
    </button>
  );
}
