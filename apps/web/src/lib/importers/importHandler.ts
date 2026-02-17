/**
 * Import handler: saves parsed entries to IndexedDB as journal entries.
 */
import { db } from '@lcc/storage';
import type { ParsedEntry, ImportResult, ImportError } from './types';

function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Import parsed entries into the journal store.
 * Skips entries that already exist (matched by sourceId tag).
 */
export async function importEntries(entries: ParsedEntry[]): Promise<ImportResult> {
  const errors: ImportError[] = [];
  let imported = 0;
  let skipped = 0;
  const source = entries[0]?.source ?? 'dayone';

  const existing = await db.journalEntries.toArray();
  const existingSourceIds = new Set(
    existing.flatMap(e => (e.tags ?? []).filter(t => t.startsWith('import:')).map(t => t.slice(7)))
  );

  for (const entry of entries) {
    if (existingSourceIds.has(entry.sourceId)) {
      skipped++;
      continue;
    }

    try {
      const importTag = `import:${entry.sourceId}`;
      const sourceTags = [`source:${entry.source}`, importTag, ...entry.tags];
      if (entry.starred) sourceTags.push('starred');

      const metaParts: string[] = [];
      if (entry.location) metaParts.push(`Location: ${entry.location}`);
      if (entry.weather) metaParts.push(`Weather: ${entry.weather}`);
      const metadata = metaParts.length > 0 ? `\n\n---\n${metaParts.join(' | ')}` : '';

      await db.journalEntries.put({
        id: generateId(),
        date: entry.date,
        content: { version: 0, algorithm: 'AES-256-GCM', iv: '', data: entry.content + metadata, authTag: '' },
        mood: entry.mood,
        energyLevel: undefined,
        mediaType: 'text',
        duration: undefined,
        tags: sourceTags,
        privacyLevel: 0,
        createdAt: entry.date,
        updatedAt: new Date(),
      });
      imported++;
    } catch (err) {
      errors.push({
        sourceId: entry.sourceId,
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return { source, total: entries.length, imported, skipped, errors };
}
