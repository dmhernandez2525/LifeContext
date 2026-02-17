/**
 * HealthDashboard - Shows daily health metrics with goal progress.
 */
import { useMemo } from 'react';
import { useHealthStore } from '@/store/health-store';
import {
  METRIC_CONFIG,
  METRIC_TYPES,
  buildDailySummary,
  getGoalProgress,
  formatMetricValue,
  getLast7Days,
  type MetricType,
} from '@/lib/healthMetrics';
import { cn } from '@/lib/utils';

interface HealthDashboardProps {
  selectedDate: string;
}

export function HealthDashboard({ selectedDate }: HealthDashboardProps) {
  const { entries, goals } = useHealthStore();

  const summary = useMemo(
    () => buildDailySummary(entries, selectedDate),
    [entries, selectedDate]
  );

  const weekDays = useMemo(() => getLast7Days(), []);

  const summaryValues: Record<MetricType, number | undefined> = {
    steps: summary.steps,
    sleep: summary.sleepHours,
    heartRate: summary.avgHeartRate,
    weight: summary.weight,
    water: summary.waterMl,
    exercise: summary.exerciseMinutes,
  };

  return (
    <div className="space-y-4">
      {/* Metric cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {METRIC_TYPES.map(type => {
          const config = METRIC_CONFIG[type];
          const value = summaryValues[type];
          const goal = goals[type] ?? config.goal;
          const progress = value != null && goal > 0 ? getGoalProgress(value, type) : 0;

          return (
            <div
              key={type}
              className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{config.icon}</span>
                <span className="text-xs font-medium text-gray-500">{config.label}</span>
              </div>
              <p className={cn("text-lg font-bold", value != null ? config.color : "text-gray-300 dark:text-gray-600")}>
                {value != null ? formatMetricValue(value, type) : 'No data'}
              </p>
              {goal > 0 && value != null && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        progress >= 100 ? "bg-green-500" : "bg-indigo-500"
                      )}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{progress}% of goal</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mini week chart for steps */}
      <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-xs font-medium text-gray-500 mb-3">Steps this week</p>
        <div className="flex items-end gap-1 h-20">
          {weekDays.map(day => {
            const daySummary = buildDailySummary(entries, day);
            const steps = daySummary.steps ?? 0;
            const maxSteps = goals.steps ?? METRIC_CONFIG.steps.goal;
            const height = maxSteps > 0 ? Math.min((steps / maxSteps) * 100, 100) : 0;
            const isToday = day === selectedDate;

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t relative" style={{ height: '100%' }}>
                  <div
                    className={cn(
                      "absolute bottom-0 w-full rounded-t transition-all",
                      isToday ? "bg-indigo-500" : "bg-indigo-300 dark:bg-indigo-700"
                    )}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className={cn("text-xs", isToday ? "font-bold text-indigo-600" : "text-gray-400")}>
                  {new Date(day + 'T12:00:00').toLocaleDateString('en', { weekday: 'narrow' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
