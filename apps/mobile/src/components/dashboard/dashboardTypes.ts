export interface DashboardStats {
  totalRecordingTime: number;
  recordingCount: number;
  journalCount: number;
  brainDumpCount: number;
  taskCount: number;
  tasksCompleted: number;
  todayMood: number | null;
  todayEnergy: number | null;
  todayEntryCount: number;
  streakDays: number;
}

export interface RecentItem {
  id: string;
  type: 'recording' | 'journal' | 'brain-dump';
  title: string;
  subtitle: string;
  date: Date;
}

export interface DashboardCardConfig {
  id: DashboardCardId;
  visible: boolean;
  order: number;
}

export type DashboardCardId =
  | 'daily-summary'
  | 'progress-ring'
  | 'stats'
  | 'streak'
  | 'life-score'
  | 'quick-actions'
  | 'recent-activity'
  | 'suggested-prompt'
  | 'thought-of-day';

export interface StreakDay {
  date: string;
  entryCount: number;
  mood: number | null;
}

export interface LifeScoreDimension {
  label: string;
  score: number;
  color: string;
}
