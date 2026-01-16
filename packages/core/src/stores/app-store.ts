/**
 * Main application store using custom implementation (no zustand)
 * Platform-agnostic state management for LifeContext
 * Replaces zustand to avoid Import.meta issues in Metro/Web
 */
import { useSyncExternalStore, useCallback, useRef } from 'react';
import type { UserSettings, Question, QuestionCategory } from '@lcc/types';

// ============================================================
// TYPES
// ============================================================

export interface AppState {
  // Initialization
  isInitialized: boolean;
  isUnlocked: boolean;

  // Settings
  settings: UserSettings | null;

  // Current session
  currentCategoryId: string | null;
  currentQuestionId: string | null;

  // Categories and questions (loaded from storage)
  categories: QuestionCategory[];
  questions: Question[];

  // Progress
  answeredQuestionIds: string[];
  totalRecordingTime: number;

  // Actions
  initialize: (settings: UserSettings) => void;
  unlock: () => void;
  lock: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setCurrentCategory: (categoryId: string | null) => void;
  setCurrentQuestion: (questionId: string | null) => void;
  setCategories: (categories: QuestionCategory[]) => void;
  setQuestions: (questions: Question[]) => void;
  markQuestionAnswered: (questionId: string) => void;
  addRecordingTime: (seconds: number) => void;
  reset: () => void;
}

// ============================================================
// DEFAULT VALUES
// ============================================================

export const DEFAULT_SETTINGS: UserSettings = {
  preferredInputMethod: 'voice',
  theme: 'system',
  language: 'en',
  showLiveTranscription: false,
  aiProvider: {
    mode: 'cloud',
    cloudProvider: 'anthropic',
    useDefaultKey: true,
  },
  storage: {
    location: 'local',
    autoBackup: false,
    backupFrequency: 'daily',
  },
  autoLockTimeout: 5, // 5 minutes default
};

const INITIAL_STATE = {
  isInitialized: false,
  isUnlocked: false,
  settings: null,
  currentCategoryId: null,
  currentQuestionId: null,
  categories: [],
  questions: [],
  answeredQuestionIds: [],
  totalRecordingTime: 0,
};

// ============================================================
// CUSTOM STORE IMPLEMENTATION
// ============================================================

class AppStore {
  private state: Omit<AppState, 'initialize' | 'unlock' | 'lock' | 'updateSettings' | 'setCurrentCategory' | 'setCurrentQuestion' | 'setCategories' | 'setQuestions' | 'markQuestionAnswered' | 'addRecordingTime' | 'reset'>;
  private listeners: Set<() => void>;
  private storage: any;
  private storageKey: string;
  private stateVersion: number;  // Track state changes for cache invalidation

  constructor(storage?: any) {
    this.state = { ...INITIAL_STATE };
    this.listeners = new Set();
    this.storageKey = 'lcc-app-store';
    this.stateVersion = 0;
    
    // Default storage (localStorage on web, customized otherwise)
    if (storage) {
      this.storage = storage;
    } else if (typeof window !== 'undefined' && window.localStorage) {
      this.storage = window.localStorage;
    } else {
      this.storage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      };
    }

    this.hydrate();
  }

  private hydrate() {
    try {
      const data = this.storage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        // Restore persisted fields
        if (parsed) {
          this.state.isInitialized = parsed.isInitialized ?? this.state.isInitialized;
          this.state.settings = parsed.settings ?? this.state.settings;
          this.state.answeredQuestionIds = parsed.answeredQuestionIds ?? this.state.answeredQuestionIds;
          this.state.totalRecordingTime = parsed.totalRecordingTime ?? this.state.totalRecordingTime;
        }
      }
    } catch (e) {
      console.error('Failed to hydrate app store:', e);
    }
  }

  private persist() {
    try {
      // Persist important fields including settings
      const persistedState = {
        isInitialized: this.state.isInitialized,
        settings: this.state.settings,
        answeredQuestionIds: this.state.answeredQuestionIds,
        totalRecordingTime: this.state.totalRecordingTime,
      };
      this.storage.setItem(this.storageKey, JSON.stringify(persistedState));
    } catch (e) {
      console.error('Failed to persist app store:', e);
    }
  }

  private notify() {
    this.stateVersion++;
    this.listeners.forEach(listener => listener());
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getStateVersion = () => {
    return this.stateVersion;
  };

  getState = () => {
    return {
      ...this.state,
      initialize: this.initialize,
      unlock: this.unlock,
      lock: this.lock,
      updateSettings: this.updateSettings,
      setCurrentCategory: this.setCurrentCategory,
      setCurrentQuestion: this.setCurrentQuestion,
      setCategories: this.setCategories,
      setQuestions: this.setQuestions,
      markQuestionAnswered: this.markQuestionAnswered,
      addRecordingTime: this.addRecordingTime,
      reset: this.reset,
    } as AppState;
  };

  // Actions
  initialize = (settings: UserSettings) => {
    this.state.isInitialized = true;
    this.state.settings = settings;
    this.persist();
    this.notify();
  };

  unlock = () => {
    this.state.isUnlocked = true;
    this.notify();
  };

  lock = () => {
    this.state.isUnlocked = false;
    this.notify();
  };

  updateSettings = (newSettings: Partial<UserSettings>) => {
    const current = this.state.settings || DEFAULT_SETTINGS;
    this.state.settings = { ...current, ...newSettings };
    this.persist();
    this.notify();
  };

  setCurrentCategory = (categoryId: string | null) => {
    this.state.currentCategoryId = categoryId;
    this.notify();
  };

  setCurrentQuestion = (questionId: string | null) => {
    this.state.currentQuestionId = questionId;
    this.notify();
  };

  setCategories = (categories: QuestionCategory[]) => {
    this.state.categories = categories;
    this.notify();
  };

  setQuestions = (questions: Question[]) => {
    this.state.questions = questions;
    this.notify();
  };

  markQuestionAnswered = (questionId: string) => {
    if (!this.state.answeredQuestionIds.includes(questionId)) {
      this.state.answeredQuestionIds = [...this.state.answeredQuestionIds, questionId];
      this.persist();
      this.notify();
    }
  };

  addRecordingTime = (seconds: number) => {
    this.state.totalRecordingTime += seconds;
    this.persist();
    this.notify();
  };

  reset = () => {
    this.state = { ...INITIAL_STATE };
    this.persist();
    this.notify();
  };
}

// Singleton instance
let storeInstance: AppStore | null = null;

export function createAppStore(storage?: any) {
  if (!storeInstance) {
    storeInstance = new AppStore(storage);
  }
  return storeInstance;
}

// React Hook
export function useAppStore<T = AppState>(
  selector?: (state: AppState) => T
): T {
  const store = createAppStore();

  // Store selector in ref to avoid recreating getSnapshot
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  // Cache for memoizing selector results - keyed by state VERSION (not reference)
  const cacheRef = useRef<{ version: number; result: T } | null>(null);

  // getSnapshot must be stable - no dependencies that change
  const getSnapshot = useCallback(() => {
    const currentVersion = store.getStateVersion();
    const currentSelector = selectorRef.current;

    // If version hasn't changed, return cached result
    if (cacheRef.current && cacheRef.current.version === currentVersion) {
      return cacheRef.current.result;
    }

    // Get fresh state and compute result
    const state = store.getState();

    if (!currentSelector) {
      const result = state as unknown as T;
      cacheRef.current = { version: currentVersion, result };
      return result;
    }

    // Compute new result and cache it
    const result = currentSelector(state);
    cacheRef.current = { version: currentVersion, result };
    return result;
  }, [store]); // Only depend on store, not selector

  return useSyncExternalStore(
    store.subscribe,
    getSnapshot,
    getSnapshot
  );
}

// ============================================================
// DERIVED HOOKS
// ============================================================

/**
 * Hook for calculating progress metrics
 */
export function useProgress() {
  const questions = useAppStore((state) => state.questions);
  const answeredQuestionIds = useAppStore((state) => state.answeredQuestionIds);

  const getCategoryProgress = (categoryId: string) => {
    const categoryQuestions = questions.filter((q) => q.categoryId === categoryId);
    const answered = categoryQuestions.filter((q) =>
      answeredQuestionIds.includes(q.id)
    );
    return {
      total: categoryQuestions.length,
      answered: answered.length,
      percentage:
        categoryQuestions.length > 0
          ? Math.round((answered.length / categoryQuestions.length) * 100)
          : 0,
    };
  };

  const overallProgress = {
    totalQuestions: questions.length,
    answeredQuestions: answeredQuestionIds.length,
    percentage:
      questions.length > 0
        ? Math.round((answeredQuestionIds.length / questions.length) * 100)
        : 0,
  };

  return { getCategoryProgress, overallProgress };
}
