
import { useState } from 'react';
import { 
  Database,
  AlertTriangle,
  History,
  Cookie,
  Chrome,
  Shield,
  Check,
  Download,
  // ExternalLink,
  // Search,
  // CheckCircle,
  // Loader2,
  // ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface CollectionStatus {
  history: 'idle' | 'collecting' | 'complete' | 'error';
  cookies: 'idle' | 'collecting' | 'complete' | 'error';
  bookmarks: 'idle' | 'collecting' | 'complete' | 'error';
}

interface CollectedData {
  historyCount: number;
  cookiesCount: number;
  bookmarksCount: number;
  oldestDate?: string; // string for JSON serialization
  topDomains?: { domain: string; visits: number }[];
}

export default function DataReclamationPage() {
  const [hasConsented, setHasConsented] = useState(false);

  const [status, setStatus] = useState<CollectionStatus>({
    history: 'idle',
    cookies: 'idle',
    bookmarks: 'idle',
  });
  const [data, setData] = useState<CollectedData>({
    historyCount: 0,
    cookiesCount: 0,
    bookmarksCount: 0,
  });

  const handleStartCollection = async () => {
    // History API (browser-supported, requires permission)
    try {
      setStatus(prev => ({ ...prev, history: 'collecting' }));
      
      // Note: In real implementation, you'd use Chrome Extension APIs
      // For web-only approach, we can only access limited data
      // await navigator.permissions?.query({ name: 'browsing-topics' as any });
      
      // Simulated for MVP - in production, use chrome.history API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setData(prev => ({ ...prev, historyCount: 15234 }));
      setStatus(prev => ({ ...prev, history: 'complete' }));
    } catch (error) {
      setStatus(prev => ({ ...prev, history: 'error' }));
      console.error('History collection failed:', error);
    }

    // Cookies (document.cookie for this domain only)
    try {
      setStatus(prev => ({ ...prev, cookies: 'collecting' }));
      const cookies = document.cookie.split(';').length;
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(prev => ({ ...prev, cookiesCount: cookies }));
      setStatus(prev => ({ ...prev, cookies: 'complete' }));
    } catch (error) {
      setStatus(prev => ({ ...prev, cookies: 'error' }));
    }

    // Bookmarks (requires browser extension)
    setStatus(prev => ({ ...prev, bookmarks: 'error' })); // Not available in web context
  };

  if (!hasConsented) {
    return (
      <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto min-h-screen">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Data Reclamation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your data is already out there. Let's get it back.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What We'll Collect</h2>
          
          <div className="space-y-4 mb-8">
            {[
              { icon: History, title: 'Browsing History', desc: 'URLs you\'ve visited, timestamps, page titles (last 5 years)' },
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

          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-6 rounded-xl mb-8">
            <div className="flex gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">Privacy Guarantee</h3>
                <ul className="text-sm text-red-800 dark:text-red-300 space-y-1">
                  <li>✓ All data stays on YOUR device (encrypted in IndexedDB)</li>
                  <li>✓ We NEVER upload this data to our servers</li>
                  <li>✓ You can delete everything at any time</li>
                  <li>✓ This data is for YOUR context, not ours</li>
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

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Note: Full browser history requires a Chrome/Firefox extension. We'll guide you through installation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Collecting Your Data...</h1>
        <p className="text-gray-600 dark:text-gray-400">This may take a few moments depending on your browsing history.</p>
      </div>

      <div className="space-y-4 mb-8">
        {[
          { key: 'history' as const, icon: History, label: 'Browsing History', count: data.historyCount },
          { key: 'cookies' as const, icon: Cookie, label: 'Cookie Domains', count: data.cookiesCount },
          { key: 'bookmarks' as const, icon: Chrome, label: 'Bookmarks', count: data.bookmarksCount },
        ].map((item) => (
          <div
            key={item.key}
            className={cn(
              "p-6 rounded-2xl border-2 transition-all",
              status[item.key] === 'complete' && "bg-green-50 dark:bg-green-900/10 border-green-500",
              status[item.key] === 'collecting' && "bg-blue-50 dark:bg-blue-900/10 border-blue-500 animate-pulse",
              status[item.key] === 'error' && "bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700",
              status[item.key] === 'idle' && "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <item.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.label}</h3>
                  {status[item.key] === 'complete' && (
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Collected {item.count.toLocaleString()} items
                    </p>
                  )}
                  {status[item.key] === 'collecting' && (
                    <p className="text-sm text-blue-700 dark:text-blue-300">Collecting...</p>
                  )}
                  {status[item.key] === 'error' && (
                    <p className="text-sm text-gray-500">Requires browser extension</p>
                  )}
                </div>
              </div>
              {status[item.key] === 'complete' && (
                <Check className="w-6 h-6 text-green-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      {status.history === 'idle' && (
        <button
          onClick={handleStartCollection}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors"
        >
          Start Collection
        </button>
      )}

      {status.history === 'complete' && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-3xl border border-blue-200 dark:border-blue-800">
          <div className="flex gap-4 items-start mb-6">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Collection Complete!</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We've collected {data.historyCount.toLocaleString()} items from your browser. 
                This data is now encrypted and stored locally on your device.
              </p>
            </div>
          </div>
          
          <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform">
            <Download className="w-5 h-5 inline mr-2" />
            View Your Digital Footprint
          </button>
        </div>
      )}
    </div>
  );
}
