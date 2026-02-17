/**
 * ComplianceDashboard - Overview stats for GDPR request compliance tracking.
 */
import { Shield, Clock, AlertTriangle, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComplianceStats } from '@/lib/gdprDeadlines';

interface ComplianceDashboardProps {
  stats: ComplianceStats;
}

const STAT_CARDS = [
  { key: 'pending' as const, label: 'Pending', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
  { key: 'overdue' as const, label: 'Overdue', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/10' },
  { key: 'received' as const, label: 'Received', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
  { key: 'failed' as const, label: 'Failed', icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800/50' },
] as const;

export function ComplianceDashboard({ stats }: ComplianceDashboardProps) {
  if (stats.total === 0) return null;

  const complianceColor = stats.complianceRate >= 80 ? 'text-green-600' : stats.complianceRate >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-purple-500" />
        Compliance Dashboard
      </h2>

      {/* Top metrics row */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Compliance Rate</span>
          </div>
          <span className={cn("text-2xl font-bold", complianceColor)}>{stats.complianceRate}%</span>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Avg Response</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.avgResponseDays > 0 ? `${stats.avgResponseDays}d` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-4 gap-2">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key} className={cn("p-2.5 rounded-lg text-center", bg)}>
            <Icon className={cn("w-4 h-4 mx-auto mb-1", color)} />
            <div className="text-lg font-bold text-gray-900 dark:text-white">{stats[key]}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>{stats.total} total requests</span>
          <span>{stats.received + stats.parsed} completed</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
          {stats.parsed > 0 && (
            <div className="h-full bg-green-500" style={{ width: `${(stats.parsed / stats.total) * 100}%` }} />
          )}
          {stats.received > 0 && (
            <div className="h-full bg-emerald-400" style={{ width: `${(stats.received / stats.total) * 100}%` }} />
          )}
          {stats.pending > 0 && (
            <div className="h-full bg-blue-400" style={{ width: `${(stats.pending / stats.total) * 100}%` }} />
          )}
          {stats.overdue > 0 && (
            <div className="h-full bg-red-400" style={{ width: `${(stats.overdue / stats.total) * 100}%` }} />
          )}
        </div>
      </div>
    </div>
  );
}
