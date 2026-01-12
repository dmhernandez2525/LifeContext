/**
 * useLifeChapters - Detect life chapters and transitions
 *
 * Platform-agnostic hook that analyzes recordings and journal entries to:
 * - Detect major life transitions
 * - Group content into "chapters" (periods of life)
 * - Generate summaries for each chapter
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@lcc/storage';

// ============================================================
// TYPES
// ============================================================

export interface LifeChapter {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date; // undefined means "current"
  recordingCount: number;
  journalCount: number;
  dominantThemes: string[];
  keyEvents: string[];
  moodSummary: 'positive' | 'neutral' | 'challenging' | 'mixed';
  significance: number; // 0-1
}

export interface ChapterTransition {
  id: string;
  fromChapter: string;
  toChapter: string;
  date: Date;
  type: 'career' | 'relationship' | 'location' | 'health' | 'family' | 'personal';
  description: string;
}

export interface UseLifeChaptersReturn {
  chapters: LifeChapter[];
  transitions: ChapterTransition[];
  currentChapter: LifeChapter | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

// ============================================================
// CHAPTER DETECTION KEYWORDS
// ============================================================

const TRANSITION_KEYWORDS: Record<string, ChapterTransition['type']> = {
  // Career
  'new job': 'career',
  promotion: 'career',
  quit: 'career',
  fired: 'career',
  'laid off': 'career',
  'started working': 'career',
  retired: 'career',
  'career change': 'career',

  // Relationship
  married: 'relationship',
  engaged: 'relationship',
  divorced: 'relationship',
  'broke up': 'relationship',
  'started dating': 'relationship',
  relationship: 'relationship',

  // Location
  'moved to': 'location',
  'new house': 'location',
  'new apartment': 'location',
  relocated: 'location',
  immigrated: 'location',

  // Health
  diagnosed: 'health',
  surgery: 'health',
  recovered: 'health',
  treatment: 'health',
  cancer: 'health',

  // Family
  baby: 'family',
  pregnant: 'family',
  kids: 'family',
  parent: 'family',
  grandmother: 'family',
  grandfather: 'family',
  death: 'family',
  'passed away': 'family',

  // Personal
  breakthrough: 'personal',
  'turning point': 'personal',
  realized: 'personal',
  'decided to': 'personal',
  'started therapy': 'personal',
};

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

function detectTransitionType(text: string): ChapterTransition['type'] | null {
  const lowerText = text.toLowerCase();
  for (const [keyword, type] of Object.entries(TRANSITION_KEYWORDS)) {
    if (lowerText.includes(keyword)) {
      return type;
    }
  }
  return null;
}

function generateChapterTitle(
  themes: string[],
  dateRange: { start: Date; end?: Date }
): string {
  const year = dateRange.start.getFullYear();

  if (themes.includes('divorce') || themes.includes('breakup')) {
    return `The Transition Year (${year})`;
  }
  if (themes.includes('wedding') || themes.includes('marriage')) {
    return `The Beginning Together (${year})`;
  }
  if (themes.includes('baby') || themes.includes('pregnancy')) {
    return `Becoming a Parent (${year})`;
  }
  if (themes.includes('career') || themes.includes('job')) {
    return `New Professional Chapter (${year})`;
  }
  if (themes.includes('moved') || themes.includes('relocation')) {
    return `A New Home (${year})`;
  }
  if (themes.includes('healing') || themes.includes('therapy')) {
    return `The Healing Journey (${year})`;
  }

  return `Chapter ${year}`;
}

// ============================================================
// HOOK
// ============================================================

export function useLifeChapters(): UseLifeChaptersReturn {
  const [chapters, setChapters] = useState<LifeChapter[]>([]);
  const [transitions, setTransitions] = useState<ChapterTransition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [recordings, journals] = await Promise.all([
        db.recordings.toArray(),
        db.journalEntries.toArray(),
      ]);

      // Combine all content with dates
      type ContentItem = {
        id: string;
        date: Date;
        text: string;
        type: 'recording' | 'journal';
        mood?: string;
        tags: string[];
      };

      const allContent: ContentItem[] = [];

      // Process recordings
      recordings.forEach((r) => {
        if (r.transcriptionText) {
          const text =
            typeof r.transcriptionText === 'object'
              ? decodeBase64((r.transcriptionText as { data: string }).data)
              : String(r.transcriptionText);
          allContent.push({
            id: r.id,
            date: new Date(r.createdAt),
            text,
            type: 'recording',
            tags: [],
          });
        }
      });

      // Process journals
      journals.forEach((j) => {
        if (j.content) {
          const text =
            typeof j.content === 'object'
              ? decodeBase64((j.content as { data: string }).data)
              : String(j.content);
          allContent.push({
            id: j.id,
            date: new Date(j.date),
            text,
            type: 'journal',
            mood: j.mood,
            tags: j.tags || [],
          });
        }
      });

      // Sort by date
      allContent.sort((a, b) => a.date.getTime() - b.date.getTime());

      if (allContent.length === 0) {
        setChapters([]);
        setTransitions([]);
        setIsLoading(false);
        return;
      }

      // Detect transitions
      const detectedTransitions: ChapterTransition[] = [];
      allContent.forEach((item, index) => {
        const transitionType = detectTransitionType(item.text);
        if (transitionType) {
          detectedTransitions.push({
            id: `transition-${index}`,
            fromChapter: '',
            toChapter: '',
            date: item.date,
            type: transitionType,
            description: item.text.slice(0, 100) + '...',
          });
        }
      });

      // Group content into year-based chapters
      const yearGroups: Map<number, ContentItem[]> = new Map();
      allContent.forEach((item) => {
        const year = item.date.getFullYear();
        if (!yearGroups.has(year)) {
          yearGroups.set(year, []);
        }
        yearGroups.get(year)!.push(item);
      });

      // Create chapters from year groups
      const generatedChapters: LifeChapter[] = [];
      yearGroups.forEach((items, year) => {
        const recordingCount = items.filter((i) => i.type === 'recording').length;
        const journalCount = items.filter((i) => i.type === 'journal').length;

        // Extract themes from all content
        const allText = items.map((i) => i.text).join(' ').toLowerCase();
        const allTags = items.flatMap((i) => i.tags);
        const tagCounts = allTags.reduce(
          (acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );
        const dominantThemes = Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([tag]) => tag);

        // Calculate mood summary
        const moods = items.filter((i) => i.mood).map((i) => i.mood!);
        const moodCounts = moods.reduce(
          (acc, mood) => {
            acc[mood] = (acc[mood] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        let moodSummary: LifeChapter['moodSummary'] = 'neutral';
        if (moodCounts['great'] > moodCounts['bad'] * 2) {
          moodSummary = 'positive';
        } else if (moodCounts['bad'] > moodCounts['great'] * 2) {
          moodSummary = 'challenging';
        } else if (Object.keys(moodCounts).length > 2) {
          moodSummary = 'mixed';
        }

        // Extract key events (simplified)
        const keyEvents: string[] = [];
        Object.keys(TRANSITION_KEYWORDS).forEach((keyword) => {
          if (allText.includes(keyword)) {
            keyEvents.push(keyword);
          }
        });

        generatedChapters.push({
          id: `chapter-${year}`,
          title: generateChapterTitle(dominantThemes.concat(keyEvents), {
            start: new Date(year, 0, 1),
            end: items[items.length - 1].date,
          }),
          description: `A chapter with ${recordingCount} recordings and ${journalCount} journal entries.`,
          startDate: items[0].date,
          endDate: items[items.length - 1].date,
          recordingCount,
          journalCount,
          dominantThemes,
          keyEvents: keyEvents.slice(0, 3),
          moodSummary,
          significance: Math.min(1, (recordingCount + journalCount) / 20),
        });
      });

      // Sort chapters by date (newest first)
      generatedChapters.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

      setChapters(generatedChapters);
      setTransitions(detectedTransitions);
    } catch (err) {
      console.error('Failed to detect life chapters:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentChapter = useMemo(() => {
    return chapters.length > 0 ? chapters[0] : null;
  }, [chapters]);

  return {
    chapters,
    transitions,
    currentChapter,
    isLoading,
    refresh: loadData,
  };
}

export default useLifeChapters;
