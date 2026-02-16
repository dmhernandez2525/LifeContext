/**
 * RequestTracker - Enhanced GDPR request list with deadline tracking and status management.
 */
import { Clock, CheckCircle2, AlertTriangle, XCircle, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getDaysRemaining, getComplianceStatus, getDeadlineDate, type ComplianceStatus } from '@/lib/gdprDeadlines';
import type { GDPRRequest } from '@/store/data-reclamation-store';

interface RequestTrackerProps {
  requests: GDPRRequest[];
  onUpdateStatus: (id: string, status: GDPRRequest['status']) => void;
  onMarkReceived: (id: string) => void;
}

const STATUS_CONFIG: Record<ComplianceStatus, { label: string; color: string; icon: typeof Clock }> = {
  'on-track': { label: 'On Track', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', icon: Clock },
  'due-soon': { label: 'Due Soon', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', icon: AlertTriangle },
  'overdue': { label: 'Overdue', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', icon: AlertTriangle },
  'complete': { label: 'Complete', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: CheckCircle2 },
  'failed': { label: 'Failed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300', icon: XCircle },
};

export function RequestTracker({ requests, onUpdateStatus, onMarkReceived }: RequestTrackerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (requests.length === 0) return null;

  const sorted = [...requests].sort((a, b) => {
    const statusOrder: Record<string, number> = { pending: 0, received: 1, parsed: 2, failed: 3 };
    const aOverdue = getDaysRemaining(a) < 0 ? -1 : 0;
    const bOverdue = getDaysRemaining(b) < 0 ? -1 : 0;
    if (aOverdue !== bOverdue) return aOverdue - bOverdue;
    return (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4);
  });

  return (
    <div className="space-y-3">
      {sorted.map((req) => {
        const compliance = getComplianceStatus(req);
        const config = STATUS_CONFIG[compliance];
        const StatusIcon = config.icon;
        const daysLeft = getDaysRemaining(req);
        const deadline = getDeadlineDate(req);
        const isExpanded = expandedId === req.id;

        return (
          <div key={req.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedId(isExpanded ? null : req.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <StatusIcon className={cn("w-5 h-5", compliance === 'overdue' && "text-red-500", compliance === 'due-soon' && "text-yellow-500", compliance === 'on-track' && "text-blue-500", compliance === 'complete' && "text-green-500", compliance === 'failed' && "text-gray-400")} />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{req.platform}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sent {new Date(req.sentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", config.color)}>
                  {compliance === 'on-track' || compliance === 'due-soon'
                    ? `${Math.max(0, daysLeft)}d left`
                    : config.label}
                </span>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">Deadline</span>
                    <p className="font-medium text-gray-900 dark:text-white">{deadline.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">Status</span>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{req.status}</p>
                  </div>
                  {req.receivedDate && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">Received</span>
                      <p className="font-medium text-gray-900 dark:text-white">{new Date(req.receivedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {req.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onMarkReceived(req.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Upload className="w-4 h-4" /> Mark Received
                    </button>
                    <button
                      onClick={() => onUpdateStatus(req.id, 'failed')}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 transition-colors"
                    >
                      Mark Failed
                    </button>
                  </div>
                )}
                {req.status === 'received' && (
                  <button
                    onClick={() => onUpdateStatus(req.id, 'parsed')}
                    className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Mark as Parsed
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
