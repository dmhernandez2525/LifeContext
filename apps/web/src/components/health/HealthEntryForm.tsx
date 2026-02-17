/**
 * HealthEntryForm - Quick-add form for health metrics.
 */
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useHealthStore } from '@/store/health-store';
import { METRIC_CONFIG, METRIC_TYPES, type MetricType } from '@/lib/healthMetrics';
import { cn } from '@/lib/utils';

interface HealthEntryFormProps {
  selectedDate: string;
}

export function HealthEntryForm({ selectedDate }: HealthEntryFormProps) {
  const { addEntry } = useHealthStore();
  const [type, setType] = useState<MetricType>('steps');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;

    addEntry({
      date: selectedDate,
      type,
      value: numValue,
      unit: METRIC_CONFIG[type].unit,
      source: 'manual',
    });
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <label className="text-xs font-medium text-gray-500 mb-1 block">Metric</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as MetricType)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
        >
          {METRIC_TYPES.map(t => (
            <option key={t} value={t}>
              {METRIC_CONFIG[t].icon} {METRIC_CONFIG[t].label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="text-xs font-medium text-gray-500 mb-1 block">
          Value ({METRIC_CONFIG[type].unit})
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`e.g. ${METRIC_CONFIG[type].goal || '70'}`}
          min="0"
          step={type === 'sleep' || type === 'weight' ? '0.1' : '1'}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={!value || parseFloat(value) <= 0}
        className={cn(
          "p-2 rounded-lg text-white transition-colors",
          value && parseFloat(value) > 0
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
        )}
      >
        <Plus className="w-5 h-5" />
      </button>
    </form>
  );
}
