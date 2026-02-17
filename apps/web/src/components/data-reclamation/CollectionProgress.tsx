/**
 * CollectionProgress - Step-by-step progress indicator for data collection.
 */
import { History, Cookie, Bookmark, Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type StepStatus = 'idle' | 'collecting' | 'complete' | 'error';

interface CollectionProgressProps {
  historyStatus: StepStatus;
  cookiesStatus: StepStatus;
  bookmarksStatus: StepStatus;
  historyCount: number;
  cookiesCount: number;
  bookmarksCount: number;
}

export function CollectionProgress({
  historyStatus,
  cookiesStatus,
  bookmarksStatus,
  historyCount,
  cookiesCount,
  bookmarksCount,
}: CollectionProgressProps) {
  const steps = [
    { key: 'history', icon: History, label: 'Browsing History', status: historyStatus, count: historyCount },
    { key: 'cookies', icon: Cookie, label: 'Cookie Domains', status: cookiesStatus, count: cookiesCount },
    { key: 'bookmarks', icon: Bookmark, label: 'Bookmarks', status: bookmarksStatus, count: bookmarksCount },
  ];

  const completedCount = steps.filter(s => s.status === 'complete').length;
  const overallProgress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-4">
      {/* Overall progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {completedCount}/{steps.length}
        </span>
      </div>

      {/* Steps */}
      {steps.map((step) => (
        <div
          key={step.key}
          className={cn(
            "p-4 rounded-xl border-2 transition-all",
            step.status === 'complete' && "bg-green-50 dark:bg-green-900/10 border-green-500",
            step.status === 'collecting' && "bg-blue-50 dark:bg-blue-900/10 border-blue-500",
            step.status === 'error' && "bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700",
            step.status === 'idle' && "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <step.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{step.label}</h3>
                {step.status === 'complete' && (
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Collected {step.count.toLocaleString()} items
                  </p>
                )}
                {step.status === 'collecting' && (
                  <p className="text-xs text-blue-700 dark:text-blue-300">Collecting...</p>
                )}
                {step.status === 'error' && (
                  <p className="text-xs text-gray-500">Requires browser extension</p>
                )}
              </div>
            </div>
            {step.status === 'complete' && <Check className="w-5 h-5 text-green-600" />}
            {step.status === 'collecting' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
            {step.status === 'error' && <AlertCircle className="w-5 h-5 text-gray-400" />}
          </div>
        </div>
      ))}
    </div>
  );
}
