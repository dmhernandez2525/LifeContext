import { useState, useCallback } from 'react';
import type { DashboardStats, RecentItem, StreakDay, LifeScoreDimension } from './dashboardTypes';
import {
  getTodayStats,
  getStreakData,
  calculateStreakDays,
  getLifeScoreDimensions,
  calculateOverallProgress,
} from './dashboardHelpers';
import * as storage from '../../lib/storage';

interface DashboardData {
  stats: DashboardStats;
  recentItems: RecentItem[];
  streakData: StreakDay[];
  lifeScoreDimensions: LifeScoreDimension[];
  overallProgress: number;
}

const emptyStats: DashboardStats = {
  totalRecordingTime: 0,
  recordingCount: 0,
  journalCount: 0,
  brainDumpCount: 0,
  taskCount: 0,
  tasksCompleted: 0,
  todayMood: null,
  todayEnergy: null,
  todayEntryCount: 0,
  streakDays: 0,
};

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    stats: emptyStats,
    recentItems: [],
    streakData: [],
    lifeScoreDimensions: [],
    overallProgress: 0,
  });

  const loadData = useCallback(() => {
    try {
      const recordings = storage.getRecordings();
      const journals = storage.getJournalEntries();
      const brainDumps = storage.getBrainDumps();
      const tasks = storage.getTasks();
      const todayStats = getTodayStats();
      const streakDays = calculateStreakDays();

      const totalRecordingTime = recordings.reduce(
        (sum, r) => sum + (r.duration || 0),
        0,
      );
      const tasksCompleted = tasks.filter((t) => t.status === 'done').length;

      const stats: DashboardStats = {
        totalRecordingTime,
        recordingCount: recordings.length,
        journalCount: journals.length,
        brainDumpCount: brainDumps.length,
        taskCount: tasks.length,
        tasksCompleted,
        todayMood: todayStats.mood,
        todayEnergy: todayStats.energy,
        todayEntryCount: todayStats.entryCount,
        streakDays,
      };

      const allItems: RecentItem[] = [];

      recordings.forEach((r) => {
        allItems.push({
          id: r.id,
          type: 'recording',
          title: 'Voice Recording',
          subtitle: r.transcriptionText?.slice(0, 50) || 'No transcript',
          date: new Date(r.createdAt),
        });
      });

      journals.forEach((j) => {
        allItems.push({
          id: j.id,
          type: 'journal',
          title: 'Journal Entry',
          subtitle: j.content?.slice(0, 50) || 'No content',
          date: new Date(j.createdAt),
        });
      });

      brainDumps.forEach((b) => {
        allItems.push({
          id: b.id,
          type: 'brain-dump',
          title: b.title || 'Brain Dump',
          subtitle:
            b.synthesis?.organizedContent?.slice(0, 50) || 'Processing...',
          date: new Date(b.createdAt),
        });
      });

      allItems.sort((a, b) => b.date.getTime() - a.date.getTime());

      setData({
        stats,
        recentItems: allItems.slice(0, 5),
        streakData: getStreakData(7),
        lifeScoreDimensions: getLifeScoreDimensions(),
        overallProgress: calculateOverallProgress(stats),
      });
    } catch {
      // Keep empty state on error
    }
  }, []);

  return { ...data, loadData };
}
