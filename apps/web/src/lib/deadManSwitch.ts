/**
 * Dead Man's Switch utilities.
 * Monitors user activity and triggers configurable actions after prolonged inactivity.
 */

const MS_PER_DAY = 86_400_000;

export type SwitchAction = 'wipe' | 'notify' | 'export';

export interface SwitchStatus {
  isArmed: boolean;
  daysInactive: number;
  daysUntilTrigger: number;
  lastActivity: number;
  triggerDate: Date;
  action: SwitchAction;
  urgencyLevel: 'safe' | 'warning' | 'critical';
}

/**
 * Calculate the current status of the dead man's switch.
 */
export function getSwitchStatus(
  enabled: boolean,
  lastActivity: number,
  thresholdDays: number,
  action: SwitchAction
): SwitchStatus {
  const now = Date.now();
  const daysInactive = Math.floor((now - lastActivity) / MS_PER_DAY);
  const daysUntilTrigger = Math.max(0, thresholdDays - daysInactive);
  const triggerDate = new Date(lastActivity + thresholdDays * MS_PER_DAY);

  let urgencyLevel: SwitchStatus['urgencyLevel'] = 'safe';
  if (enabled && daysUntilTrigger <= 7) urgencyLevel = 'critical';
  else if (enabled && daysUntilTrigger <= 14) urgencyLevel = 'warning';

  return {
    isArmed: enabled,
    daysInactive,
    daysUntilTrigger,
    lastActivity,
    triggerDate,
    action,
    urgencyLevel,
  };
}

/**
 * Check if the switch should trigger.
 */
export function shouldTrigger(
  enabled: boolean,
  lastActivity: number,
  thresholdDays: number
): boolean {
  if (!enabled) return false;
  const daysInactive = (Date.now() - lastActivity) / MS_PER_DAY;
  return daysInactive >= thresholdDays;
}

/**
 * Format the action label for display.
 */
export function getActionLabel(action: SwitchAction): string {
  const labels: Record<SwitchAction, string> = {
    wipe: 'Wipe all data',
    notify: 'Notify emergency contacts',
    export: 'Export data to contacts',
  };
  return labels[action];
}

/**
 * Get action description for setup.
 */
export function getActionDescription(action: SwitchAction): string {
  const descriptions: Record<SwitchAction, string> = {
    wipe: 'Permanently delete all encrypted data from this device after the inactivity period.',
    notify: 'Send a notification to your emergency contacts after the inactivity period.',
    export: 'Export an encrypted backup to your emergency contacts after the inactivity period.',
  };
  return descriptions[action];
}

export const THRESHOLD_OPTIONS = [
  { value: 30, label: '30 days' },
  { value: 60, label: '60 days' },
  { value: 90, label: '90 days' },
  { value: 180, label: '6 months' },
  { value: 365, label: '1 year' },
];
