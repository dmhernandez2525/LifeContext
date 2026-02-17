/**
 * Health metrics engine for tracking daily health data.
 * Supports manual entry and Apple Health XML/CSV import.
 */

export type MetricType = 'steps' | 'sleep' | 'heartRate' | 'weight' | 'water' | 'exercise';

export interface HealthEntry {
  id: string;
  date: string;
  type: MetricType;
  value: number;
  unit: string;
  source: 'manual' | 'apple-health' | 'import';
  createdAt: number;
}

export interface DailySummary {
  date: string;
  steps?: number;
  sleepHours?: number;
  avgHeartRate?: number;
  weight?: number;
  waterMl?: number;
  exerciseMinutes?: number;
}

export const METRIC_CONFIG: Record<MetricType, { label: string; unit: string; icon: string; color: string; goal: number }> = {
  steps: { label: 'Steps', unit: 'steps', icon: '👟', color: 'text-blue-600', goal: 10000 },
  sleep: { label: 'Sleep', unit: 'hours', icon: '😴', color: 'text-indigo-600', goal: 8 },
  heartRate: { label: 'Heart Rate', unit: 'bpm', icon: '❤️', color: 'text-red-600', goal: 70 },
  weight: { label: 'Weight', unit: 'kg', icon: '⚖️', color: 'text-amber-600', goal: 0 },
  water: { label: 'Water', unit: 'ml', icon: '💧', color: 'text-cyan-600', goal: 2500 },
  exercise: { label: 'Exercise', unit: 'min', icon: '🏃', color: 'text-green-600', goal: 30 },
};

export const METRIC_TYPES: MetricType[] = ['steps', 'sleep', 'heartRate', 'weight', 'water', 'exercise'];

/**
 * Build a daily summary from individual health entries.
 */
export function buildDailySummary(entries: HealthEntry[], date: string): DailySummary {
  const dayEntries = entries.filter(e => e.date === date);
  const summary: DailySummary = { date };

  const byType = (type: MetricType) => dayEntries.filter(e => e.type === type);

  const stepEntries = byType('steps');
  if (stepEntries.length > 0) summary.steps = stepEntries.reduce((sum, e) => sum + e.value, 0);

  const sleepEntries = byType('sleep');
  if (sleepEntries.length > 0) summary.sleepHours = sleepEntries.reduce((sum, e) => sum + e.value, 0);

  const hrEntries = byType('heartRate');
  if (hrEntries.length > 0) summary.avgHeartRate = Math.round(hrEntries.reduce((sum, e) => sum + e.value, 0) / hrEntries.length);

  const weightEntries = byType('weight');
  if (weightEntries.length > 0) summary.weight = weightEntries[weightEntries.length - 1].value;

  const waterEntries = byType('water');
  if (waterEntries.length > 0) summary.waterMl = waterEntries.reduce((sum, e) => sum + e.value, 0);

  const exerciseEntries = byType('exercise');
  if (exerciseEntries.length > 0) summary.exerciseMinutes = exerciseEntries.reduce((sum, e) => sum + e.value, 0);

  return summary;
}

/**
 * Calculate a weekly average for a metric type.
 */
export function getWeeklyAverage(entries: HealthEntry[], type: MetricType, endDate: string): number {
  const end = new Date(endDate);
  const start = new Date(end);
  start.setDate(start.getDate() - 7);

  const weekEntries = entries.filter(e => {
    if (e.type !== type) return false;
    const d = new Date(e.date);
    return d >= start && d <= end;
  });

  if (weekEntries.length === 0) return 0;

  const total = weekEntries.reduce((sum, e) => sum + e.value, 0);
  return type === 'heartRate' || type === 'weight'
    ? Math.round(total / weekEntries.length)
    : Math.round(total / 7);
}

/**
 * Calculate goal progress as a percentage (0-100+).
 */
export function getGoalProgress(value: number, type: MetricType): number {
  const goal = METRIC_CONFIG[type].goal;
  if (goal <= 0) return 0;
  return Math.round((value / goal) * 100);
}

/**
 * Format a metric value for display.
 */
export function formatMetricValue(value: number, type: MetricType): string {
  const config = METRIC_CONFIG[type];
  if (type === 'sleep') return `${value.toFixed(1)}h`;
  if (type === 'weight') return `${value.toFixed(1)} ${config.unit}`;
  if (type === 'water') return `${value} ml`;
  return `${Math.round(value).toLocaleString()} ${config.unit}`;
}

/**
 * Get the last 7 dates as YYYY-MM-DD strings.
 */
export function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}
