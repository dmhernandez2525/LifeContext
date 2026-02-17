import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type {
  NotificationCategory,
  NotificationPreferences,
  ScheduledNotification,
} from './notificationTypes';
import { DEFAULT_NOTIFICATION_PREFERENCES } from './notificationTypes';
import { storage } from '../lib/storage';

const PREFS_KEY = 'lcc-notification-prefs';
const SCHEDULED_KEY = 'lcc-scheduled-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export function getPreferences(): NotificationPreferences {
  const data = storage.getString(PREFS_KEY);
  if (!data) return DEFAULT_NOTIFICATION_PREFERENCES;
  return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(data) };
}

export function savePreferences(prefs: NotificationPreferences): void {
  storage.set(PREFS_KEY, JSON.stringify(prefs));
}

function getScheduledList(): ScheduledNotification[] {
  const data = storage.getString(SCHEDULED_KEY);
  return data ? JSON.parse(data) : [];
}

function saveScheduledList(list: ScheduledNotification[]): void {
  storage.set(SCHEDULED_KEY, JSON.stringify(list));
}

export async function scheduleJournalReminder(time: string): Promise<string | null> {
  const [hours, minutes] = time.split(':').map(Number);

  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: hours,
    minute: minutes,
  };

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to Reflect',
      body: "Take a moment to journal your thoughts and feelings.",
      data: { deepLink: '/(tabs)/journal', category: 'journal-reminder' },
      sound: true,
    },
    trigger,
  });

  trackScheduled({
    id,
    category: 'journal-reminder',
    title: 'Time to Reflect',
    body: "Take a moment to journal your thoughts and feelings.",
    scheduledAt: new Date().toISOString(),
    deepLink: '/(tabs)/journal',
  });

  return id;
}

export async function scheduleStreakAlert(): Promise<string | null> {
  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: 21,
    minute: 0,
  };

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Keep Your Streak Alive!',
      body: "You haven't logged anything today. One quick entry keeps it going.",
      data: { deepLink: '/recording', category: 'streak-alert' },
      sound: true,
    },
    trigger,
  });

  trackScheduled({
    id,
    category: 'streak-alert',
    title: 'Keep Your Streak Alive!',
    body: "You haven't logged anything today.",
    scheduledAt: new Date().toISOString(),
    deepLink: '/recording',
  });

  return id;
}

export async function sendInsightNotification(insightSummary: string): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'New Insight Discovered',
      body: insightSummary,
      data: { deepLink: '/(tabs)/insights', category: 'insight-ready' },
      sound: true,
    },
    trigger: null,
  });

  trackScheduled({
    id,
    category: 'insight-ready',
    title: 'New Insight Discovered',
    body: insightSummary,
    scheduledAt: new Date().toISOString(),
    deepLink: '/(tabs)/insights',
  });

  return id;
}

export async function scheduleWeeklySummary(): Promise<string | null> {
  const trigger: Notifications.WeeklyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
    weekday: 1,
    hour: 9,
    minute: 0,
  };

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your Weekly Reflection',
      body: 'See how your week went with your personal summary.',
      data: { deepLink: '/(tabs)/insights', category: 'weekly-summary' },
      sound: true,
    },
    trigger,
  });

  trackScheduled({
    id,
    category: 'weekly-summary',
    title: 'Your Weekly Reflection',
    body: 'See how your week went with your personal summary.',
    scheduledAt: new Date().toISOString(),
    deepLink: '/(tabs)/insights',
  });

  return id;
}

export async function scheduleInactivityNudge(days: number): Promise<string | null> {
  const trigger: Notifications.TimeIntervalTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: days * 86400,
    repeats: false,
  };

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'We Miss You',
      body: `It's been ${days} days since your last entry. Your story continues.`,
      data: { deepLink: '/recording', category: 'inactivity-nudge' },
      sound: true,
    },
    trigger,
  });

  trackScheduled({
    id,
    category: 'inactivity-nudge',
    title: 'We Miss You',
    body: `It's been ${days} days since your last entry.`,
    scheduledAt: new Date().toISOString(),
    deepLink: '/recording',
  });

  return id;
}

export async function sendMilestoneNotification(
  milestone: string,
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Milestone Reached!',
      body: milestone,
      data: { deepLink: '/(tabs)', category: 'milestone' },
      sound: true,
    },
    trigger: null,
  });

  trackScheduled({
    id,
    category: 'milestone',
    title: 'Milestone Reached!',
    body: milestone,
    scheduledAt: new Date().toISOString(),
    deepLink: '/(tabs)',
  });

  return id;
}

function trackScheduled(notification: ScheduledNotification): void {
  const list = getScheduledList();
  list.push(notification);
  // Keep last 50 entries
  if (list.length > 50) {
    saveScheduledList(list.slice(-50));
  } else {
    saveScheduledList(list);
  }
}

export async function cancelNotification(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
  const list = getScheduledList().filter((n) => n.id !== id);
  saveScheduledList(list);
}

export async function cancelByCategory(category: NotificationCategory): Promise<void> {
  const list = getScheduledList();
  const toCancel = list.filter((n) => n.category === category);

  for (const n of toCancel) {
    await Notifications.cancelScheduledNotificationAsync(n.id);
  }

  saveScheduledList(list.filter((n) => n.category !== category));
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  saveScheduledList([]);
}

export function getScheduledNotifications(): ScheduledNotification[] {
  return getScheduledList();
}

export async function getBadgeCount(): Promise<number> {
  return Notifications.getBadgeCountAsync();
}

export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}
