import { useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter, type RelativePathString } from 'expo-router';
interface Subscription {
  remove: () => void;
}
import type { NotificationPreferences } from './notificationTypes';
import {
  requestPermissions,
  getPreferences,
  savePreferences,
  scheduleJournalReminder,
  scheduleStreakAlert,
  scheduleWeeklySummary,
  scheduleInactivityNudge,
  cancelByCategory,
  cancelAllNotifications,
} from './notificationService';

interface UseNotificationsReturn {
  preferences: NotificationPreferences;
  updatePreferences: (updates: Partial<NotificationPreferences>) => Promise<void>;
  syncScheduledNotifications: () => Promise<void>;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

export function useNotifications(): UseNotificationsReturn {
  const router = useRouter();
  const responseListener = useRef<Subscription | null>(null);
  const hasPermissionRef = useRef(false);
  const prefsRef = useRef<NotificationPreferences>(getPreferences());

  useEffect(() => {
    if (Platform.OS === 'web') return;

    Notifications.getPermissionsAsync().then(({ status }) => {
      hasPermissionRef.current = status === 'granted';
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const deepLink = response.notification.request.content.data?.deepLink;
        if (typeof deepLink === 'string' && deepLink.startsWith('/')) {
          router.navigate(deepLink as RelativePathString);
        }
      },
    );

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [router]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await requestPermissions();
    hasPermissionRef.current = granted;
    return granted;
  }, []);

  const syncScheduledNotifications = useCallback(async (): Promise<void> => {
    const prefs = getPreferences();

    if (!prefs.enabled) {
      await cancelAllNotifications();
      return;
    }

    if (prefs.journalReminder) {
      await cancelByCategory('journal-reminder');
      await scheduleJournalReminder(prefs.journalReminderTime);
    } else {
      await cancelByCategory('journal-reminder');
    }

    if (prefs.streakAlerts) {
      await cancelByCategory('streak-alert');
      await scheduleStreakAlert();
    } else {
      await cancelByCategory('streak-alert');
    }

    if (prefs.weeklySummary) {
      await cancelByCategory('weekly-summary');
      await scheduleWeeklySummary();
    } else {
      await cancelByCategory('weekly-summary');
    }

    if (prefs.inactivityNudge) {
      await cancelByCategory('inactivity-nudge');
      await scheduleInactivityNudge(prefs.inactivityDays);
    } else {
      await cancelByCategory('inactivity-nudge');
    }
  }, []);

  const updatePreferences = useCallback(
    async (updates: Partial<NotificationPreferences>): Promise<void> => {
      const current = getPreferences();
      const updated = { ...current, ...updates };
      savePreferences(updated);
      prefsRef.current = updated;
      await syncScheduledNotifications();
    },
    [syncScheduledNotifications],
  );

  return {
    preferences: prefsRef.current,
    updatePreferences,
    syncScheduledNotifications,
    hasPermission: hasPermissionRef.current,
    requestPermission,
  };
}
