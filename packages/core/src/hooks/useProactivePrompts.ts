/**
 * useProactivePrompts - AI-driven proactive prompting system
 *
 * Platform-agnostic hook that generates contextual prompts based on:
 * - Time-based triggers (anniversaries, gaps)
 * - Mood-based suggestions
 * - Follow-up questions from previous entries
 * - Cross-references and connections
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@lcc/storage';

// ============================================================
// TYPES
// ============================================================

export interface ProactivePrompt {
  id: string;
  type: 'anniversary' | 'gap' | 'follow-up' | 'mood-based' | 'connection';
  title: string;
  description: string;
  suggestedQuestion?: string;
  triggerContext: string;
  priority: 'high' | 'medium' | 'low';
  dismissedAt?: Date;
  createdAt: Date;
}

export interface AnniversaryEvent {
  originalDate: Date;
  yearsAgo: number;
  title: string;
  excerpt: string;
  sourceId: string;
  sourceType: 'recording' | 'journal';
}

export interface UseProactivePromptsReturn {
  prompts: ProactivePrompt[];
  anniversaries: AnniversaryEvent[];
  hasNewPrompts: boolean;
  dismissPrompt: (id: string) => void;
  refresh: () => Promise<void>;
  isLoading: boolean;
}

// ============================================================
// HELPERS
// ============================================================

function decodeBase64(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    return encoded;
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
  );
}

function isWithinDays(date1: Date, date2: Date, days: number): boolean {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  return diff <= days * 24 * 60 * 60 * 1000;
}

function getYearsAgo(date: Date): number {
  const now = new Date();
  return now.getFullYear() - date.getFullYear();
}

// ============================================================
// CATEGORY NAMES (used for gap detection)
// ============================================================

const CATEGORY_NAMES: Record<string, string> = {
  el: 'Early Life',
  fr: 'Family & Relationships',
  vb: 'Values & Beliefs',
  cw: 'Career & Work',
  da: 'Dreams & Aspirations',
  fc: 'Fears & Challenges',
  ss: 'Strengths',
  wg: 'Weaknesses',
  hi: 'Hobbies',
  hw: 'Health & Wellness',
  pw: 'Philosophy',
  ac: 'Accomplishments',
  rl: 'Regrets & Lessons',
  li: 'Legacy',
};

// ============================================================
// HOOK
// ============================================================

export function useProactivePrompts(): UseProactivePromptsReturn {
  const [prompts, setPrompts] = useState<ProactivePrompt[]>([]);
  const [anniversaries, setAnniversaries] = useState<AnniversaryEvent[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [recordings, journals] = await Promise.all([
        db.recordings.toArray(),
        db.journalEntries.toArray(),
      ]);

      const today = new Date();
      const newPrompts: ProactivePrompt[] = [];
      const newAnniversaries: AnniversaryEvent[] = [];

      // ============================================================
      // 1. ANNIVERSARY DETECTION
      // ============================================================

      // Check recordings for anniversaries
      recordings.forEach((r) => {
        const recordingDate = new Date(r.createdAt);
        const yearsAgo = getYearsAgo(recordingDate);

        if (yearsAgo > 0 && isSameDay(recordingDate, today)) {
          const text = r.transcriptionText
            ? typeof r.transcriptionText === 'object'
              ? decodeBase64((r.transcriptionText as { data: string }).data)
              : String(r.transcriptionText)
            : '';

          newAnniversaries.push({
            originalDate: recordingDate,
            yearsAgo,
            title: `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago today`,
            excerpt: text.slice(0, 150) + (text.length > 150 ? '...' : ''),
            sourceId: r.id,
            sourceType: 'recording',
          });
        }
      });

      // Check journals for anniversaries
      journals.forEach((j) => {
        const journalDate = new Date(j.date);
        const yearsAgo = getYearsAgo(journalDate);

        if (yearsAgo > 0 && isSameDay(journalDate, today)) {
          const text = j.content
            ? typeof j.content === 'object'
              ? decodeBase64((j.content as { data: string }).data)
              : String(j.content)
            : '';

          newAnniversaries.push({
            originalDate: journalDate,
            yearsAgo,
            title: `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago today`,
            excerpt: text.slice(0, 150) + (text.length > 150 ? '...' : ''),
            sourceId: j.id,
            sourceType: 'journal',
          });
        }
      });

      // Create prompts from anniversaries
      newAnniversaries.forEach((ann) => {
        newPrompts.push({
          id: `anniversary-${ann.sourceId}`,
          type: 'anniversary',
          title: ann.title,
          description: `You recorded something ${ann.yearsAgo} year${ann.yearsAgo > 1 ? 's' : ''} ago. How has your perspective changed?`,
          suggestedQuestion:
            'Looking back at this memory, what would you add or change about how you felt then?',
          triggerContext: ann.excerpt,
          priority: 'high',
          createdAt: today,
        });
      });

      // ============================================================
      // 2. GAP DETECTION
      // ============================================================

      // Detect categories not used recently
      const categoryLastUsed: Map<string, Date> = new Map();

      recordings.forEach((r) => {
        const qId = r.questionId;
        const categoryPrefix = qId.split('-')[0];
        const existingDate = categoryLastUsed.get(categoryPrefix);
        const recordingDate = new Date(r.createdAt);

        if (!existingDate || recordingDate > existingDate) {
          categoryLastUsed.set(categoryPrefix, recordingDate);
        }
      });

      const sixMonthsAgo = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000);

      categoryLastUsed.forEach((lastDate, prefix) => {
        if (lastDate < sixMonthsAgo && CATEGORY_NAMES[prefix]) {
          newPrompts.push({
            id: `gap-${prefix}`,
            type: 'gap',
            title: `Revisit ${CATEGORY_NAMES[prefix]}`,
            description: `You haven't explored ${CATEGORY_NAMES[prefix]} in over 6 months. Your perspective may have evolved.`,
            suggestedQuestion: `What's changed in your ${CATEGORY_NAMES[prefix].toLowerCase()} since you last reflected on it?`,
            triggerContext: `Last recorded: ${lastDate.toLocaleDateString()}`,
            priority: 'medium',
            createdAt: today,
          });
        }
      });

      // ============================================================
      // 3. MOOD-BASED PROMPTS
      // ============================================================

      const recentJournals = journals
        .filter((j) => isWithinDays(new Date(j.date), today, 7))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      if (recentJournals.length >= 3) {
        const moodCounts = recentJournals.reduce(
          (acc, j) => {
            if (j.mood) {
              acc[j.mood] = (acc[j.mood] || 0) + 1;
            }
            return acc;
          },
          {} as Record<string, number>
        );

        // Detect mood patterns
        if ((moodCounts['low'] || 0) + (moodCounts['bad'] || 0) >= 3) {
          newPrompts.push({
            id: 'mood-low-streak',
            type: 'mood-based',
            title: 'Checking In',
            description:
              'Your mood has been lower than usual lately. Sometimes reflecting helps.',
            suggestedQuestion:
              "What's weighing on you right now? What would help lighten it?",
            triggerContext: 'Multiple low-mood entries this week',
            priority: 'high',
            createdAt: today,
          });
        }

        if ((moodCounts['great'] || 0) >= 3) {
          newPrompts.push({
            id: 'mood-high-streak',
            type: 'mood-based',
            title: 'Celebrating Good Days',
            description:
              "You've had several great days! Consider documenting what's working.",
            suggestedQuestion:
              "What's contributing to these good days? How can you maintain this momentum?",
            triggerContext: 'Multiple great-mood entries this week',
            priority: 'medium',
            createdAt: today,
          });
        }
      }

      // ============================================================
      // 4. FOLLOW-UP PROMPTS
      // ============================================================

      // Find recent entries that mention unresolved topics
      const unresolvedKeywords = [
        'need to',
        "haven't yet",
        'want to',
        'should',
        'working on',
        'trying to',
        'figure out',
        'decide',
        'considering',
      ];

      recentJournals.slice(0, 5).forEach((j) => {
        const text = j.content
          ? typeof j.content === 'object'
            ? decodeBase64((j.content as { data: string }).data).toLowerCase()
            : String(j.content).toLowerCase()
          : '';

        for (const keyword of unresolvedKeywords) {
          if (text.includes(keyword)) {
            // Find the sentence containing the keyword
            const sentences = text.split(/[.!?]+/);
            const relevantSentence = sentences.find((s) => s.includes(keyword));

            if (relevantSentence) {
              newPrompts.push({
                id: `followup-${j.id}-${keyword}`,
                type: 'follow-up',
                title: 'Following Up',
                description:
                  "You mentioned something you were working on. How's it going?",
                suggestedQuestion:
                  'How has this situation evolved? Any progress or new insights?',
                triggerContext: relevantSentence.trim().slice(0, 100),
                priority: 'low',
                createdAt: today,
              });
              break; // Only one follow-up per entry
            }
          }
        }
      });

      // Filter out dismissed prompts and limit total
      const filteredPrompts = newPrompts
        .filter((p) => !dismissedIds.has(p.id))
        .slice(0, 10);

      setAnniversaries(newAnniversaries);
      setPrompts(filteredPrompts);
    } catch (err) {
      console.error('Failed to generate proactive prompts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dismissedIds]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dismissPrompt = useCallback((id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const hasNewPrompts = useMemo(() => {
    return prompts.filter((p) => p.priority === 'high').length > 0;
  }, [prompts]);

  return {
    prompts,
    anniversaries,
    hasNewPrompts,
    dismissPrompt,
    refresh: loadData,
    isLoading,
  };
}

export default useProactivePrompts;
