/**
 * GDPR deadline calculation and compliance tracking utilities.
 */
import type { GDPRRequest } from '@/store/data-reclamation-store';

const MS_PER_DAY = 86_400_000;

/** Known response deadlines (days) by platform. */
const PLATFORM_DEADLINES: Record<string, number> = {
  Google: 30,
  'Meta (Facebook/Instagram)': 30,
  Amazon: 45,
  LinkedIn: 30,
  'Twitter (X)': 30,
  Apple: 45,
  Microsoft: 30,
  TikTok: 30,
};

export function getDeadlineDays(platform: string): number {
  return PLATFORM_DEADLINES[platform] ?? 30;
}

export function getDeadlineDate(request: GDPRRequest): Date {
  const sent = new Date(request.sentDate);
  const days = getDeadlineDays(request.platform);
  return new Date(sent.getTime() + days * MS_PER_DAY);
}

export function getDaysRemaining(request: GDPRRequest): number {
  const deadline = getDeadlineDate(request);
  const now = new Date();
  return Math.ceil((deadline.getTime() - now.getTime()) / MS_PER_DAY);
}

export function isOverdue(request: GDPRRequest): boolean {
  if (request.status === 'received' || request.status === 'parsed') return false;
  return getDaysRemaining(request) < 0;
}

export type ComplianceStatus = 'on-track' | 'due-soon' | 'overdue' | 'complete' | 'failed';

export function getComplianceStatus(request: GDPRRequest): ComplianceStatus {
  if (request.status === 'parsed' || request.status === 'received') return 'complete';
  if (request.status === 'failed') return 'failed';
  const days = getDaysRemaining(request);
  if (days < 0) return 'overdue';
  if (days <= 7) return 'due-soon';
  return 'on-track';
}

export interface ComplianceStats {
  total: number;
  pending: number;
  overdue: number;
  received: number;
  parsed: number;
  failed: number;
  complianceRate: number;
  avgResponseDays: number;
}

export function calculateComplianceStats(requests: GDPRRequest[]): ComplianceStats {
  if (requests.length === 0) {
    return { total: 0, pending: 0, overdue: 0, received: 0, parsed: 0, failed: 0, complianceRate: 100, avgResponseDays: 0 };
  }

  const pending = requests.filter(r => r.status === 'pending' && !isOverdue(r)).length;
  const overdue = requests.filter(r => isOverdue(r)).length;
  const received = requests.filter(r => r.status === 'received').length;
  const parsed = requests.filter(r => r.status === 'parsed').length;
  const failed = requests.filter(r => r.status === 'failed').length;

  const completedRequests = requests.filter(r => r.receivedDate);
  const avgResponseDays = completedRequests.length > 0
    ? completedRequests.reduce((sum, r) => {
        const sent = new Date(r.sentDate).getTime();
        const recv = new Date(r.receivedDate!).getTime();
        return sum + (recv - sent) / MS_PER_DAY;
      }, 0) / completedRequests.length
    : 0;

  const respondedOnTime = completedRequests.filter(r => {
    const days = (new Date(r.receivedDate!).getTime() - new Date(r.sentDate).getTime()) / MS_PER_DAY;
    return days <= getDeadlineDays(r.platform);
  }).length;

  const complianceRate = completedRequests.length > 0
    ? Math.round((respondedOnTime / completedRequests.length) * 100)
    : 100;

  return { total: requests.length, pending, overdue, received, parsed, failed, complianceRate, avgResponseDays: Math.round(avgResponseDays) };
}
