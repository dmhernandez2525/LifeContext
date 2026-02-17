/**
 * Day One journal import parser.
 * Parses the JSON export format from Day One (entries array with metadata).
 */
import type { JournalMood } from '@lcc/types';
import type { ParsedEntry, ParsedPhoto } from './types';

interface DayOneEntry {
  uuid: string;
  creationDate: string;
  modifiedDate?: string;
  text?: string;
  richText?: string;
  tags?: string[];
  starred?: boolean;
  weather?: {
    conditionsDescription?: string;
    temperatureCelsius?: number;
  };
  location?: {
    placeName?: string;
    localityName?: string;
    administrativeArea?: string;
    country?: string;
  };
  photos?: DayOnePhoto[];
}

interface DayOnePhoto {
  identifier: string;
  type?: string;
  md5?: string;
  filename?: string;
}

interface DayOneExport {
  entries?: DayOneEntry[];
  metadata?: { version?: string };
}

const SENTIMENT_POSITIVE = ['happy', 'grateful', 'excited', 'proud', 'inspired', 'joy', 'wonderful', 'amazing'];
const SENTIMENT_NEGATIVE = ['sad', 'frustrated', 'angry', 'anxious', 'stressed', 'worried', 'tired', 'exhausted'];
const SENTIMENT_LOW = ['depressed', 'hopeless', 'terrible', 'awful', 'miserable', 'devastated'];

function inferMood(text: string): JournalMood | undefined {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const first200 = words.slice(0, 200).join(' ');

  if (SENTIMENT_LOW.some(w => first200.includes(w))) return 'bad';
  if (SENTIMENT_NEGATIVE.some(w => first200.includes(w))) return 'low';
  if (SENTIMENT_POSITIVE.some(w => first200.includes(w))) return 'good';
  return undefined;
}

function formatLocation(loc: DayOneEntry['location']): string | undefined {
  if (!loc) return undefined;
  const parts = [loc.placeName, loc.localityName, loc.administrativeArea, loc.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : undefined;
}

function formatWeather(weather: DayOneEntry['weather']): string | undefined {
  if (!weather) return undefined;
  const parts: string[] = [];
  if (weather.conditionsDescription) parts.push(weather.conditionsDescription);
  if (weather.temperatureCelsius != null) parts.push(`${Math.round(weather.temperatureCelsius)}°C`);
  return parts.length > 0 ? parts.join(', ') : undefined;
}

function mapPhotos(photos?: DayOnePhoto[]): ParsedPhoto[] | undefined {
  if (!photos || photos.length === 0) return undefined;
  return photos.map(p => ({
    filename: p.filename ?? `${p.identifier}.jpeg`,
    type: p.type ?? 'jpeg',
    identifier: p.identifier,
  }));
}

function parseEntry(entry: DayOneEntry): ParsedEntry | null {
  const content = entry.text?.trim();
  if (!content) return null;

  const date = new Date(entry.creationDate);
  if (isNaN(date.getTime())) return null;

  return {
    sourceId: entry.uuid,
    source: 'dayone',
    date,
    content,
    mood: inferMood(content),
    tags: entry.tags ?? [],
    starred: entry.starred,
    location: formatLocation(entry.location),
    weather: formatWeather(entry.weather),
    photos: mapPhotos(entry.photos),
  };
}

/**
 * Parse a Day One JSON export file.
 * Returns parsed entries and any skipped entry count.
 */
export function parseDayOneExport(json: string): { entries: ParsedEntry[]; skipped: number } {
  const data: DayOneExport = JSON.parse(json);
  const rawEntries = data.entries ?? [];
  const entries: ParsedEntry[] = [];
  let skipped = 0;

  for (const raw of rawEntries) {
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
 * Validate that a file looks like a Day One export.
 */
export function isDayOneFormat(json: string): boolean {
  try {
    const data = JSON.parse(json);
    return Array.isArray(data.entries);
  } catch {
    return false;
  }
}
