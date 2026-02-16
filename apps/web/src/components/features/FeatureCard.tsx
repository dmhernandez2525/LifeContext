/**
 * FeatureCard - Individual feature request display with voting.
 */
import { motion } from 'framer-motion';
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Clock,
  Lightbulb,
  Wrench,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FeatureRequest } from '@/hooks/useConvexFeatures';

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: 'Under Review', icon: Clock, color: 'text-gray-500 bg-gray-100 dark:bg-gray-800' },
  planned: { label: 'Planned', icon: Lightbulb, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  in_progress: { label: 'In Progress', icon: Wrench, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  completed: { label: 'Completed', icon: Check, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
};

interface FeatureCardProps {
  feature: FeatureRequest;
  voteStatus: 'up' | 'down' | null;
  onVote: (featureId: string, voteType: 'up' | 'down') => void;
  onSelect: (featureId: string) => void;
  commentCount?: number;
}

export function FeatureCard({ feature, voteStatus, onVote, onSelect, commentCount = 0 }: FeatureCardProps) {
  const status = STATUS_CONFIG[feature.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => onVote(feature._id, 'up')}
            className={cn(
              "p-2 rounded-lg transition-colors",
              voteStatus === 'up'
                ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {feature.upvotes - feature.downvotes}
          </span>
          <button
            onClick={() => onVote(feature._id, 'down')}
            className={cn(
              "p-2 rounded-lg transition-colors",
              voteStatus === 'down'
                ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <ThumbsDown className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 cursor-pointer" onClick={() => onSelect(feature._id)}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              {feature.title}
            </h3>
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 ml-2", status.color)}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {feature.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="capitalize">{feature.category}</span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {commentCount}
            </span>
            <span>{new Date(feature.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
