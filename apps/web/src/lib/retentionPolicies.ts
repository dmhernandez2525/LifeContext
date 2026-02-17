/**
 * Data retention policy engine.
 * Defines rules for automatic data purging based on age, type, and privacy level.
 */

const MS_PER_DAY = 86_400_000;

export type DataCategory = 'journal' | 'brainDump' | 'questions' | 'browserHistory' | 'cookies' | 'voiceDocs';
export type RetentionPeriod = 'forever' | '30d' | '90d' | '180d' | '1y' | '2y' | '5y';

export interface RetentionPolicy {
  category: DataCategory;
  period: RetentionPeriod;
  enabled: boolean;
}

export interface RetentionConfig {
  policies: RetentionPolicy[];
  autoDelete: boolean;
  lastPurge: number | null;
  purgeIntervalDays: number;
}

export const CATEGORY_LABELS: Record<DataCategory, string> = {
  journal: 'Journal Entries',
  brainDump: 'Brain Dumps',
  questions: 'Question Answers',
  browserHistory: 'Browser History',
  cookies: 'Cookie Domains',
  voiceDocs: 'Voice Docs Conversations',
};

export const PERIOD_LABELS: Record<RetentionPeriod, string> = {
  forever: 'Keep forever',
  '30d': '30 days',
  '90d': '90 days',
  '180d': '6 months',
  '1y': '1 year',
  '2y': '2 years',
  '5y': '5 years',
};

export const PERIOD_VALUES: RetentionPeriod[] = ['forever', '30d', '90d', '180d', '1y', '2y', '5y'];

const PERIOD_TO_DAYS: Record<RetentionPeriod, number> = {
  forever: Infinity,
  '30d': 30,
  '90d': 90,
  '180d': 180,
  '1y': 365,
  '2y': 730,
  '5y': 1825,
};

export const DEFAULT_POLICIES: RetentionPolicy[] = [
  { category: 'journal', period: 'forever', enabled: true },
  { category: 'brainDump', period: 'forever', enabled: true },
  { category: 'questions', period: 'forever', enabled: true },
  { category: 'browserHistory', period: '1y', enabled: true },
  { category: 'cookies', period: '90d', enabled: true },
  { category: 'voiceDocs', period: '180d', enabled: true },
];

export const DEFAULT_CONFIG: RetentionConfig = {
  policies: DEFAULT_POLICIES,
  autoDelete: false,
  lastPurge: null,
  purgeIntervalDays: 7,
};

/**
 * Calculate the cutoff date for a retention period.
 * Returns null for 'forever' (no cutoff).
 */
export function getCutoffDate(period: RetentionPeriod): Date | null {
  if (period === 'forever') return null;
  const days = PERIOD_TO_DAYS[period];
  return new Date(Date.now() - days * MS_PER_DAY);
}

/**
 * Check if a purge is due based on the last purge date and interval.
 */
export function isPurgeDue(lastPurge: number | null, intervalDays: number): boolean {
  if (!lastPurge) return true;
  return (Date.now() - lastPurge) / MS_PER_DAY >= intervalDays;
}

/**
 * Count items that would be purged for a given category and period.
 */
export function countExpiredItems(
  items: Array<{ date?: string; timestamp?: number; visitTime?: number }>,
  period: RetentionPeriod
): number {
  const cutoff = getCutoffDate(period);
  if (!cutoff) return 0;
  const cutoffMs = cutoff.getTime();

  return items.filter(item => {
    const time = item.timestamp ?? item.visitTime ?? (item.date ? new Date(item.date).getTime() : 0);
    return time > 0 && time < cutoffMs;
  }).length;
}

/**
 * Get a summary of what would be purged across all policies.
 */
export interface PurgeSummary {
  category: DataCategory;
  label: string;
  period: RetentionPeriod;
  periodLabel: string;
  itemCount: number;
}

export function getPurgeSummary(
  policies: RetentionPolicy[],
  dataCounts: Partial<Record<DataCategory, number>>
): PurgeSummary[] {
  return policies
    .filter(p => p.enabled && p.period !== 'forever')
    .map(p => ({
      category: p.category,
      label: CATEGORY_LABELS[p.category],
      period: p.period,
      periodLabel: PERIOD_LABELS[p.period],
      itemCount: dataCounts[p.category] ?? 0,
    }));
}
