/**
 * SynthesisPage - Context synthesis with periodic life reports.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileBarChart, RefreshCw } from 'lucide-react';
import { SynthesisReport } from '@/components/ai/SynthesisReport';
import { useHealthStore } from '@/store/health-store';
import {
  generateLifeSummary,
  PERIOD_LABELS,
  type ReportPeriod,
  type LifeSummary,
} from '@/lib/contextSynthesis';
import { db } from '@lcc/storage';
import { cn } from '@/lib/utils';

const PERIODS: ReportPeriod[] = ['week', 'month', 'quarter', 'year'];

export default function SynthesisPage() {
  const [period, setPeriod] = useState<ReportPeriod>('week');
  const [journals, setJournals] = useState<Array<{ date: Date; content: string; mood?: string; tags?: string[] }>>([]);
  const { entries: healthEntries } = useHealthStore();
  const [summary, setSummary] = useState<LifeSummary | null>(null);

  useEffect(() => {
    db.journalEntries
      .toArray()
      .then((entries) => {
        setJournals(
          entries.map(e => ({
            date: e.date,
            content: typeof e.content === 'string' ? e.content : (e.content?.data ?? ''),
            mood: e.mood,
            tags: e.tags,
          }))
        );
      })
      .catch(() => setJournals([]));
  }, []);

  const generate = () => {
    const result = generateLifeSummary(period, journals, healthEntries);
    setSummary(result);
  };

  useEffect(() => {
    if (journals.length > 0 || healthEntries.length > 0) {
      generate();
    }
  }, [period, journals.length, healthEntries.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 py-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">
          <FileBarChart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Life Synthesis</h1>
          <p className="text-sm text-gray-500">Cross-category life reports and summaries</p>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-2">
        {PERIODS.map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              period === p
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
        <button
          onClick={generate}
          className="ml-auto flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <RefreshCw className="w-3 h-3" /> Regenerate
        </button>
      </div>

      {/* Report */}
      {summary ? (
        <SynthesisReport summary={summary} />
      ) : (
        <div className="text-center py-12">
          <FileBarChart className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Add journal entries or health data to generate your life synthesis report.
          </p>
        </div>
      )}
    </motion.div>
  );
}
