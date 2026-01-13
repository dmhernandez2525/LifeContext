/**
 * Safe Haptics Utility
 * Wraps expo-haptics to prevent crashes on web
 */
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Safe wrapper for impactAsync - only runs on native
 */
export function impactAsync(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium): void {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(style);
  }
}

/**
 * Safe wrapper for notificationAsync - only runs on native
 */
export function notificationAsync(type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success): void {
  if (Platform.OS !== 'web') {
    Haptics.notificationAsync(type);
  }
}

/**
 * Safe wrapper for selectionAsync - only runs on native
 */
export function selectionAsync(): void {
  if (Platform.OS !== 'web') {
    Haptics.selectionAsync();
  }
}

// Re-export types for convenience
export const ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle;
export const NotificationFeedbackType = Haptics.NotificationFeedbackType;

// Export as namespace-like object for drop-in replacement
export const SafeHaptics = {
  impactAsync,
  notificationAsync,
  selectionAsync,
  ImpactFeedbackStyle: Haptics.ImpactFeedbackStyle,
  NotificationFeedbackType: Haptics.NotificationFeedbackType,
};
