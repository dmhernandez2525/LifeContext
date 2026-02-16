/**
 * AppleNotesImport - Upload and import Apple Notes HTML/text exports.
 * Supports multiple file selection (one note per file).
 */
import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseAppleNotesExport, isAppleNotesFormat } from '@/lib/importers/apple-notes';
import type { ParsedEntry, ImportResult } from '@/lib/importers/types';
import { ImportPreview } from './ImportPreview';
import { cn } from '@/lib/utils';

interface AppleNotesImportProps {
  onImport: (entries: ParsedEntry[]) => Promise<ImportResult>;
}

type ImportPhase = 'upload' | 'preview' | 'complete' | 'error';

export function AppleNotesImport({ onImport }: AppleNotesImportProps) {
  const [phase, setPhase] = useState<ImportPhase>('upload');
  const [entries, setEntries] = useState<ParsedEntry[]>([]);
  const [skipped, setSkipped] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (fileList: FileList) => {
    try {
      const files = Array.from(fileList);
      if (!isAppleNotesFormat(files)) {
        setError('Please select HTML or text files exported from Apple Notes.');
        setPhase('error');
        return;
      }

      const fileContents = await Promise.all(
        files
          .filter(f => f.name.endsWith('.html') || f.name.endsWith('.htm') || f.name.endsWith('.txt'))
          .map(async f => ({ name: f.name, content: await f.text() }))
      );

      if (fileContents.length === 0) {
        setError('No valid HTML or text files found.');
        setPhase('error');
        return;
      }

      const parsed = parseAppleNotesExport(fileContents);
      if (parsed.entries.length === 0) {
        setError('No valid notes found in the selected files.');
        setPhase('error');
        return;
      }
      setEntries(parsed.entries);
      setSkipped(parsed.skipped);
      setPhase('preview');
    } catch {
      setError('Failed to read the files. Please try again.');
      setPhase('error');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleConfirm = useCallback(async (selectedIds: Set<string>) => {
    setImporting(true);
    try {
      const selected = entries.filter(e => selectedIds.has(e.sourceId));
      const importResult = await onImport(selected);
      setResult(importResult);
      setPhase('complete');
    } catch {
      setError('Import failed. Please try again.');
      setPhase('error');
    } finally {
      setImporting(false);
    }
  }, [entries, onImport]);

  const reset = () => {
    setPhase('upload');
    setEntries([]);
    setSkipped(0);
    setResult(null);
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  if (phase === 'preview') {
    return (
      <div className="space-y-3">
        {skipped > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            {skipped} files skipped (empty or too short)
          </p>
        )}
        <ImportPreview
          entries={entries}
          onConfirm={handleConfirm}
          onCancel={reset}
          importing={importing}
        />
      </div>
    );
  }

  if (phase === 'complete' && result) {
    return (
      <div className="text-center py-8 space-y-3">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
        <p className="text-lg font-medium text-gray-900 dark:text-white">Import Complete</p>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>{result.imported} notes imported successfully</p>
          {result.skipped > 0 && <p>{result.skipped} notes skipped (duplicates)</p>}
          {result.errors.length > 0 && (
            <p className="text-amber-600">{result.errors.length} notes had errors</p>
          )}
        </div>
        <button onClick={reset} className="mt-4 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Import More
        </button>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="text-center py-8 space-y-3">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button onClick={reset} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
        "border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500"
      )}
    >
      <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        Drop your Apple Notes exports here
      </p>
      <p className="text-xs text-gray-500 mb-1">
        Select one or more HTML/text files
      </p>
      <p className="text-xs text-gray-400 mb-4">
        In Notes app: select notes, then File &gt; Export as PDF (or use Exporter app for HTML)
      </p>
      <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 cursor-pointer">
        <Upload className="w-4 h-4" />
        Choose Files
        <input
          ref={fileRef}
          type="file"
          accept=".html,.htm,.txt"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
          }}
        />
      </label>
    </div>
  );
}
