/**
 * OnThisDayPage - "On This Day" memories from past years.
 */
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { OnThisDayFeed } from '@/components/memories';
import { db } from '@lcc/storage';

export default function OnThisDayPage() {
  const [date, setDate] = useState(() => new Date());
  const [journals, setJournals] = useState<Array<{ date: Date; content: string; mood?: string }>>([]);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  useEffect(() => {
    db.journalEntries
      .toArray()
      .then((entries) => {
        setJournals(
          entries.map(e => ({
            date: e.date,
            content: typeof e.content === 'string' ? e.content : (e.content?.data ?? ''),
            mood: e.mood,
          }))
        );
      })
      .catch(() => setJournals([]));
  }, []);

  const shiftDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d);
  };

  const dateLabel = useMemo(() => {
    const today = new Date();
    if (date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) {
      return 'Today';
    }
    return date.toLocaleDateString('en', { month: 'long', day: 'numeric' });
  }, [date]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl">
          <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">On This Day</h1>
          <p className="text-sm text-gray-500">Your memories from past years</p>
        </div>
      </div>

      {/* Date navigator */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => shiftDate(-1)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[120px] text-center">
          {dateLabel}
        </span>
        <button onClick={() => shiftDate(1)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <OnThisDayFeed journals={journals} month={month} day={day} />
    </motion.div>
  );
}
