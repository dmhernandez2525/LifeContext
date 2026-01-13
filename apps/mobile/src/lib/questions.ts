/**
 * Questions Data Layer
 * 
 * Provides structured life questions organized by categories.
 * Ported from web app with mobile-specific storage integration.
 */
import { Platform } from 'react-native';

// ============================================================
// STORAGE (platform-aware: MMKV on native, localStorage on web)
// ============================================================

// Simple storage interface
interface SimpleStorage {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
}

// Web localStorage wrapper
const webStorage: SimpleStorage = {
  getString: (key: string) => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key) || undefined;
    }
    return undefined;
  },
  set: (key: string, value: string) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
};

let questionsStorage: SimpleStorage | null = null;

function getStorage(): SimpleStorage {
  if (questionsStorage) return questionsStorage;
  
  // On web, use localStorage
  if (Platform.OS === 'web') {
    questionsStorage = webStorage;
    return questionsStorage;
  }
  
  // On native, use MMKV (dynamic import to avoid bundling on web)
  if (typeof window !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { MMKV } = require('react-native-mmkv');
      questionsStorage = new MMKV({ id: 'questions-storage' });
    } catch (e) {
      // Fallback to web storage if MMKV fails
      questionsStorage = webStorage;
    }
  } else {
    questionsStorage = webStorage;
  }
  
  return questionsStorage as SimpleStorage;
}

const QUESTIONS_KEY = 'life_questions';
const CATEGORIES_KEY = 'question_categories';
const ANSWERED_KEY = 'answered_questions';

// ============================================================
// TYPES
// ============================================================

export interface QuestionCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export interface Question {
  id: string;
  categoryId: string;
  text: string;
  isStarter: boolean; // Built-in starter question
  createdAt: string;
}

export interface AnsweredQuestion {
  questionId: string;
  recordingId?: string;
  journalId?: string;
  answeredAt: string;
}

// ============================================================
// DEFAULT CATEGORIES
// ============================================================

const DEFAULT_CATEGORIES: QuestionCategory[] = [
  {
    id: 'identity',
    slug: 'identity',
    name: 'Identity & Self',
    description: 'Who you are at your core',
    icon: 'user',
    color: '#3b82f6',
    order: 1,
  },
  {
    id: 'values',
    slug: 'values',
    name: 'Values & Beliefs',
    description: 'What guides your decisions',
    icon: 'heart',
    color: '#ef4444',
    order: 2,
  },
  {
    id: 'relationships',
    slug: 'relationships',
    name: 'Relationships',
    description: 'People who shape your life',
    icon: 'users',
    color: '#10b981',
    order: 3,
  },
  {
    id: 'career',
    slug: 'career',
    name: 'Career & Work',
    description: 'Your professional journey',
    icon: 'briefcase',
    color: '#f59e0b',
    order: 4,
  },
  {
    id: 'memories',
    slug: 'memories',
    name: 'Memories & Stories',
    description: 'Important moments in your life',
    icon: 'image',
    color: '#a855f7',
    order: 5,
  },
  {
    id: 'goals',
    slug: 'goals',
    name: 'Goals & Dreams',
    description: 'Where you want to go',
    icon: 'target',
    color: '#0ea5e9',
    order: 6,
  },
  {
    id: 'health',
    slug: 'health',
    name: 'Health & Wellness',
    description: 'Physical and mental wellbeing',
    icon: 'activity',
    color: '#14b8a6',
    order: 7,
  },
  {
    id: 'legacy',
    slug: 'legacy',
    name: 'Legacy & Impact',
    description: 'What you want to leave behind',
    icon: 'star',
    color: '#ec4899',
    order: 8,
  },
];

// ============================================================
// STARTER QUESTIONS
// ============================================================

const STARTER_QUESTIONS: Omit<Question, 'id' | 'createdAt'>[] = [
  // Identity & Self
  { categoryId: 'identity', text: 'How would you describe yourself in three words?', isStarter: true },
  { categoryId: 'identity', text: 'What makes you feel most like yourself?', isStarter: true },
  { categoryId: 'identity', text: 'What are you most proud of about yourself?', isStarter: true },
  { categoryId: 'identity', text: 'How have you changed in the last 10 years?', isStarter: true },
  { categoryId: 'identity', text: 'What do you wish more people knew about you?', isStarter: true },
  
  // Values & Beliefs
  { categoryId: 'values', text: 'What do you believe in most strongly?', isStarter: true },
  { categoryId: 'values', text: 'What would you never compromise on?', isStarter: true },
  { categoryId: 'values', text: 'How has your worldview changed over time?', isStarter: true },
  { categoryId: 'values', text: 'What life lesson took you the longest to learn?', isStarter: true },
  
  // Relationships
  { categoryId: 'relationships', text: 'Who has had the biggest impact on your life?', isStarter: true },
  { categoryId: 'relationships', text: 'What does friendship mean to you?', isStarter: true },
  { categoryId: 'relationships', text: 'How do you show love to the people you care about?', isStarter: true },
  { categoryId: 'relationships', text: 'What relationship do you wish you could repair?', isStarter: true },
  
  // Career & Work
  { categoryId: 'career', text: 'What do you find most meaningful about your work?', isStarter: true },
  { categoryId: 'career', text: 'What career path didn\'t you take that you sometimes wonder about?', isStarter: true },
  { categoryId: 'career', text: 'What\'s the best professional decision you\'ve made?', isStarter: true },
  { categoryId: 'career', text: 'How do you define success?', isStarter: true },
  
  // Memories & Stories
  { categoryId: 'memories', text: 'What\'s your earliest memory?', isStarter: true },
  { categoryId: 'memories', text: 'What moment changed everything for you?', isStarter: true },
  { categoryId: 'memories', text: 'What\'s your happiest memory?', isStarter: true },
  { categoryId: 'memories', text: 'What story do you always love to tell?', isStarter: true },
  
  // Goals & Dreams
  { categoryId: 'goals', text: 'Where do you see yourself in 5 years?', isStarter: true },
  { categoryId: 'goals', text: 'What dream have you given up on? Do you regret it?', isStarter: true },
  { categoryId: 'goals', text: 'What would you do if you knew you couldn\'t fail?', isStarter: true },
  { categoryId: 'goals', text: 'What\'s on your bucket list?', isStarter: true },
  
  // Health & Wellness
  { categoryId: 'health', text: 'What does self-care look like for you?', isStarter: true },
  { categoryId: 'health', text: 'How do you manage stress?', isStarter: true },
  { categoryId: 'health', text: 'What habit do you wish you could change?', isStarter: true },
  
  // Legacy & Impact
  { categoryId: 'legacy', text: 'How do you want to be remembered?', isStarter: true },
  { categoryId: 'legacy', text: 'What impact do you want to have on the world?', isStarter: true },
  { categoryId: 'legacy', text: 'What advice would you give to your younger self?', isStarter: true },
  { categoryId: 'legacy', text: 'What would you want your children/future generations to know about you?', isStarter: true },
];

// ============================================================
// INITIALIZATION
// ============================================================

let isInitialized = false;

function initializeQuestionsIfNeeded(): void {
  if (isInitialized) return;
  if (typeof window === 'undefined') return; // SSR guard
  
  const storage = getStorage();
  if (!storage) return;
  
  const existingCategories = storage.getString(CATEGORIES_KEY);
  
  if (!existingCategories) {
    // Initialize with default categories
    storage.set(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    
    // Initialize with starter questions
    const starterWithIds: Question[] = STARTER_QUESTIONS.map((q, index) => ({
      ...q,
      id: `starter-${index}`,
      createdAt: new Date().toISOString(),
    }));
    storage.set(QUESTIONS_KEY, JSON.stringify(starterWithIds));
    
    // Initialize empty answered list
    storage.set(ANSWERED_KEY, JSON.stringify([]));
  }
  
  isInitialized = true;
}

// ============================================================
// CATEGORY FUNCTIONS
// ============================================================

export function getCategories(): QuestionCategory[] {
  initializeQuestionsIfNeeded();
  const storage = getStorage();
  if (!storage) return DEFAULT_CATEGORIES;
  
  const data = storage.getString(CATEGORIES_KEY);
  if (!data) return DEFAULT_CATEGORIES;
  return JSON.parse(data).sort((a: QuestionCategory, b: QuestionCategory) => a.order - b.order);
}

export function getCategoryBySlug(slug: string): QuestionCategory | undefined {
  return getCategories().find(c => c.slug === slug);
}

export function createCategory(category: Omit<QuestionCategory, 'id' | 'order'>): QuestionCategory {
  const categories = getCategories();
  const newCategory: QuestionCategory = {
    ...category,
    id: `custom-${Date.now()}`,
    order: categories.length + 1,
  };
  categories.push(newCategory);
  const storage = getStorage();
  if (storage) storage.set(CATEGORIES_KEY, JSON.stringify(categories));
  return newCategory;
}

// ============================================================
// QUESTION FUNCTIONS
// ============================================================

export function getQuestions(): Question[] {
  initializeQuestionsIfNeeded();
  const storage = getStorage();
  if (!storage) return [];
  
  const data = storage.getString(QUESTIONS_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export function getQuestionsByCategory(categoryId: string): Question[] {
  return getQuestions().filter(q => q.categoryId === categoryId);
}

export function createQuestion(categoryId: string, text: string): Question {
  const questions = getQuestions();
  const newQuestion: Question = {
    id: `custom-${Date.now()}`,
    categoryId,
    text,
    isStarter: false,
    createdAt: new Date().toISOString(),
  };
  questions.push(newQuestion);
  const storage = getStorage();
  if (storage) storage.set(QUESTIONS_KEY, JSON.stringify(questions));
  return newQuestion;
}

// ============================================================
// ANSWERED QUESTIONS
// ============================================================

export function getAnsweredQuestions(): AnsweredQuestion[] {
  const storage = getStorage();
  if (!storage) return [];
  
  const data = storage.getString(ANSWERED_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export function markQuestionAnswered(
  questionId: string,
  recordingId?: string,
  journalId?: string
): void {
  const answered = getAnsweredQuestions();
  const existing = answered.find(a => a.questionId === questionId);
  
  if (existing) {
    existing.recordingId = recordingId || existing.recordingId;
    existing.journalId = journalId || existing.journalId;
    existing.answeredAt = new Date().toISOString();
  } else {
    answered.push({
      questionId,
      recordingId,
      journalId,
      answeredAt: new Date().toISOString(),
    });
  }
  
  const storage = getStorage();
  if (storage) storage.set(ANSWERED_KEY, JSON.stringify(answered));
}

export function isQuestionAnswered(questionId: string): boolean {
  return getAnsweredQuestions().some(a => a.questionId === questionId);
}

export function getAnsweredQuestionIds(): Set<string> {
  return new Set(getAnsweredQuestions().map(a => a.questionId));
}

// ============================================================
// PROGRESS CALCULATION
// ============================================================

export interface CategoryProgress {
  categoryId: string;
  total: number;
  answered: number;
  percentage: number;
}

export function getCategoryProgress(categoryId: string): CategoryProgress {
  const questions = getQuestionsByCategory(categoryId);
  const answeredIds = getAnsweredQuestionIds();
  const answered = questions.filter(q => answeredIds.has(q.id)).length;
  
  return {
    categoryId,
    total: questions.length,
    answered,
    percentage: questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0,
  };
}

export function getAllCategoryProgress(): CategoryProgress[] {
  return getCategories().map(c => getCategoryProgress(c.id));
}

export function getOverallProgress(): { total: number; answered: number; percentage: number } {
  const questions = getQuestions();
  const answeredIds = getAnsweredQuestionIds();
  const answered = questions.filter(q => answeredIds.has(q.id)).length;
  
  return {
    total: questions.length,
    answered,
    percentage: questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0,
  };
}
