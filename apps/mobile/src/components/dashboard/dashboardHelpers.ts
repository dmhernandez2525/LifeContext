import type { DashboardStats, StreakDay, LifeScoreDimension } from './dashboardTypes';
import * as storage from '../../lib/storage';

export function formatRecordingTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} min`;
}

export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function calculateOverallProgress(stats: DashboardStats): number {
  const recordingScore = Math.min(stats.recordingCount * 10, 30);
  const journalScore = Math.min(stats.journalCount * 10, 30);
  const brainDumpScore = Math.min(stats.brainDumpCount * 15, 20);
  const taskScore =
    stats.taskCount > 0
      ? Math.min((stats.tasksCompleted / stats.taskCount) * 20, 20)
      : 0;

  return Math.min(recordingScore + journalScore + brainDumpScore + taskScore, 100);
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function getTodayStats(): {
  mood: number | null;
  energy: number | null;
  entryCount: number;
} {
  const today = new Date();
  const journals = storage.getJournalEntries();

  const todayJournals = journals.filter((j) =>
    isSameDay(new Date(j.createdAt), today),
  );

  const moodEntries = todayJournals.filter((j) => j.mood != null);
  const avgMood =
    moodEntries.length > 0
      ? moodEntries.reduce((sum, j) => sum + (j.mood ?? 0), 0) / moodEntries.length
      : null;

  return {
    mood: avgMood,
    energy: null,
    entryCount: todayJournals.length,
  };
}

export function getStreakData(days: number = 7): StreakDay[] {
  const journals = storage.getJournalEntries();
  const result: StreakDay[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayJournals = journals.filter((j) =>
      isSameDay(new Date(j.createdAt), date),
    );

    const moodEntries = dayJournals.filter((j) => j.mood != null);
    const avgMood =
      moodEntries.length > 0
        ? moodEntries.reduce((sum, j) => sum + (j.mood ?? 0), 0) / moodEntries.length
        : null;

    result.push({
      date: dateStr,
      entryCount: dayJournals.length,
      mood: avgMood,
    });
  }

  return result;
}

export function calculateStreakDays(): number {
  const journals = storage.getJournalEntries();
  if (journals.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);

    const hasEntry = journals.some((j) =>
      isSameDay(new Date(j.createdAt), checkDate),
    );

    if (hasEntry) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

export function getLifeScoreDimensions(): LifeScoreDimension[] {
  const journals = storage.getJournalEntries();
  const recordings = storage.getRecordings();
  const tasks = storage.getTasks();

  const journalScore = Math.min(journals.length * 5, 100);
  const recordingScore = Math.min(recordings.length * 10, 100);
  const taskCompletion =
    tasks.length > 0
      ? Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100)
      : 0;

  const moodEntries = journals.filter((j) => j.mood != null);
  const avgMood =
    moodEntries.length > 0
      ? Math.round(
          (moodEntries.reduce((sum, j) => sum + (j.mood ?? 0), 0) / moodEntries.length) * 20,
        )
      : 0;

  return [
    { label: 'Reflection', score: journalScore, color: '#10b981' },
    { label: 'Expression', score: recordingScore, color: '#3b82f6' },
    { label: 'Goals', score: taskCompletion, color: '#f59e0b' },
    { label: 'Wellbeing', score: avgMood, color: '#ec4899' },
    { label: 'Consistency', score: Math.min(calculateStreakDays() * 14, 100), color: '#8b5cf6' },
  ];
}
