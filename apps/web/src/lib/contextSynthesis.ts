/**
 * Context synthesis engine.
 * Generates life summaries, periodic reports, and cross-category insights.
 */
import type { HealthEntry } from './healthMetrics';

export type ReportPeriod = 'week' | 'month' | 'quarter' | 'year';

export interface LifeSummary {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  generatedAt: number;
  sections: SummarySection[];
}

export interface SummarySection {
  title: string;
  icon: string;
  content: string;
  highlights: string[];
}

interface JournalStats {
  count: number;
  moods: Record<string, number>;
  topTags: string[];
  averageLength: number;
}

interface HealthStats {
  avgSteps: number;
  avgSleep: number;
  avgHeartRate: number;
  exerciseDays: number;
}

const PERIOD_DAYS: Record<ReportPeriod, number> = {
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
};

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  week: 'Weekly',
  month: 'Monthly',
  quarter: 'Quarterly',
  year: 'Annual',
};

export { PERIOD_LABELS };

/**
 * Calculate date range for a report period.
 */
export function getDateRange(period: ReportPeriod): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - PERIOD_DAYS[period]);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

/**
 * Analyze journal entries for a period.
 */
function analyzeJournals(
  entries: Array<{ date: Date | string; content: string | { data?: string }; mood?: string; tags?: string[] }>,
  startDate: string, endDate: string
): JournalStats {
  const startMs = new Date(startDate).getTime();
  const endMs = new Date(endDate).getTime();

  const filtered = entries.filter(e => {
    const d = e.date instanceof Date ? e.date.getTime() : new Date(e.date).getTime();
    return d >= startMs && d <= endMs;
  });

  const moods: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};
  let totalLength = 0;

  for (const entry of filtered) {
    if (entry.mood) moods[entry.mood] = (moods[entry.mood] ?? 0) + 1;
    const text = typeof entry.content === 'string' ? entry.content : (entry.content?.data ?? '');
    totalLength += text.length;
    for (const tag of entry.tags ?? []) {
      if (!tag.startsWith('import:') && !tag.startsWith('source:')) {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      }
    }
  }

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);

  return {
    count: filtered.length,
    moods,
    topTags,
    averageLength: filtered.length > 0 ? Math.round(totalLength / filtered.length) : 0,
  };
}

/**
 * Analyze health entries for a period.
 */
function analyzeHealth(entries: HealthEntry[], startDate: string, endDate: string): HealthStats {
  const filtered = entries.filter(e => e.date >= startDate && e.date <= endDate);

  const steps = filtered.filter(e => e.type === 'steps');
  const sleep = filtered.filter(e => e.type === 'sleep');
  const hr = filtered.filter(e => e.type === 'heartRate');
  const exercise = filtered.filter(e => e.type === 'exercise');

  const avg = (arr: HealthEntry[]) => arr.length > 0 ? arr.reduce((s, e) => s + e.value, 0) / arr.length : 0;
  const uniqueDays = new Set(exercise.map(e => e.date));

  return {
    avgSteps: Math.round(avg(steps)),
    avgSleep: parseFloat(avg(sleep).toFixed(1)),
    avgHeartRate: Math.round(avg(hr)),
    exerciseDays: uniqueDays.size,
  };
}

/**
 * Build the journal section of a life summary.
 */
function buildJournalSection(stats: JournalStats, period: ReportPeriod): SummarySection {
  const highlights: string[] = [];

  if (stats.count > 0) {
    highlights.push(`Wrote ${stats.count} journal entries`);
    highlights.push(`Average entry length: ${stats.averageLength} characters`);
  }

  const dominantMood = Object.entries(stats.moods).sort(([, a], [, b]) => b - a)[0];
  if (dominantMood) {
    highlights.push(`Most frequent mood: ${dominantMood[0]} (${dominantMood[1]} times)`);
  }

  if (stats.topTags.length > 0) {
    highlights.push(`Top topics: ${stats.topTags.join(', ')}`);
  }

  const content = stats.count === 0
    ? `No journal entries found for this ${period}. Try capturing your thoughts regularly to build a richer life context.`
    : `You wrote ${stats.count} entries this ${period}. ${dominantMood ? `Your predominant mood was "${dominantMood[0]}".` : ''} ${stats.topTags.length > 0 ? `Key themes include ${stats.topTags.slice(0, 3).join(', ')}.` : ''}`;

  return { title: 'Journal Activity', icon: '📔', content, highlights };
}

/**
 * Build the health section of a life summary.
 */
function buildHealthSection(stats: HealthStats, period: ReportPeriod): SummarySection {
  const highlights: string[] = [];
  const hasData = stats.avgSteps > 0 || stats.avgSleep > 0;

  if (stats.avgSteps > 0) highlights.push(`Average daily steps: ${stats.avgSteps.toLocaleString()}`);
  if (stats.avgSleep > 0) highlights.push(`Average sleep: ${stats.avgSleep}h per night`);
  if (stats.avgHeartRate > 0) highlights.push(`Average heart rate: ${stats.avgHeartRate} bpm`);
  if (stats.exerciseDays > 0) highlights.push(`Exercised on ${stats.exerciseDays} days`);

  const content = !hasData
    ? `No health data recorded for this ${period}. Start tracking metrics to see trends over time.`
    : `This ${period}, you averaged ${stats.avgSteps.toLocaleString()} steps daily${stats.avgSleep > 0 ? ` and ${stats.avgSleep}h of sleep` : ''}.${stats.exerciseDays > 0 ? ` You exercised on ${stats.exerciseDays} days.` : ''}`;

  return { title: 'Health Overview', icon: '💪', content, highlights };
}

/**
 * Generate a life summary for a given period.
 */
export function generateLifeSummary(
  period: ReportPeriod,
  journals: Array<{ date: Date | string; content: string | { data?: string }; mood?: string; tags?: string[] }>,
  healthEntries: HealthEntry[]
): LifeSummary {
  const { start, end } = getDateRange(period);
  const journalStats = analyzeJournals(journals, start, end);
  const healthStats = analyzeHealth(healthEntries, start, end);

  const sections: SummarySection[] = [
    buildJournalSection(journalStats, period),
    buildHealthSection(healthStats, period),
  ];

  return {
    period,
    startDate: start,
    endDate: end,
    generatedAt: Date.now(),
    sections,
  };
}
