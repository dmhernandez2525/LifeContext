/**
 * @lcc/core - Shared business logic for LifeContext
 *
 * Platform-agnostic stores, hooks, and utilities that can be
 * used in both web (React) and mobile (React Native) applications.
 */

// Stores
export {
  useAppStore,
  useProgress,
  createAppStore,
  DEFAULT_SETTINGS,
  type AppState,
} from './stores';

// Hooks
export {
  useEmotionalTrends,
  useProactivePrompts,
  useLifeChapters,
  type MoodDataPoint,
  type EmotionalPeriod,
  type EmotionalCorrelation,
  type EmotionalInsight,
  type UseEmotionalTrendsReturn,
  type ProactivePrompt,
  type AnniversaryEvent,
  type UseProactivePromptsReturn,
  type LifeChapter,
  type ChapterTransition,
  type UseLifeChaptersReturn,
} from './hooks';

// Utils
export {
  formatDuration,
  formatRelativeTime,
  formatDate,
  truncate,
  generateId,
  debounce,
  throttle,
  cn,
  decodeBase64,
  encodeBase64,
  sleep,
  isDefined,
  groupBy,
  percentage,
} from './utils';
