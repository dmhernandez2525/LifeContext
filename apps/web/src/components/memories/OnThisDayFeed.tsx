/**
 * OnThisDayFeed - Scrollable feed of memories grouped by year.
 */
import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { getOnThisDay, type MemoryEntry } from '@/lib/onThisDay';
import { usePhotoStore } from '@/store/photo-store';
import { useHealthStore } from '@/store/health-store';
import { OnThisDayCard } from './OnThisDayCard';

interface OnThisDayFeedProps {
  journals: Array<{ date: Date | string; content: string | { data?: string }; mood?: string }>;
  month: number;
  day: number;
}

export function OnThisDayFeed({ journals, month, day }: OnThisDayFeedProps) {
  const { photos } = usePhotoStore();
  const { entries: healthEntries } = useHealthStore();

  const result = useMemo(
    () => getOnThisDay(journals, photos, healthEntries, month, day),
    [journals, photos, healthEntries, month, day]
  );

  if (result.memories.length === 0) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No memories for this date yet.</p>
        <p className="text-xs text-gray-400 mt-1">
          Keep journaling and your memories will appear here in future years.
        </p>
      </div>
    );
  }

  const byYear = useMemo(() => {
    const groups = new Map<number, MemoryEntry[]>();
    for (const memory of result.memories) {
      const existing = groups.get(memory.year);
      if (existing) existing.push(memory);
      else groups.set(memory.year, [memory]);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => b - a);
  }, [result.memories]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {result.memories.length} memor{result.memories.length === 1 ? 'y' : 'ies'} from{' '}
          {result.totalYears} year{result.totalYears !== 1 ? 's' : ''}
        </p>
      </div>

      {byYear.map(([year, memories]) => (
        <div key={year}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs font-bold text-gray-500 px-2">{year}</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="space-y-3">
            {memories.map((memory, idx) => (
              <OnThisDayCard key={`${memory.type}-${memory.year}-${idx}`} memory={memory} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
