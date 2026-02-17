/**
 * Journey app journal import parser.
 * Parses the JSON export format from Journey (Android/iOS journaling app).
 */
import type { JournalMood } from '@lcc/types';
import type { ParsedEntry, ParsedPhoto } from './types';

interface JourneyEntry {
  id?: string;
  date_journal?: number;
  date_modified?: number;
  text?: string;
  mood?: number;
  tags?: string[];
  lat?: number;
  lon?: number;
  address?: string;
  label?: string;
  weather?: {
    description?: string;
    degree_c?: number;
    icon?: string;
  };
  photos?: string[];
  type?: string;
}

interface JourneyExport {
  entries?: JourneyEntry[];
  metadata?: Record<string, unknown>;
}

const MOOD_MAP: Record<number, JournalMood> = {
  1: 'bad',
  2: 'low',
  3: 'okay',
  4: 'good',
  5: 'great',
};

function mapMood(mood?: number): JournalMood | undefined {
  if (mood == null) return undefined;
  if (mood in MOOD_MAP) return MOOD_MAP[mood];
  if (mood <= 2) return 'bad';
  if (mood <= 4) return 'low';
  if (mood <= 6) return 'okay';
  if (mood <= 8) return 'good';
  return 'great';
}

function formatLocation(entry: JourneyEntry): string | undefined {
  if (entry.address) return entry.address;
  if (entry.label) return entry.label;
  if (entry.lat != null && entry.lon != null) {
    return `${entry.lat.toFixed(4)}, ${entry.lon.toFixed(4)}`;
  }
  return undefined;
}

function formatWeather(weather: JourneyEntry['weather']): string | undefined {
  if (!weather) return undefined;
  const parts: string[] = [];
  if (weather.description) parts.push(weather.description);
  if (weather.degree_c != null) parts.push(`${Math.round(weather.degree_c)}°C`);
  return parts.length > 0 ? parts.join(', ') : undefined;
}

function mapPhotos(photos?: string[]): ParsedPhoto[] | undefined {
  if (!photos || photos.length === 0) return undefined;
  return photos.map(filename => ({
    filename,
    type: filename.split('.').pop() ?? 'jpeg',
  }));
}

function parseEntry(entry: JourneyEntry): ParsedEntry | null {
  const content = entry.text?.trim();
  if (!content) return null;

  const timestamp = entry.date_journal;
  if (!timestamp) return null;

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return null;

  return {
    sourceId: entry.id ?? `journey-${timestamp}`,
    source: 'journey',
    date,
    content,
    mood: mapMood(entry.mood),
    tags: entry.tags ?? [],
    location: formatLocation(entry),
    weather: formatWeather(entry.weather),
    photos: mapPhotos(entry.photos),
  };
}

/**
 * Parse a Journey JSON export file.
 */
export function parseJourneyExport(json: string): { entries: ParsedEntry[]; skipped: number } {
  const data: JourneyExport = JSON.parse(json);
  const rawEntries = data.entries ?? [];

  // Journey sometimes exports as a flat array instead of { entries: [...] }
  const entriesArray = Array.isArray(data) ? (data as JourneyEntry[]) : rawEntries;

  const entries: ParsedEntry[] = [];
  let skipped = 0;

  for (const raw of entriesArray) {
    const parsed = parseEntry(raw);
    if (parsed) {
      entries.push(parsed);
    } else {
      skipped++;
    }
  }

  entries.sort((a, b) => b.date.getTime() - a.date.getTime());
  return { entries, skipped };
}

/**
 * Validate that a file looks like a Journey export.
 */
export function isJourneyFormat(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data)) {
      return data.length > 0 && ('date_journal' in data[0] || 'text' in data[0]);
    }
    return Array.isArray(data.entries);
  } catch {
    return false;
  }
}
