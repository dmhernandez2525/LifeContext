/**
 * Guided reflection prompt engine.
 * Generates contextual reflection questions based on recent life data.
 */

export type ReflectionCategory = 'gratitude' | 'growth' | 'relationships' | 'health' | 'goals' | 'emotions';

export interface ReflectionPrompt {
  id: string;
  category: ReflectionCategory;
  question: string;
  followUp?: string;
  context?: string;
}

export interface ReflectionSession {
  id: string;
  date: string;
  prompts: ReflectionPrompt[];
  responses: Record<string, string>;
  completedAt: number | null;
  startedAt: number;
}

const CATEGORY_CONFIG: Record<ReflectionCategory, { label: string; icon: string; color: string }> = {
  gratitude: { label: 'Gratitude', icon: '🙏', color: 'text-amber-600' },
  growth: { label: 'Growth', icon: '🌱', color: 'text-green-600' },
  relationships: { label: 'Relationships', icon: '💝', color: 'text-pink-600' },
  health: { label: 'Health', icon: '💪', color: 'text-blue-600' },
  goals: { label: 'Goals', icon: '🎯', color: 'text-purple-600' },
  emotions: { label: 'Emotions', icon: '🧘', color: 'text-indigo-600' },
};

export { CATEGORY_CONFIG };

const PROMPTS: Record<ReflectionCategory, string[]> = {
  gratitude: [
    'What are three things you\'re grateful for today?',
    'Who made a positive impact on your life recently?',
    'What small moment brought you unexpected joy this week?',
    'What\'s something you often take for granted that you appreciate?',
    'What challenge are you grateful to have faced?',
  ],
  growth: [
    'What did you learn about yourself this week?',
    'What\'s one thing you did differently than you would have a year ago?',
    'Where did you step outside your comfort zone recently?',
    'What mistake taught you something valuable?',
    'How have your priorities shifted in the past few months?',
  ],
  relationships: [
    'Who do you want to connect with more deeply?',
    'What conversation had the biggest impact on you recently?',
    'How did you show up for someone you care about this week?',
    'Is there a relationship you\'d like to invest more energy in?',
    'What quality do you most appreciate in the people closest to you?',
  ],
  health: [
    'How does your body feel right now? What does it need?',
    'What habit is currently serving your well-being the most?',
    'When did you feel most energized this week?',
    'What\'s one small change that could improve your daily energy?',
    'How are you balancing rest and activity?',
  ],
  goals: [
    'What progress did you make toward your goals this week?',
    'What\'s the next small step you can take toward something important?',
    'Is there a goal that no longer serves you? Is it time to let it go?',
    'What would make this week feel successful?',
    'What are you most excited about working toward right now?',
  ],
  emotions: [
    'What emotion has been most present for you lately?',
    'When did you feel most at peace this week?',
    'What triggered stress for you recently, and how did you respond?',
    'What would you say to a friend feeling the way you feel right now?',
    'What brings you a sense of calm when things feel overwhelming?',
  ],
};

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Generate a reflection session with prompts from selected categories.
 */
export function generateReflectionSession(
  categories?: ReflectionCategory[],
  promptsPerCategory?: number
): ReflectionSession {
  const selectedCategories = categories ?? pickRandom(Object.keys(PROMPTS) as ReflectionCategory[], 3);
  const count = promptsPerCategory ?? 1;

  const prompts: ReflectionPrompt[] = selectedCategories.flatMap(category => {
    const questions = pickRandom(PROMPTS[category], count);
    return questions.map(question => ({
      id: crypto.randomUUID(),
      category,
      question,
    }));
  });

  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0, 10),
    prompts,
    responses: {},
    completedAt: null,
    startedAt: Date.now(),
  };
}

/**
 * Check if all prompts in a session have responses.
 */
export function isSessionComplete(session: ReflectionSession): boolean {
  return session.prompts.every(p => (session.responses[p.id] ?? '').trim().length > 0);
}

/**
 * Get the completion percentage of a session.
 */
export function getSessionProgress(session: ReflectionSession): number {
  if (session.prompts.length === 0) return 100;
  const answered = session.prompts.filter(p => (session.responses[p.id] ?? '').trim().length > 0).length;
  return Math.round((answered / session.prompts.length) * 100);
}

export const REFLECTION_CATEGORIES: ReflectionCategory[] = ['gratitude', 'growth', 'relationships', 'health', 'goals', 'emotions'];
