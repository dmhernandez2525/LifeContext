import type { HelpHistoryItem } from './helpTypes';

interface HelpHistoryPanelProps {
  history: HelpHistoryItem[];
  onSelect: (item: HelpHistoryItem) => void;
  onClear: () => void;
}

export default function HelpHistoryPanel({ history, onSelect, onClear }: HelpHistoryPanelProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700" data-testid="help-history-panel">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Help history
        </p>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Clear
        </button>
      </div>

      <div className="max-h-40 space-y-1 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">No prior help interactions yet.</p>
        ) : (
          history.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full rounded-lg px-2 py-1.5 text-left text-xs text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <p className="font-medium">{item.query}</p>
              <p className="truncate text-gray-500 dark:text-gray-400">{item.response}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
