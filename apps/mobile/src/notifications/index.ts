export {
  requestPermissions,
  getPreferences,
  savePreferences,
  scheduleJournalReminder,
  scheduleStreakAlert,
  sendInsightNotification,
  scheduleWeeklySummary,
  scheduleInactivityNudge,
  sendMilestoneNotification,
  cancelNotification,
  cancelByCategory,
  cancelAllNotifications,
  getScheduledNotifications,
  getBadgeCount,
  setBadgeCount,
} from './notificationService';

export { useNotifications } from './useNotifications';

export type {
  NotificationCategory,
  NotificationPreferences,
  ScheduledNotification,
} from './notificationTypes';

export { DEFAULT_NOTIFICATION_PREFERENCES } from './notificationTypes';
