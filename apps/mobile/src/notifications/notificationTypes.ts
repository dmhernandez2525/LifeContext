export type NotificationCategory =
  | 'journal-reminder'
  | 'streak-alert'
  | 'insight-ready'
  | 'weekly-summary'
  | 'inactivity-nudge'
  | 'milestone';

export interface NotificationPreferences {
  enabled: boolean;
  journalReminder: boolean;
  journalReminderTime: string; // HH:mm format
  streakAlerts: boolean;
  insightNotifications: boolean;
  weeklySummary: boolean;
  inactivityNudge: boolean;
  inactivityDays: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string; // HH:mm
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  journalReminder: true,
  journalReminderTime: '20:00',
  streakAlerts: true,
  insightNotifications: true,
  weeklySummary: true,
  inactivityNudge: true,
  inactivityDays: 3,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
};

export interface ScheduledNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  scheduledAt: string;
  deepLink?: string;
}
