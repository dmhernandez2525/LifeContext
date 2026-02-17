/**
 * useRoadmap - Hook for roadmap data.
 * Provides mock data fallback when Convex is not configured.
 */
import { useMemo } from 'react';

export interface RoadmapItem {
  _id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed';
  priority: number;
  quarter?: string;
  progress?: number;
  completedDate?: string;
  upvotes: number;
  linkedFeatureCount: number;
  milestone?: string;
}

const MOCK_ROADMAP: RoadmapItem[] = [
  { _id: 'r1', title: 'Mobile App (iOS & Android)', description: 'Native mobile app with offline-first sync', status: 'in_progress', priority: 1, progress: 80, upvotes: 234, linkedFeatureCount: 3, milestone: 'Mobile Launch' },
  { _id: 'r2', title: 'Advanced AI Insights', description: 'GPT-4 powered pattern recognition and suggestions', status: 'planned', priority: 2, quarter: 'Q1 2026', upvotes: 112, linkedFeatureCount: 2, milestone: 'AI v2' },
  { _id: 'r3', title: 'Google Calendar Integration', description: 'Sync life planning tasks with Google Calendar', status: 'planned', priority: 3, quarter: 'Q1 2026', upvotes: 89, linkedFeatureCount: 1 },
  { _id: 'r4', title: 'Family Sharing', description: 'Share specific journals with family members', status: 'planned', priority: 4, quarter: 'Q2 2026', upvotes: 67, linkedFeatureCount: 1, milestone: 'Social Features' },
  { _id: 'r5', title: 'Data Reclamation', description: 'Export your data from major platforms', status: 'in_progress', priority: 5, progress: 75, upvotes: 156, linkedFeatureCount: 4 },
  { _id: 'r6', title: 'Life Planning Kanban', description: 'Visual task management for life goals', status: 'in_progress', priority: 6, progress: 90, upvotes: 98, linkedFeatureCount: 2 },
  { _id: 'r7', title: 'Onboarding Wizard', description: 'Guided setup for new users', status: 'completed', priority: 7, completedDate: '2026-01-15', upvotes: 45, linkedFeatureCount: 1 },
  { _id: 'r8', title: 'Daily Journaling', description: 'Voice, video, and text journal entries', status: 'completed', priority: 8, completedDate: '2026-01-11', upvotes: 189, linkedFeatureCount: 3 },
  { _id: 'r9', title: 'Emergency Access', description: "Dead man's switch with Shamir's Secret Sharing", status: 'completed', priority: 9, completedDate: '2026-01-10', upvotes: 78, linkedFeatureCount: 1 },
  { _id: 'r10', title: 'Cloud Backup', description: 'Google Drive and OneDrive backup support', status: 'completed', priority: 10, completedDate: '2026-01-11', upvotes: 134, linkedFeatureCount: 2 },
  { _id: 'r11', title: 'Brain Dump Mode', description: 'Quick voice dump with AI synthesis', status: 'completed', priority: 11, completedDate: '2026-01-10', upvotes: 92, linkedFeatureCount: 1 },
];

interface RoadmapGrouped {
  planned: RoadmapItem[];
  in_progress: RoadmapItem[];
  completed: RoadmapItem[];
}

export function useRoadmap() {
  const grouped = useMemo<RoadmapGrouped>(() => {
    const result: RoadmapGrouped = { planned: [], in_progress: [], completed: [] };
    for (const item of MOCK_ROADMAP) {
      result[item.status].push(item);
    }
    return result;
  }, []);

  const milestones = useMemo(() => {
    const map = new Map<string, RoadmapItem[]>();
    for (const item of MOCK_ROADMAP) {
      if (item.milestone) {
        const list = map.get(item.milestone) ?? [];
        list.push(item);
        map.set(item.milestone, list);
      }
    }
    return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
  }, []);

  const stats = useMemo(() => ({
    planned: grouped.planned.length,
    inProgress: grouped.in_progress.length,
    completed: grouped.completed.length,
    total: MOCK_ROADMAP.length,
    totalVotes: MOCK_ROADMAP.reduce((sum, i) => sum + i.upvotes, 0),
  }), [grouped]);

  return { grouped, milestones, stats };
}
