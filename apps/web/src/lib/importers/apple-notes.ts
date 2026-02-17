/**
 * Apple Notes import parser.
 * Parses HTML exports from Apple Notes (individual .html files or combined).
 * Also handles plain text (.txt) exports from third-party Apple Notes exporters.
 */
import type { ParsedEntry } from './types';

interface AppleNoteRaw {
  title: string;
  content: string;
  date: Date;
  folder?: string;
}

/**
 * Strip HTML tags and decode entities, preserving paragraph breaks.
 */
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extract title from HTML (first <h1>, <title>, or first line of content).
 */
function extractTitle(html: string): string {
  const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1) return htmlToText(h1[1]);

  const title = html.match(/<title[^>]*>(.*?)<\/title>/i);
  if (title) return htmlToText(title[1]);

  const text = htmlToText(html);
  const firstLine = text.split('\n')[0]?.trim() ?? '';
  return firstLine.slice(0, 100);
}

/**
 * Try to extract a date from HTML meta tags or content hints.
 */
function extractDate(html: string, filename?: string): Date {
  const metaDate = html.match(/<meta\s+name=["']date["']\s+content=["']([^"']+)["']/i);
  if (metaDate) {
    const d = new Date(metaDate[1]);
    if (!isNaN(d.getTime())) return d;
  }

  const metaCreated = html.match(/<meta\s+name=["']created["']\s+content=["']([^"']+)["']/i);
  if (metaCreated) {
    const d = new Date(metaCreated[1]);
    if (!isNaN(d.getTime())) return d;
  }

  if (filename) {
    const dateMatch = filename.match(/(\d{4}[-_]\d{2}[-_]\d{2})/);
    if (dateMatch) {
      const d = new Date(dateMatch[1].replace(/_/g, '-'));
      if (!isNaN(d.getTime())) return d;
    }
  }

  return new Date();
}

/**
 * Extract folder name from content hints or path.
 */
function extractFolder(html: string): string | undefined {
  const metaFolder = html.match(/<meta\s+name=["']folder["']\s+content=["']([^"']+)["']/i);
  if (metaFolder) return metaFolder[1];
  return undefined;
}

function parseHtmlNote(html: string, filename?: string): AppleNoteRaw {
  return {
    title: extractTitle(html),
    content: htmlToText(html),
    date: extractDate(html, filename),
    folder: extractFolder(html),
  };
}

function parsePlainTextNote(text: string, filename?: string): AppleNoteRaw {
  const lines = text.trim().split('\n');
  const title = lines[0]?.trim() ?? 'Untitled';
  const content = lines.slice(1).join('\n').trim() || title;

  let date = new Date();
  if (filename) {
    const dateMatch = filename.match(/(\d{4}[-_]\d{2}[-_]\d{2})/);
    if (dateMatch) {
      const d = new Date(dateMatch[1].replace(/_/g, '-'));
      if (!isNaN(d.getTime())) date = d;
    }
  }

  return { title, content, date };
}

function rawToEntry(raw: AppleNoteRaw, index: number): ParsedEntry | null {
  if (!raw.content || raw.content.length < 2) return null;

  const tags: string[] = [];
  if (raw.folder) tags.push(`folder:${raw.folder}`);

  return {
    sourceId: `apple-notes-${raw.date.getTime()}-${index}`,
    source: 'apple-notes',
    date: raw.date,
    content: raw.title !== raw.content ? `# ${raw.title}\n\n${raw.content}` : raw.content,
    tags,
  };
}

/**
 * Parse Apple Notes HTML/text files.
 * Accepts an array of { name, content } file objects.
 */
export function parseAppleNotesExport(
  files: Array<{ name: string; content: string }>
): { entries: ParsedEntry[]; skipped: number } {
  const entries: ParsedEntry[] = [];
  let skipped = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const isHtml = file.name.endsWith('.html') || file.name.endsWith('.htm') || file.content.trimStart().startsWith('<');
    const raw = isHtml ? parseHtmlNote(file.content, file.name) : parsePlainTextNote(file.content, file.name);
    const entry = rawToEntry(raw, i);
    if (entry) {
      entries.push(entry);
    } else {
      skipped++;
    }
  }

  entries.sort((a, b) => b.date.getTime() - a.date.getTime());
  return { entries, skipped };
}

/**
 * Check if files look like Apple Notes exports.
 */
export function isAppleNotesFormat(files: Array<{ name: string }>): boolean {
  return files.some(f =>
    f.name.endsWith('.html') || f.name.endsWith('.htm') || f.name.endsWith('.txt')
  );
}
