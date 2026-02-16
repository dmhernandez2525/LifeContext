/**
 * Shared types for journal import parsers.
 */
import type { JournalMood } from '@lcc/types';

export type ImportSource = 'dayone' | 'journey' | 'apple-notes';

export interface ParsedEntry {
  sourceId: string;
  source: ImportSource;
  date: Date;
  content: string;
  mood?: JournalMood;
  tags: string[];
  location?: string;
  weather?: string;
  starred?: boolean;
  photos?: ParsedPhoto[];
}

export interface ParsedPhoto {
  filename: string;
  type: string;
  identifier?: string;
}

export interface ImportResult {
  source: ImportSource;
  total: number;
  imported: number;
  skipped: number;
  errors: ImportError[];
}

export interface ImportError {
  sourceId: string;
  message: string;
}

export const SOURCE_LABELS: Record<ImportSource, string> = {
  dayone: 'Day One',
  journey: 'Journey',
  'apple-notes': 'Apple Notes',
};
