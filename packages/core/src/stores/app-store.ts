/**
 * Main application store using Zustand
 * Platform-agnostic state management for LifeContext
 */
import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
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
};

// ============================================================
// STORE CREATOR
// ============================================================

type AppPersist = (
  config: StateCreator<AppState>,
  options: PersistOptions<AppState>
) => StateCreator<AppState>;

/**
 * Create the app store with optional custom storage adapter
 * This allows both web (localStorage) and mobile (MMKV) to use the same store
 */
export function createAppStore(storage?: any) {
  const persistOptions: PersistOptions<AppState> = {
    name: 'lcc-app-store',
    storage: storage || createJSONStorage(() => {
      // Default to a no-op storage for SSR/non-browser environments
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage;
      }
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      };
    }),
    partialize: (state) => ({
      isInitialized: state.isInitialized,
      answeredQuestionIds: state.answeredQuestionIds,
      totalRecordingTime: state.totalRecordingTime,
    } as AppState),
  };

  return create<AppState>()(
    (persist as AppPersist)(
      (set, get) => ({
        // Initial state
        isInitialized: false,
        isUnlocked: false,
        settings: null,
        currentCategoryId: null,
        currentQuestionId: null,
        categories: [],
        questions: [],
        answeredQuestionIds: [],
        totalRecordingTime: 0,

        // Actions
        initialize: (settings) => {
          set({
            isInitialized: true,
            settings,
          });
        },

        unlock: () => {
          set({ isUnlocked: true });
        },

        lock: () => {
          set({ isUnlocked: false });
        },

        updateSettings: (newSettings) => {
          const current = get().settings || DEFAULT_SETTINGS;
          set({
            settings: { ...current, ...newSettings },
          });
        },

        setCurrentCategory: (categoryId) => {
          set({ currentCategoryId: categoryId });
        },

        setCurrentQuestion: (questionId) => {
          set({ currentQuestionId: questionId });
        },

        setCategories: (categories) => {
          set({ categories });
        },

        setQuestions: (questions) => {
          set({ questions });
        },

        markQuestionAnswered: (questionId) => {
          const current = get().answeredQuestionIds;
          if (!current.includes(questionId)) {
            set({ answeredQuestionIds: [...current, questionId] });
          }
        },

        addRecordingTime: (seconds) => {
          set({ totalRecordingTime: get().totalRecordingTime + seconds });
        },

        reset: () => {
          set({
            isInitialized: false,
            isUnlocked: false,
            settings: null,
            currentCategoryId: null,
            currentQuestionId: null,
            categories: [],
            questions: [],
            answeredQuestionIds: [],
            totalRecordingTime: 0,
          });
        },
      }),
      persistOptions
    )
  );
}

// Default store instance for web (uses localStorage)
export const useAppStore = createAppStore();

// ============================================================
// DERIVED HOOKS
// ============================================================

/**
 * Hook for calculating progress metrics
 */
export function useProgress() {
  const { questions, answeredQuestionIds } = useAppStore();

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
