/**
 * InsightCard - Displays a single proactive insight with optional action.
 */
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { INSIGHT_CONFIG, type ProactiveInsight } from '@/lib/proactiveInsights';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  insight: ProactiveInsight;
  onDismiss: (id: string) => void;
}

export function InsightCard({ insight, onDismiss }: InsightCardProps) {
  const navigate = useNavigate();
  const config = INSIGHT_CONFIG[insight.type];

  return (
    <div className={cn(
      "p-4 bg-white dark:bg-gray-900 rounded-xl border-l-4 border border-gray-200 dark:border-gray-800",
      config.color
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <span className="text-xl">{config.icon}</span>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{insight.title}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
            {insight.actionLabel && insight.actionRoute && (
              <button
                onClick={() => navigate(insight.actionRoute!)}
                className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {insight.actionLabel} &rarr;
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => onDismiss(insight.id)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
