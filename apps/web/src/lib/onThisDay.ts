/**
 * "On This Day" memories engine.
 * Finds journal entries, photos, and health data from the same date in previous years.
 */
import type { PhotoEntry } from './photoManager';
import type { HealthEntry } from './healthMetrics';

export interface MemoryEntry {
  type: 'journal' | 'photo' | 'health';
  year: number;
  yearsAgo: number;
  date: string;
  preview: string;
  mood?: string;
  photoUrl?: string;
  healthValue?: string;
}

export interface OnThisDayResult {
  month: number;
  day: number;
  memories: MemoryEntry[];
  totalYears: number;
}

interface JournalLike {
  date: Date | string;
  content: string | { data?: string };
  mood?: string;
  tags?: string[];
}

/**
 * Extract text preview from a journal entry's content field.
 */
function extractPreview(content: string | { data?: string }): string {
  const text = typeof content === 'string' ? content : (content.data ?? '');
  return text.slice(0, 150) + (text.length > 150 ? '...' : '');
}

/**
 * Find journal memories from previous years on this date.
 */
export function findJournalMemories(
  entries: JournalLike[],
  month: number,
  day: number,
  currentYear: number
): MemoryEntry[] {
  const memories: MemoryEntry[] = [];

  for (const entry of entries) {
    const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
    if (isNaN(entryDate.getTime())) continue;

    const entryMonth = entryDate.getMonth() + 1;
    const entryDay = entryDate.getDate();
    const entryYear = entryDate.getFullYear();

    if (entryMonth === month && entryDay === day && entryYear < currentYear) {
      memories.push({
        type: 'journal',
        year: entryYear,
        yearsAgo: currentYear - entryYear,
        date: entryDate.toISOString().slice(0, 10),
        preview: extractPreview(entry.content),
        mood: entry.mood,
      });
    }
  }

  return memories.sort((a, b) => b.year - a.year);
}

/**
 * Find photo memories from previous years on this date.
 */
export function findPhotoMemories(
  photos: PhotoEntry[],
  month: number,
  day: number,
  currentYear: number
): MemoryEntry[] {
  const memories: MemoryEntry[] = [];

  for (const photo of photos) {
    const photoDate = new Date(photo.dateTaken);
    const photoMonth = photoDate.getMonth() + 1;
    const photoDay = photoDate.getDate();
    const photoYear = photoDate.getFullYear();

    if (photoMonth === month && photoDay === day && photoYear < currentYear) {
      memories.push({
        type: 'photo',
        year: photoYear,
        yearsAgo: currentYear - photoYear,
        date: photoDate.toISOString().slice(0, 10),
        preview: photo.caption ?? photo.filename,
        photoUrl: photo.thumbnailUrl,
      });
    }
  }

  return memories.sort((a, b) => b.year - a.year);
}

/**
 * Find health milestones from previous years on this date.
 */
export function findHealthMemories(
  entries: HealthEntry[],
  month: number,
  day: number,
  currentYear: number
): MemoryEntry[] {
  const memories: MemoryEntry[] = [];
  const seen = new Set<number>();

  for (const entry of entries) {
    const [y, m, d] = entry.date.split('-').map(Number);
    if (m === month && d === day && y < currentYear && !seen.has(y)) {
      seen.add(y);
      const dayEntries = entries.filter(e => e.date === entry.date);
      const summary = dayEntries.map(e => `${e.value} ${e.unit}`).join(', ');
      memories.push({
        type: 'health',
        year: y,
        yearsAgo: currentYear - y,
        date: entry.date,
        preview: summary,
        healthValue: summary,
      });
    }
  }

  return memories.sort((a, b) => b.year - a.year);
}

/**
 * Combine all memories for a given date.
 */
export function getOnThisDay(
  journals: JournalLike[],
  photos: PhotoEntry[],
  health: HealthEntry[],
  month: number,
  day: number
): OnThisDayResult {
  const currentYear = new Date().getFullYear();

  const journalMemories = findJournalMemories(journals, month, day, currentYear);
  const photoMemories = findPhotoMemories(photos, month, day, currentYear);
  const healthMemories = findHealthMemories(health, month, day, currentYear);

  const allMemories = [...journalMemories, ...photoMemories, ...healthMemories]
    .sort((a, b) => b.year - a.year);

  const uniqueYears = new Set(allMemories.map(m => m.year));

  return {
    month,
    day,
    memories: allMemories,
    totalYears: uniqueYears.size,
  };
}
