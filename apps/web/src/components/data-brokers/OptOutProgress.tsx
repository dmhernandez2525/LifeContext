/**
 * OptOutProgress - Summary stats and progress bar for data broker opt-out tracking.
 */
import { Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptOutProgressProps {
  totalBrokers: number;
  optedOutCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

export function OptOutProgress({ totalBrokers, optedOutCount, easyCount, mediumCount, hardCount }: OptOutProgressProps) {
  const percentage = totalBrokers > 0 ? Math.round((optedOutCount / totalBrokers) * 100) : 0;
  const remaining = totalBrokers - optedOutCount;

  const exposureLevel = percentage >= 80 ? 'Low' : percentage >= 40 ? 'Moderate' : 'High';
  const exposureColor = percentage >= 80 ? 'text-green-600' : percentage >= 40 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
          <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Opt-Out Progress</h2>
          <p className={cn("text-sm font-medium", exposureColor)}>
            {exposureLevel} Exposure
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">{optedOutCount} of {totalBrokers} brokers</span>
          <span className="font-bold text-gray-900 dark:text-white">{percentage}%</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", percentage >= 80 ? "bg-green-500" : percentage >= 40 ? "bg-yellow-500" : "bg-red-500")}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-900/10 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">{optedOutCount}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 bg-red-50 dark:bg-red-900/10 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">{remaining}</div>
            <div className="text-xs text-gray-500">Remaining</div>
          </div>
        </div>
      </div>

      {/* Difficulty breakdown */}
      <div className="mt-3 flex gap-2 text-xs">
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full">
          {easyCount} Easy
        </span>
        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-full">
          {mediumCount} Medium
        </span>
        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-full">
          {hardCount} Hard
        </span>
      </div>
    </div>
  );
}
