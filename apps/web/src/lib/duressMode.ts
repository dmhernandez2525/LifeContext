/**
 * Duress mode utilities.
 * When a duress password is entered, the app shows benign decoy data
 * instead of real encrypted content, protecting user privacy under coercion.
 */

const DURESS_ACTIVE_KEY = 'lcc-duress-active';

/** Check if duress mode is currently active. */
export function isDuressActive(): boolean {
  return sessionStorage.getItem(DURESS_ACTIVE_KEY) === 'true';
}

/** Activate duress mode for this session. */
export function activateDuress(): void {
  sessionStorage.setItem(DURESS_ACTIVE_KEY, 'true');
}

/** Deactivate duress mode. */
export function deactivateDuress(): void {
  sessionStorage.removeItem(DURESS_ACTIVE_KEY);
}

/** Decoy journal entries shown in duress mode. */
export const DECOY_JOURNAL_ENTRIES = [
  {
    id: 'decoy-1',
    title: 'Grocery list for the week',
    content: 'Need to pick up eggs, milk, bread, and some fruit. Maybe try that new recipe for pasta.',
    date: new Date(Date.now() - 86400000).toISOString(),
    mood: 'neutral' as const,
  },
  {
    id: 'decoy-2',
    title: 'Weekend plans',
    content: 'Thinking about going to the park if the weather is nice. Should also do some laundry.',
    date: new Date(Date.now() - 172800000).toISOString(),
    mood: 'good' as const,
  },
  {
    id: 'decoy-3',
    title: 'Book recommendations',
    content: 'Sarah recommended "The Midnight Library" and "Project Hail Mary". Added to my reading list.',
    date: new Date(Date.now() - 345600000).toISOString(),
    mood: 'good' as const,
  },
];

/** Decoy dashboard stats for duress mode. */
export const DECOY_STATS = {
  totalEntries: 3,
  currentStreak: 1,
  longestStreak: 4,
  totalWords: 187,
  answeredQuestions: 5,
  brainDumps: 1,
};

/** Decoy brain dump entries. */
export const DECOY_BRAIN_DUMPS = [
  {
    id: 'decoy-bd-1',
    content: 'Need to remember to call the dentist for my annual checkup. Also should look into renewing my library card.',
    date: new Date(Date.now() - 259200000).toISOString(),
  },
];
