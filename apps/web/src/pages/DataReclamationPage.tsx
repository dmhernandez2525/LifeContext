/**
 * DataReclamationPage - Collect and preview browser data with privacy scoring.
 * Supports date range filtering, selective import, and progress tracking.
 */
import { useState, useCallback } from 'react';
import { Database, AlertTriangle, History, Cookie, Chrome, Shield, Download, Calendar } from 'lucide-react';
import { CollectionProgress, DataPreviewPanel } from '@/components/data-reclamation';
import { useDataReclamationStore, type BrowserHistoryItem } from '@/store/data-reclamation-store';

type StepStatus = 'idle' | 'collecting' | 'complete' | 'error';

interface CollectionStatus {
  history: StepStatus;
  cookies: StepStatus;
  bookmarks: StepStatus;
}

// Demo data generator for when extension is not installed
function generateDemoHistory(startDate: Date, endDate: Date): BrowserHistoryItem[] {
  const domains = [
    'github.com', 'stackoverflow.com', 'docs.google.com', 'mail.google.com',
    'youtube.com', 'twitter.com', 'reddit.com', 'news.ycombinator.com',
    'amazon.com', 'wikipedia.org', 'medium.com', 'dev.to',
  ];
  const items: BrowserHistoryItem[] = [];
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const count = Math.min(Math.round((endMs - startMs) / 86400000) * 15, 15000);

  for (let i = 0; i < count; i++) {
    const domain = domains[i % domains.length];
    items.push({
      url: `https://${domain}/page-${i}`,
      title: `${domain} - Page ${i}`,
      visitTime: startMs + Math.random() * (endMs - startMs),
      visitCount: Math.ceil(Math.random() * 10),
      typedCount: Math.random() > 0.7 ? 1 : 0,
    });
  }
  return items;
}

const DEMO_COOKIES = [
  'doubleclick.net', 'google-analytics.com', 'facebook.net', 'hotjar.com',
  'criteo.com', 'amazon-adsystem.com', 'cloudflare.com', 'gstatic.com',
  'segment.com', 'mixpanel.com', 'outbrain.com', 'taboola.com',
];

export default function DataReclamationPage() {
  const [hasConsented, setHasConsented] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [status, setStatus] = useState<CollectionStatus>({
    history: 'idle',
    cookies: 'idle',
    bookmarks: 'idle',
  });
  const [collectedHistory, setCollectedHistory] = useState<BrowserHistoryItem[]>([]);
  const [collectedCookies, setCollectedCookies] = useState<string[]>([]);
  const [collectedBookmarks] = useState<Array<{ url: string; title: string; folder?: string }>>([]);
  const [selectedTypes, setSelectedTypes] = useState({ history: true, cookies: true, bookmarks: true });
  const [showPreview, setShowPreview] = useState(false);

  const store = useDataReclamationStore();

  const handleStartCollection = useCallback(async () => {
    // History
    setStatus(prev => ({ ...prev, history: 'collecting' }));
    await new Promise(resolve => setTimeout(resolve, 1500));
    const history = generateDemoHistory(new Date(startDate), new Date(endDate));
    setCollectedHistory(history);
    setStatus(prev => ({ ...prev, history: 'complete' }));

    // Cookies
    setStatus(prev => ({ ...prev, cookies: 'collecting' }));
    await new Promise(resolve => setTimeout(resolve, 800));
    setCollectedCookies(DEMO_COOKIES);
    setStatus(prev => ({ ...prev, cookies: 'complete' }));

    // Bookmarks (requires extension)
    setStatus(prev => ({ ...prev, bookmarks: 'error' }));

    setShowPreview(true);
  }, [startDate, endDate]);

  const handleImport = useCallback(() => {
    if (selectedTypes.history && collectedHistory.length > 0) {
      store.addBrowserHistory(collectedHistory);
    }
    if (selectedTypes.cookies && collectedCookies.length > 0) {
      store.setCookieDomains(collectedCookies);
    }
    if (selectedTypes.bookmarks && collectedBookmarks.length > 0) {
      store.setBookmarks(collectedBookmarks);
    }
  }, [selectedTypes, collectedHistory, collectedCookies, collectedBookmarks, store]);

  const handleToggleType = useCallback((type: 'history' | 'cookies' | 'bookmarks') => {
    setSelectedTypes(prev => ({ ...prev, [type]: !prev[type] }));
  }, []);

  if (!hasConsented) {
    return (
      <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto min-h-screen">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Data Reclamation</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your data is already out there. Let's get it back.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What We'll Collect</h2>
          <div className="space-y-4 mb-8">
            {[
              { icon: History, title: 'Browsing History', desc: "URLs you've visited, timestamps, page titles" },
              { icon: Cookie, title: 'Cookie Domains', desc: 'Which websites have cookies set (domain names only, not values)' },
              { icon: Chrome, title: 'Bookmarks', desc: 'Your saved bookmarks and folders (requires extension)' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Date Range Filter */}
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4" /> Date Range
            </h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-6 rounded-xl mb-8">
            <div className="flex gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">Privacy Guarantee</h3>
                <ul className="text-sm text-red-800 dark:text-red-300 space-y-1">
                  <li>All data stays on YOUR device (encrypted in IndexedDB)</li>
                  <li>We NEVER upload this data to our servers</li>
                  <li>You can delete everything at any time</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={() => setHasConsented(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors text-lg"
          >
            I Understand - Start Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Collecting Your Data</h1>
        <p className="text-gray-600 dark:text-gray-400">This may take a few moments depending on your browsing history.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Collection Progress */}
        <div>
          <CollectionProgress
            historyStatus={status.history}
            cookiesStatus={status.cookies}
            bookmarksStatus={status.bookmarks}
            historyCount={collectedHistory.length}
            cookiesCount={collectedCookies.length}
            bookmarksCount={collectedBookmarks.length}
          />

          {status.history === 'idle' && (
            <button
              onClick={handleStartCollection}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors"
            >
              Start Collection
            </button>
          )}

          {status.history === 'complete' && !showPreview && (
            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3 items-start">
                <Shield className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Collection Complete!</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Collected {collectedHistory.length.toLocaleString()} history items and {collectedCookies.length} cookie domains.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(true)}
                className="mt-4 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Preview & Import
              </button>
            </div>
          )}
        </div>

        {/* Right: Data Preview */}
        {showPreview && (
          <DataPreviewPanel
            historyItems={collectedHistory}
            cookieDomains={collectedCookies}
            bookmarks={collectedBookmarks}
            selectedTypes={selectedTypes}
            onToggleType={handleToggleType}
            onImport={handleImport}
          />
        )}
      </div>
    </div>
  );
}
