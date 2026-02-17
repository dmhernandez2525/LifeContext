/**
 * MilestoneSection - Grouped roadmap items by milestone.
 */
import { motion } from 'framer-motion';
import { Flag, ThumbsUp, Check, Wrench, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoadmapItem } from '@/hooks/useRoadmap';

const STATUS_ICON: Record<string, typeof Check> = {
  planned: Lightbulb,
  in_progress: Wrench,
  completed: Check,
};

const STATUS_COLOR: Record<string, string> = {
  planned: 'text-blue-500',
  in_progress: 'text-yellow-500',
  completed: 'text-green-500',
};

interface MilestoneSectionProps {
  milestones: { name: string; items: RoadmapItem[] }[];
}

export function MilestoneSection({ milestones }: MilestoneSectionProps) {
  if (milestones.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
        <Flag className="w-5 h-5 text-purple-500" />
        Milestones
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {milestones.map((milestone, index) => {
          const completedCount = milestone.items.filter(i => i.status === 'completed').length;
          const progress = Math.round((completedCount / milestone.items.length) * 100);

          return (
            <motion.div
              key={milestone.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 dark:text-white">{milestone.name}</h3>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Items */}
              <div className="space-y-2">
                {milestone.items.map(item => {
                  const StatusIcon = STATUS_ICON[item.status] ?? Lightbulb;
                  return (
                    <div key={item._id} className="flex items-center gap-2">
                      <StatusIcon className={cn("w-4 h-4 shrink-0", STATUS_COLOR[item.status])} />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> {item.upvotes}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
