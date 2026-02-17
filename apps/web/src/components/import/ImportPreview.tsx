/**
 * ImportPreview - Shows parsed entries before import with selection controls.
 */
import { useState, useMemo } from 'react';
import { Check, Calendar, MapPin, Tag, Star } from 'lucide-react';
import type { ParsedEntry } from '@/lib/importers/types';
import { cn } from '@/lib/utils';

interface ImportPreviewProps {
  entries: ParsedEntry[];
  onConfirm: (selectedIds: Set<string>) => void;
  onCancel: () => void;
  importing: boolean;
}

export function ImportPreview({ entries, onConfirm, onCancel, importing }: ImportPreviewProps) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(entries.map(e => e.sourceId))
  );

  const toggleEntry = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === entries.length) setSelected(new Set());
    else setSelected(new Set(entries.map(e => e.sourceId)));
  };

  const dateRange = useMemo(() => {
    if (entries.length === 0) return '';
    const dates = entries.map(e => e.date.getTime());
    const oldest = new Date(Math.min(...dates));
    const newest = new Date(Math.max(...dates));
    return `${oldest.toLocaleDateString()} to ${newest.toLocaleDateString()}`;
  }, [entries]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {entries.length} entries found
          </p>
          <p className="text-xs text-gray-500">{dateRange}</p>
        </div>
        <button onClick={toggleAll} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
          {selected.size === entries.length ? 'Deselect all' : 'Select all'}
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
        {entries.map(entry => (
          <EntryRow
            key={entry.sourceId}
            entry={entry}
            checked={selected.has(entry.sourceId)}
            onToggle={() => toggleEntry(entry.sourceId)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {selected.size} of {entries.length} selected
        </span>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={importing}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={selected.size === 0 || importing}
            className={cn(
              "px-4 py-1.5 text-sm rounded-lg text-white font-medium",
              selected.size > 0 && !importing
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            )}
          >
            {importing ? 'Importing...' : `Import ${selected.size} entries`}
          </button>
        </div>
      </div>
    </div>
  );
}

interface EntryRowProps {
  entry: ParsedEntry;
  checked: boolean;
  onToggle: () => void;
}

function EntryRow({ entry, checked, onToggle }: EntryRowProps) {
  const preview = entry.content.slice(0, 120) + (entry.content.length > 120 ? '...' : '');

  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-colors",
        checked
          ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
          : "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60"
      )}
    >
      <div className="flex items-start gap-2">
        <div className={cn(
          "mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
          checked ? "bg-indigo-600 border-indigo-600" : "border-gray-300 dark:border-gray-600"
        )}>
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {entry.date.toLocaleDateString()}
            </span>
            {entry.starred && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
            {entry.location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3" /> {entry.location}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{preview}</p>
          {entry.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Tag className="w-3 h-3 text-gray-400" />
              {entry.tags.slice(0, 4).map(tag => (
                <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  {tag}
                </span>
              ))}
              {entry.tags.length > 4 && (
                <span className="text-xs text-gray-400">+{entry.tags.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
