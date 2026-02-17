/**
 * Proactive insights engine.
 * Generates AI-driven insights based on patterns in journal, health, and location data.
 */
import type { HealthEntry } from './healthMetrics';

export type InsightType = 'mood-trend' | 'health-goal' | 'journaling-streak' | 'activity-pattern' | 'suggestion';
export type InsightPriority = 'high' | 'medium' | 'low';

export interface ProactiveInsight {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  title: string;
  description: string;
  actionLabel?: string;
  actionRoute?: string;
  generatedAt: number;
  dismissed: boolean;
}

interface JournalData {
  count: number;
  recentMoods: string[];
  lastEntryDate: number | null;
  streakDays: number;
}

const INSIGHT_CONFIG: Record<InsightType, { icon: string; color: string }> = {
  'mood-trend': { icon: '📊', color: 'border-blue-200 dark:border-blue-800' },
  'health-goal': { icon: '🎯', color: 'border-green-200 dark:border-green-800' },
  'journaling-streak': { icon: '🔥', color: 'border-orange-200 dark:border-orange-800' },
  'activity-pattern': { icon: '📈', color: 'border-purple-200 dark:border-purple-800' },
  'suggestion': { icon: '💡', color: 'border-amber-200 dark:border-amber-800' },
};

export { INSIGHT_CONFIG };

function createInsight(
  type: InsightType,
  priority: InsightPriority,
  title: string,
  description: string,
  actionLabel?: string,
  actionRoute?: string
): ProactiveInsight {
  return {
    id: crypto.randomUUID(),
    type,
    priority,
    title,
    description,
    actionLabel,
    actionRoute,
    generatedAt: Date.now(),
    dismissed: false,
  };
}

/**
 * Analyze mood trends from recent journal entries.
 */
function analyzeMoodTrends(journal: JournalData): ProactiveInsight[] {
  const insights: ProactiveInsight[] = [];
  const moods = journal.recentMoods;

  if (moods.length < 3) return insights;

  const lowMoods = moods.filter(m => m === 'bad' || m === 'low');
  const goodMoods = moods.filter(m => m === 'great' || m === 'good');

  if (lowMoods.length >= moods.length * 0.6) {
    insights.push(createInsight(
      'mood-trend', 'high',
      'Your mood has been trending low',
      'Most of your recent entries reflect lower moods. Consider what factors might be contributing, and try incorporating something that brings you joy today.',
      'Write about it', '/app/journal'
    ));
  } else if (goodMoods.length >= moods.length * 0.7) {
    insights.push(createInsight(
      'mood-trend', 'low',
      'You\'ve been in great spirits!',
      'Your recent mood has been consistently positive. What\'s been going well? Reflecting on this can help you sustain it.',
      'Reflect on it', '/app/journal'
    ));
  }

  return insights;
}

/**
 * Analyze journaling consistency.
 */
function analyzeJournalingStreak(journal: JournalData): ProactiveInsight[] {
  const insights: ProactiveInsight[] = [];

  if (journal.streakDays >= 7) {
    insights.push(createInsight(
      'journaling-streak', 'low',
      `${journal.streakDays}-day journaling streak!`,
      'You\'ve been writing consistently. Keep it up! Regular journaling builds self-awareness over time.',
    ));
  }

  if (journal.lastEntryDate) {
    const daysSince = Math.floor((Date.now() - journal.lastEntryDate) / 86_400_000);
    if (daysSince >= 3 && daysSince < 7) {
      insights.push(createInsight(
        'journaling-streak', 'medium',
        'Haven\'t journaled in a few days',
        `It's been ${daysSince} days since your last entry. Even a short entry helps maintain the habit.`,
        'Write now', '/app/journal'
      ));
    } else if (daysSince >= 7) {
      insights.push(createInsight(
        'journaling-streak', 'high',
        'Your journaling streak needs attention',
        `It's been ${daysSince} days since you last wrote. No pressure, but your future self will thank you for capturing today's thoughts.`,
        'Start writing', '/app/journal'
      ));
    }
  }

  return insights;
}

/**
 * Analyze health data for insights.
 */
function analyzeHealth(entries: HealthEntry[]): ProactiveInsight[] {
  const insights: ProactiveInsight[] = [];
  if (entries.length === 0) return insights;

  const recent = entries.filter(e => {
    const d = new Date(e.date);
    return Date.now() - d.getTime() < 7 * 86_400_000;
  });

  const stepEntries = recent.filter(e => e.type === 'steps');
  if (stepEntries.length >= 3) {
    const avgSteps = stepEntries.reduce((sum, e) => sum + e.value, 0) / stepEntries.length;
    if (avgSteps < 5000) {
      insights.push(createInsight(
        'health-goal', 'medium',
        'Activity level is below average',
        `You've averaged ${Math.round(avgSteps).toLocaleString()} steps this week. Try to increase daily movement, even with short walks.`,
        'Log activity', '/app/health'
      ));
    } else if (avgSteps >= 10000) {
      insights.push(createInsight(
        'health-goal', 'low',
        'Great activity levels!',
        `You've averaged ${Math.round(avgSteps).toLocaleString()} steps this week. You're hitting your goals consistently.`,
      ));
    }
  }

  const sleepEntries = recent.filter(e => e.type === 'sleep');
  if (sleepEntries.length >= 3) {
    const avgSleep = sleepEntries.reduce((sum, e) => sum + e.value, 0) / sleepEntries.length;
    if (avgSleep < 6) {
      insights.push(createInsight(
        'health-goal', 'high',
        'You might not be sleeping enough',
        `Your average sleep this week is ${avgSleep.toFixed(1)} hours. Adults typically need 7-9 hours for optimal health.`,
        'Track sleep', '/app/health'
      ));
    }
  }

  return insights;
}

/**
 * Generate general suggestions based on data availability.
 */
function generateSuggestions(journal: JournalData, healthCount: number): ProactiveInsight[] {
  const insights: ProactiveInsight[] = [];

  if (journal.count === 0) {
    insights.push(createInsight(
      'suggestion', 'medium',
      'Start your first journal entry',
      'Writing about your day is the first step to building self-awareness. It only takes a few minutes.',
      'Write now', '/app/journal'
    ));
  }

  if (healthCount === 0) {
    insights.push(createInsight(
      'suggestion', 'low',
      'Try tracking your health',
      'Logging steps, sleep, or water intake helps you spot patterns in your well-being over time.',
      'Get started', '/app/health'
    ));
  }

  return insights;
}

/**
 * Generate all proactive insights from available data.
 */
export function generateInsights(
  journal: JournalData,
  healthEntries: HealthEntry[]
): ProactiveInsight[] {
  const all = [
    ...analyzeMoodTrends(journal),
    ...analyzeJournalingStreak(journal),
    ...analyzeHealth(healthEntries),
    ...generateSuggestions(journal, healthEntries.length),
  ];

  return all.sort((a, b) => {
    const priorityOrder: Record<InsightPriority, number> = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
