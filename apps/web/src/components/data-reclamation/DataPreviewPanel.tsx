/**
 * DataPreviewPanel - Preview collected browser data before import.
 * Shows domain stats, privacy score, and selective import controls.
 */
import { useMemo, useState } from 'react';
import { Shield, Globe, Cookie, Bookmark, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyzeDomains } from '@/lib/privacyScoring';
import type { BrowserHistoryItem } from '@/store/data-reclamation-store';
import { PrivacyScoreCard } from './PrivacyScoreCard';

interface DataPreviewPanelProps {
  historyItems: BrowserHistoryItem[];
  cookieDomains: string[];
  bookmarks: Array<{ url: string; title: string; folder?: string }>;
  selectedTypes: { history: boolean; cookies: boolean; bookmarks: boolean };
  onToggleType: (type: 'history' | 'cookies' | 'bookmarks') => void;
  onImport: () => void;
}

export function DataPreviewPanel({
  historyItems,
  cookieDomains,
  bookmarks,
  selectedTypes,
  onToggleType,
  onImport,
}: DataPreviewPanelProps) {
  const [showDomains, setShowDomains] = useState(false);

  const topDomains = useMemo(
    () => analyzeDomains(historyItems).slice(0, 10),
    [historyItems]
  );

  const dateRange = useMemo(() => {
    if (historyItems.length === 0) return null;
    const times = historyItems.map(i => i.visitTime);
    return {
      oldest: new Date(Math.min(...times)),
      newest: new Date(Math.max(...times)),
    };
  }, [historyItems]);

  const totalSelected =
    (selectedTypes.history ? historyItems.length : 0) +
    (selectedTypes.cookies ? cookieDomains.length : 0) +
    (selectedTypes.bookmarks ? bookmarks.length : 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Data Preview</h2>

      {/* Privacy Score */}
      <PrivacyScoreCard cookieDomains={cookieDomains} />

      {/* Date Range */}
      {dateRange && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-400">
          Data spans from <span className="font-medium text-gray-900 dark:text-white">{dateRange.oldest.toLocaleDateString()}</span> to{' '}
          <span className="font-medium text-gray-900 dark:text-white">{dateRange.newest.toLocaleDateString()}</span>
        </div>
      )}

      {/* Selective Import */}
      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select data to import</h3>

        {[
          { key: 'history' as const, icon: Globe, label: 'Browsing History', count: historyItems.length },
          { key: 'cookies' as const, icon: Cookie, label: 'Cookie Domains', count: cookieDomains.length },
          { key: 'bookmarks' as const, icon: Bookmark, label: 'Bookmarks', count: bookmarks.length },
        ].map(item => (
          <label
            key={item.key}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors",
              selectedTypes[item.key]
                ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                : "bg-gray-50 dark:bg-gray-800 border border-transparent"
            )}
          >
            <input
              type="checkbox"
              checked={selectedTypes[item.key]}
              onChange={() => onToggleType(item.key)}
              className="w-4 h-4 rounded text-blue-600"
            />
            <item.icon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-900 dark:text-white flex-1">{item.label}</span>
            <span className="text-sm text-gray-500">{item.count.toLocaleString()}</span>
          </label>
        ))}
      </div>

      {/* Top Domains */}
      {topDomains.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowDomains(!showDomains)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {showDomains ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Top Visited Domains
          </button>

          {showDomains && (
            <div className="mt-3 space-y-1">
              {topDomains.map(d => (
                <div key={d.domain} className="flex items-center justify-between py-1 text-sm">
                  <span className="text-gray-700 dark:text-gray-300 truncate">{d.domain}</span>
                  <span className="text-gray-400 shrink-0 ml-2">{d.visits.toLocaleString()} visits</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Import Button */}
      <button
        onClick={onImport}
        disabled={totalSelected === 0}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Shield className="w-5 h-5" />
        Import {totalSelected.toLocaleString()} Items
      </button>
    </div>
  );
}
