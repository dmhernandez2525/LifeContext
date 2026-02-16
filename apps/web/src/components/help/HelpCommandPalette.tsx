import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, Search, X } from 'lucide-react';
import { filterNavigationTargets } from './helpNavigation';
import type { NavigationTarget } from './helpTypes';

interface HelpCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (target: NavigationTarget) => void;
}

export default function HelpCommandPalette({ isOpen, onClose, onSelect }: HelpCommandPaletteProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return filterNavigationTargets(query).slice(0, 8);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[71] flex items-start justify-center p-4 pt-24"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-2 border-b border-gray-200 p-3 dark:border-gray-700">
                <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                  <Command className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    autoFocus
                    placeholder="Jump to a page..."
                    onChange={(event) => setQuery(event.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-purple-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => {
                      onSelect(target);
                      onClose();
                    }}
                    className="flex w-full items-start justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{target.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{target.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">{target.path}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
