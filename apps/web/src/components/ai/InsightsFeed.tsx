/**
 * InsightsFeed - Displays a list of proactive AI insights.
 */
import { useMemo, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { generateInsights } from '@/lib/proactiveInsights';
import { useHealthStore } from '@/store/health-store';
import { InsightCard } from './InsightCard';

interface InsightsFeedProps {
  journalData: {
    count: number;
    recentMoods: string[];
    lastEntryDate: number | null;
    streakDays: number;
  };
}

export function InsightsFeed({ journalData }: InsightsFeedProps) {
  const { entries: healthEntries } = useHealthStore();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const insights = useMemo(
    () => generateInsights(journalData, healthEntries),
    [journalData, healthEntries]
  );

  const visible = insights.filter(i => !dismissed.has(i.id));

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  if (visible.length === 0) {
    return (
      <div className="text-center py-8">
        <Lightbulb className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No new insights right now.</p>
        <p className="text-xs text-gray-400 mt-1">Keep journaling and tracking to generate more.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {visible.length} insight{visible.length !== 1 ? 's' : ''} for you
        </h3>
      </div>
      {visible.map(insight => (
        <InsightCard key={insight.id} insight={insight} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}
