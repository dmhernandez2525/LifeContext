/**
 * HealthPage - Health metrics tracking and visualization.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { HealthDashboard, HealthEntryForm } from '@/components/health';

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  return date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function HealthPage() {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 py-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-xl">
          <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Health Tracker</h1>
          <p className="text-sm text-gray-500">Track your daily health metrics</p>
        </div>
      </div>

      {/* Date navigator */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => shiftDate(-1)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[120px] text-center">
          {formatDateLabel(selectedDate)}
        </span>
        <button
          onClick={() => shiftDate(1)}
          disabled={selectedDate >= new Date().toISOString().slice(0, 10)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Quick add form */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <p className="text-xs font-medium text-gray-500 mb-3">Log a metric</p>
        <HealthEntryForm selectedDate={selectedDate} />
      </div>

      {/* Dashboard */}
      <HealthDashboard selectedDate={selectedDate} />
    </motion.div>
  );
}
