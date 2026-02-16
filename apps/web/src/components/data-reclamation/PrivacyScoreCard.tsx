/**
 * PrivacyScoreCard - Visual privacy score display with category breakdown.
 */
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyzePrivacy } from '@/lib/privacyScoring';

interface PrivacyScoreCardProps {
  cookieDomains: string[];
}

export function PrivacyScoreCard({ cookieDomains }: PrivacyScoreCardProps) {
  const analysis = analyzePrivacy(cookieDomains);

  const categories = [
    { label: 'Tracking', count: analysis.trackingCookies, color: 'bg-red-500' },
    { label: 'Advertising', count: analysis.advertisingCookies, color: 'bg-orange-500' },
    { label: 'Analytics', count: analysis.analyticsCookies, color: 'bg-yellow-500' },
    { label: 'Functional', count: analysis.functionalCookies, color: 'bg-green-500' },
    { label: 'Other', count: analysis.unknownCookies, color: 'bg-gray-400' },
  ].filter(c => c.count > 0);

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
          <Shield className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.score}</span>
            <span className="text-sm text-gray-500">/100</span>
          </div>
          <span className={cn("text-sm font-medium", analysis.color)}>
            {analysis.label} Privacy
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            analysis.score >= 70 ? "bg-green-500" : analysis.score >= 40 ? "bg-yellow-500" : "bg-red-500"
          )}
          style={{ width: `${analysis.score}%` }}
        />
      </div>

      {/* Category breakdown */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <div key={cat.label} className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", cat.color)} />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {cat.label}: {cat.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
