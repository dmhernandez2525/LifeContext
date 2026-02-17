/**
 * RetentionSettings - Configure data retention policies per category.
 */
import { useMemo } from 'react';
import { Database, Clock, Trash2, RotateCcw } from 'lucide-react';
import { useRetentionStore } from '@/store/retention-store';
import {
  CATEGORY_LABELS,
  PERIOD_LABELS,
  PERIOD_VALUES,
  type DataCategory,
  type RetentionPeriod,
} from '@/lib/retentionPolicies';
import { cn } from '@/lib/utils';

const PURGE_INTERVAL_OPTIONS = [
  { value: 1, label: 'Daily' },
  { value: 7, label: 'Weekly' },
  { value: 14, label: 'Every 2 weeks' },
  { value: 30, label: 'Monthly' },
];

export function RetentionSettings() {
  const {
    policies,
    autoDelete,
    lastPurge,
    purgeIntervalDays,
    updatePolicy,
    togglePolicy,
    setAutoDelete,
    setPurgeInterval,
    recordPurge,
    resetToDefaults,
  } = useRetentionStore();

  const activePolicies = useMemo(
    () => policies.filter(p => p.enabled && p.period !== 'forever').length,
    [policies]
  );

  const lastPurgeLabel = useMemo(() => {
    if (!lastPurge) return 'Never';
    const days = Math.floor((Date.now() - lastPurge) / 86_400_000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  }, [lastPurge]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-gray-900 dark:text-white">Data Retention</h3>
        </div>
        <button
          onClick={resetToDefaults}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <RotateCcw className="w-3 h-3" /> Reset defaults
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Control how long each type of data is kept. {activePolicies > 0
          ? `${activePolicies} categor${activePolicies === 1 ? 'y has' : 'ies have'} time-based retention.`
          : 'All data is currently kept forever.'}
      </p>

      {/* Per-category policies */}
      <div className="space-y-2">
        {policies.map(policy => (
          <PolicyRow
            key={policy.category}
            category={policy.category}
            period={policy.period}
            enabled={policy.enabled}
            onPeriodChange={(period) => updatePolicy(policy.category, period)}
            onToggle={() => togglePolicy(policy.category)}
          />
        ))}
      </div>

      {/* Auto-delete config */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic cleanup</p>
            <p className="text-xs text-gray-500">Periodically remove expired data</p>
          </div>
          <button
            onClick={() => setAutoDelete(!autoDelete)}
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors",
              autoDelete ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
            )}
          >
            <span className={cn(
              "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform",
              autoDelete && "translate-x-5"
            )} />
          </button>
        </div>

        {autoDelete && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Check every</span>
            <select
              value={purgeIntervalDays}
              onChange={(e) => setPurgeInterval(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            >
              {PURGE_INTERVAL_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last cleanup: {lastPurgeLabel}</span>
          <button
            onClick={recordPurge}
            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Trash2 className="w-3 h-3" /> Run now
          </button>
        </div>
      </div>
    </div>
  );
}

interface PolicyRowProps {
  category: DataCategory;
  period: RetentionPeriod;
  enabled: boolean;
  onPeriodChange: (period: RetentionPeriod) => void;
  onToggle: () => void;
}

function PolicyRow({ category, period, enabled, onPeriodChange, onToggle }: PolicyRowProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border transition-colors",
      enabled
        ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        : "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60"
    )}>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={onToggle}
          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {CATEGORY_LABELS[category]}
        </span>
      </div>
      <select
        value={period}
        onChange={(e) => onPeriodChange(e.target.value as RetentionPeriod)}
        disabled={!enabled}
        className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 disabled:opacity-50"
      >
        {PERIOD_VALUES.map(p => (
          <option key={p} value={p}>{PERIOD_LABELS[p]}</option>
        ))}
      </select>
    </div>
  );
}
