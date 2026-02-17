/**
 * ImportPage - Import journal entries from external apps.
 * Phase 10 unified import hub for Day One, Journey, and Apple Notes.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, BookOpen, Info } from 'lucide-react';
import { DayOneImport } from '@/components/import';
import { importEntries } from '@/lib/importers/importHandler';
import type { ParsedEntry, ImportResult, ImportSource } from '@/lib/importers/types';
import { SOURCE_LABELS } from '@/lib/importers/types';
import { cn } from '@/lib/utils';

const SOURCES: { id: ImportSource; description: string; available: boolean }[] = [
  { id: 'dayone', description: 'Import from Day One JSON export', available: true },
  { id: 'journey', description: 'Import from Journey app export', available: false },
  { id: 'apple-notes', description: 'Import from Apple Notes export', available: false },
];

export default function ImportPage() {
  const [activeSource, setActiveSource] = useState<ImportSource>('dayone');

  const handleImport = async (entries: ParsedEntry[]): Promise<ImportResult> => {
    return importEntries(entries);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 py-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
          <Download className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Import Journal</h1>
          <p className="text-sm text-gray-500">Bring your entries from other apps</p>
        </div>
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Imported entries are stored locally with your existing journal data. Content is kept as
          plain text until you unlock the vault, then encrypted at rest like all other entries.
        </p>
      </div>

      {/* Source tabs */}
      <div className="flex gap-2">
        {SOURCES.map(source => (
          <button
            key={source.id}
            onClick={() => source.available && setActiveSource(source.id)}
            disabled={!source.available}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeSource === source.id
                ? "bg-indigo-600 text-white"
                : source.available
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  : "bg-gray-50 dark:bg-gray-800/50 text-gray-400 cursor-not-allowed"
            )}
          >
            <BookOpen className="w-4 h-4" />
            {SOURCE_LABELS[source.id]}
            {!source.available && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500">Soon</span>
            )}
          </button>
        ))}
      </div>

      {/* Active importer */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        {activeSource === 'dayone' && <DayOneImport onImport={handleImport} />}
        {activeSource === 'journey' && <ComingSoon name="Journey" />}
        {activeSource === 'apple-notes' && <ComingSoon name="Apple Notes" />}
      </div>
    </motion.div>
  );
}

function ComingSoon({ name }: { name: string }) {
  return (
    <div className="text-center py-12">
      <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      <p className="text-sm text-gray-500">{name} import coming soon</p>
    </div>
  );
}
