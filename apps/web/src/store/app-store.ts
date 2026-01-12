/**
 * Re-export app store from @lcc/core for backward compatibility
 * The actual store is now in packages/core
 */
export {
  useAppStore,
  useProgress,
  createAppStore,
  DEFAULT_SETTINGS,
  type AppState,
} from '@lcc/core';
