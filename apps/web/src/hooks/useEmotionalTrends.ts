/**
 * useEmotionalTrends - Analyze emotional patterns over time
 * 
 * Analyzes journal entries and recordings to detect:
 * - Mood trends over weeks/months
 * - Emotional correlations with events
 * - Peak positive/negative periods
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@lcc/storage';
import type { JournalMood } from '@lcc/types';

// ============================================================
// TYPES
// ============================================================

export interface MoodDataPoint {
  date: Date;
  mood: JournalMood;
  moodScore: number; // 1-5 scale
  energyLevel?: number;
  tags: string[];
  entryId: string;
}

export interface EmotionalPeriod {
  startDate: Date;
  endDate: Date;
  averageMood: number;
  label: 'great' | 'good' | 'neutral' | 'challenging' | 'difficult';
  dominantTags: string[];
  entryCount: number;
}

export interface EmotionalCorrelation {
  tag: string;
  averageMood: number;
  occurrences: number;
  isPositive: boolean;
}

export interface EmotionalInsight {
  id: string;
  type: 'trend' | 'correlation' | 'pattern' | 'warning';
  title: string;
  description: string;
  significance: number; // 0-1
  actionable?: string;
}

export interface UseEmotionalTrendsReturn {
  moodData: MoodDataPoint[];
  periods: EmotionalPeriod[];
  correlations: EmotionalCorrelation[];
  insights: EmotionalInsight[];
  averageMood: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  isLoading: boolean;
  refresh: () => Promise<void>;
}

// ============================================================
// HELPERS
// ============================================================

const MOOD_SCORES: Record<JournalMood, number> = {
  'great': 5,
  'good': 4,
  'okay': 3,
  'low': 2,
  'bad': 1,
};

function getMoodLabel(score: number): EmotionalPeriod['label'] {
  if (score >= 4.5) return 'great';
  if (score >= 3.5) return 'good';
  if (score >= 2.5) return 'neutral';
  if (score >= 1.5) return 'challenging';
  return 'difficult';
}

// ============================================================
// HOOK
// ============================================================

export function useEmotionalTrends(): UseEmotionalTrendsReturn {
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const journalEntries = await db.journalEntries.toArray();
      
      // Convert journal entries to mood data points
      const dataPoints: MoodDataPoint[] = journalEntries
        .filter(entry => entry.mood)
        .map(entry => ({
          date: new Date(entry.date),
          mood: entry.mood as JournalMood,
          moodScore: MOOD_SCORES[entry.mood as JournalMood] || 3,
          energyLevel: entry.energyLevel,
          tags: entry.tags || [],
          entryId: entry.id,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      setMoodData(dataPoints);
    } catch (err) {
      console.error('Failed to load emotional trends:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate average mood
  const averageMood = useMemo(() => {
    if (moodData.length === 0) return 3;
    const sum = moodData.reduce((acc, d) => acc + d.moodScore, 0);
    return sum / moodData.length;
  }, [moodData]);

  // Determine mood trend (compare last 7 days to previous 7 days)
  const moodTrend = useMemo(() => {
    if (moodData.length < 7) return 'stable';
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const recentData = moodData.filter(d => d.date >= weekAgo);
    const previousData = moodData.filter(d => d.date >= twoWeeksAgo && d.date < weekAgo);
    
    if (recentData.length === 0 || previousData.length === 0) return 'stable';
    
    const recentAvg = recentData.reduce((sum, d) => sum + d.moodScore, 0) / recentData.length;
    const previousAvg = previousData.reduce((sum, d) => sum + d.moodScore, 0) / previousData.length;
    
    const diff = recentAvg - previousAvg;
    if (diff > 0.3) return 'improving';
    if (diff < -0.3) return 'declining';
    return 'stable';
  }, [moodData]);

  // Calculate emotional periods (group by weeks)
  const periods = useMemo((): EmotionalPeriod[] => {
    if (moodData.length === 0) return [];
    
    const weeklyGroups: Map<string, MoodDataPoint[]> = new Map();
    
    moodData.forEach(d => {
      const weekStart = new Date(d.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const key = weekStart.toISOString().split('T')[0];
      
      if (!weeklyGroups.has(key)) {
        weeklyGroups.set(key, []);
      }
      weeklyGroups.get(key)!.push(d);
    });
    
    return Array.from(weeklyGroups.entries())
      .map(([weekKey, dataPoints]) => {
        const avgMood = dataPoints.reduce((sum, d) => sum + d.moodScore, 0) / dataPoints.length;
        const allTags = dataPoints.flatMap(d => d.tags);
        const tagCounts = allTags.reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const dominantTags = Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([tag]) => tag);
        
        return {
          startDate: new Date(weekKey),
          endDate: new Date(new Date(weekKey).getTime() + 6 * 24 * 60 * 60 * 1000),
          averageMood: avgMood,
          label: getMoodLabel(avgMood),
          dominantTags,
          entryCount: dataPoints.length,
        };
      })
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }, [moodData]);

  // Calculate tag correlations with mood
  const correlations = useMemo((): EmotionalCorrelation[] => {
    const tagData: Map<string, { total: number; count: number }> = new Map();
    
    moodData.forEach(d => {
      d.tags.forEach(tag => {
        if (!tagData.has(tag)) {
          tagData.set(tag, { total: 0, count: 0 });
        }
        const data = tagData.get(tag)!;
        data.total += d.moodScore;
        data.count += 1;
      });
    });
    
    return Array.from(tagData.entries())
      .filter(([_, data]) => data.count >= 2) // At least 2 occurrences
      .map(([tag, data]) => ({
        tag,
        averageMood: data.total / data.count,
        occurrences: data.count,
        isPositive: (data.total / data.count) >= 3.5,
      }))
      .sort((a, b) => b.averageMood - a.averageMood);
  }, [moodData]);

  // Generate insights
  const insights = useMemo((): EmotionalInsight[] => {
    const result: EmotionalInsight[] = [];
    
    // Trend insight
    if (moodTrend === 'improving') {
      result.push({
        id: 'trend-improving',
        type: 'trend',
        title: 'Mood Improving',
        description: 'Your mood has been trending upward over the past week compared to the previous week.',
        significance: 0.8,
        actionable: 'Consider noting what changes you made that might be contributing to this improvement.',
      });
    } else if (moodTrend === 'declining') {
      result.push({
        id: 'trend-declining',
        type: 'warning',
        title: 'Mood Declining',
        description: 'Your mood has been trending downward over the past week. Be gentle with yourself.',
        significance: 0.9,
        actionable: 'Consider reaching out to a friend, therapist, or trying a self-care activity.',
      });
    }
    
    // Positive correlations
    const positiveCorrelations = correlations.filter(c => c.isPositive && c.occurrences >= 3);
    if (positiveCorrelations.length > 0) {
      const topPositive = positiveCorrelations[0];
      result.push({
        id: `correlation-positive-${topPositive.tag}`,
        type: 'correlation',
        title: `"${topPositive.tag}" Boosts Your Mood`,
        description: `Entries tagged with "${topPositive.tag}" have an average mood score of ${topPositive.averageMood.toFixed(1)}/5.`,
        significance: 0.7,
        actionable: `Consider incorporating more "${topPositive.tag}" into your routine.`,
      });
    }
    
    // Negative correlations
    const negativeCorrelations = correlations.filter(c => !c.isPositive && c.occurrences >= 3);
    if (negativeCorrelations.length > 0) {
      const topNegative = negativeCorrelations[negativeCorrelations.length - 1];
      result.push({
        id: `correlation-negative-${topNegative.tag}`,
        type: 'pattern',
        title: `"${topNegative.tag}" Often Accompanies Lower Mood`,
        description: `Entries tagged with "${topNegative.tag}" have an average mood score of ${topNegative.averageMood.toFixed(1)}/5.`,
        significance: 0.75,
        actionable: `Explore what about "${topNegative.tag}" might be affecting your wellbeing.`,
      });
    }
    
    // Consistency insight
    if (moodData.length >= 7) {
      result.push({
        id: 'consistency',
        type: 'pattern',
        title: 'Regular Check-ins',
        description: `You've recorded ${moodData.length} mood entries. Consistent tracking helps reveal patterns.`,
        significance: 0.5,
      });
    }
    
    return result;
  }, [moodTrend, correlations, moodData.length]);

  return {
    moodData,
    periods,
    correlations,
    insights,
    averageMood,
    moodTrend,
    isLoading,
    refresh: loadData,
  };
}

export default useEmotionalTrends;
