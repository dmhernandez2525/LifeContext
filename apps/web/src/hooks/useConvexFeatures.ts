/**
 * useFeatureRequests - Hook for feature request data.
 * Provides mock data fallback when Convex is not configured.
 * When VITE_CONVEX_URL is set, pages should use Convex hooks directly.
 */
import { useState, useCallback, useMemo } from 'react';

export interface FeatureRequest {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  upvotes: number;
  downvotes: number;
  submittedBy?: string;
  email?: string;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
}

const MOCK_FEATURES: FeatureRequest[] = [
  {
    _id: 'mock-1',
    title: 'Dark mode for mobile app',
    description: 'Add dark mode support to the upcoming mobile app for comfortable nighttime journaling.',
    category: 'feature',
    status: 'planned',
    upvotes: 127,
    downvotes: 3,
    isPublic: true,
    createdAt: new Date('2026-01-05').getTime(),
    updatedAt: new Date('2026-01-05').getTime(),
  },
  {
    _id: 'mock-2',
    title: 'Google Calendar integration',
    description: 'Sync life planning tasks with Google Calendar for due date reminders.',
    category: 'integration',
    status: 'in_progress',
    upvotes: 89,
    downvotes: 5,
    isPublic: true,
    createdAt: new Date('2026-01-08').getTime(),
    updatedAt: new Date('2026-01-08').getTime(),
  },
  {
    _id: 'mock-3',
    title: 'Voice-to-text transcription improvements',
    description: 'Improve accuracy of voice transcription, especially for accents and technical terms.',
    category: 'feature',
    status: 'pending',
    upvotes: 56,
    downvotes: 2,
    isPublic: true,
    createdAt: new Date('2026-01-10').getTime(),
    updatedAt: new Date('2026-01-10').getTime(),
  },
  {
    _id: 'mock-4',
    title: 'Multiple journal backup locations',
    description: 'Allow backups to multiple cloud providers simultaneously (Google Drive + Dropbox).',
    category: 'feature',
    status: 'completed',
    upvotes: 42,
    downvotes: 1,
    isPublic: true,
    createdAt: new Date('2025-12-20').getTime(),
    updatedAt: new Date('2025-12-20').getTime(),
  },
];

interface UseFeatureRequestsOptions {
  status?: string;
  category?: string;
}

/**
 * Check whether Convex backend is configured.
 */
export function isConvexConfigured(): boolean {
  return Boolean(import.meta.env.VITE_CONVEX_URL);
}

/**
 * Local-only feature requests hook for demo/offline mode.
 * When Convex is deployed, pages use useQuery/useMutation directly.
 */
export function useLocalFeatureRequests(options: UseFeatureRequestsOptions = {}) {
  const [features, setFeatures] = useState<FeatureRequest[]>(MOCK_FEATURES);
  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({});

  const filtered = useMemo(() => {
    let result = features;
    if (options.status && options.status !== 'all') {
      result = result.filter(f => f.status === options.status);
    }
    if (options.category && options.category !== 'all') {
      result = result.filter(f => f.category === options.category);
    }
    return result.sort((a, b) => b.upvotes - a.upvotes);
  }, [features, options.status, options.category]);

  const submitFeature = useCallback((data: {
    title: string;
    description: string;
    category: string;
    email?: string;
  }) => {
    const now = Date.now();
    const newFeature: FeatureRequest = {
      _id: `local-${now}`,
      title: data.title,
      description: data.description,
      category: data.category,
      email: data.email,
      status: 'pending',
      upvotes: 1,
      downvotes: 0,
      isPublic: true,
      createdAt: now,
      updatedAt: now,
    };
    setFeatures(prev => [newFeature, ...prev]);
    setVotes(prev => ({ ...prev, [newFeature._id]: 'up' }));
  }, []);

  const voteOnFeature = useCallback((featureId: string, voteType: 'up' | 'down') => {
    const currentVote = votes[featureId];

    setFeatures(prev => prev.map(f => {
      if (f._id !== featureId) return f;
      if (currentVote === voteType) {
        const key = voteType === 'up' ? 'upvotes' : 'downvotes';
        return { ...f, [key]: f[key] - 1 };
      }
      if (currentVote) {
        return {
          ...f,
          upvotes: voteType === 'up' ? f.upvotes + 1 : f.upvotes - 1,
          downvotes: voteType === 'down' ? f.downvotes + 1 : f.downvotes - 1,
        };
      }
      const key = voteType === 'up' ? 'upvotes' : 'downvotes';
      return { ...f, [key]: f[key] + 1 };
    }));

    setVotes(prev => ({
      ...prev,
      [featureId]: currentVote === voteType ? null : voteType,
    }));
  }, [votes]);

  const getVoteStatus = useCallback(
    (featureId: string): 'up' | 'down' | null => votes[featureId] ?? null,
    [votes]
  );

  return { features: filtered, isLoading: false, submitFeature, voteOnFeature, getVoteStatus };
}
