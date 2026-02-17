import type { HelpFeedbackValue } from './helpUxTypes';

interface HelpFeedbackRecord {
  id: string;
  query: string;
  appSection: string;
  value: HelpFeedbackValue;
  createdAt: number;
}

interface NpsRecord {
  score: number;
  createdAt: number;
}

const MINIMIZED_KEY = 'lcc-help-pill-minimized';
const UNREAD_KEY = 'lcc-help-pill-unread';
const TOOLTIP_SEEN_KEY = 'lcc-help-onboarding-tooltip-seen';
const FEEDBACK_KEY = 'lcc-help-feedback';
const INTERACTION_COUNT_KEY = 'lcc-help-interaction-count';
const LAST_NPS_PROMPT_KEY = 'lcc-help-last-nps-prompt-at';
const NPS_SCORES_KEY = 'lcc-help-nps-scores';
const NPS_INTERVAL = 5;

const parseJson = <T>(raw: string | null, fallback: T): T => {
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const readNumber = (key: string, fallback = 0): number => {
  const value = Number(localStorage.getItem(key));
  return Number.isFinite(value) ? value : fallback;
};

const writeNumber = (key: string, value: number): void => {
  localStorage.setItem(key, String(value));
};

export const getHelpMinimized = (): boolean => {
  return localStorage.getItem(MINIMIZED_KEY) === 'true';
};

export const setHelpMinimized = (value: boolean): void => {
  localStorage.setItem(MINIMIZED_KEY, value ? 'true' : 'false');
};

export const getHelpUnreadCount = (): number => {
  return readNumber(UNREAD_KEY, 0);
};

export const setHelpUnreadCount = (count: number): void => {
  writeNumber(UNREAD_KEY, Math.max(0, count));
};

export const getHelpTooltipSeen = (): boolean => {
  return localStorage.getItem(TOOLTIP_SEEN_KEY) === 'true';
};

export const setHelpTooltipSeen = (): void => {
  localStorage.setItem(TOOLTIP_SEEN_KEY, 'true');
};

const createId = (): string => {
  if ('crypto' in window && 'randomUUID' in window.crypto) {
    return window.crypto.randomUUID();
  }

  return `help-feedback-${Date.now()}`;
};

export const saveHelpFeedback = (input: Omit<HelpFeedbackRecord, 'id' | 'createdAt'>): void => {
  const feedback = parseJson<HelpFeedbackRecord[]>(localStorage.getItem(FEEDBACK_KEY), []);
  const nextRecord: HelpFeedbackRecord = {
    ...input,
    id: createId(),
    createdAt: Date.now(),
  };

  localStorage.setItem(FEEDBACK_KEY, JSON.stringify([nextRecord, ...feedback].slice(0, 200)));
};

export const incrementHelpInteractionCount = (): { count: number; shouldPromptForNps: boolean } => {
  const count = readNumber(INTERACTION_COUNT_KEY, 0) + 1;
  writeNumber(INTERACTION_COUNT_KEY, count);

  const lastPromptAt = readNumber(LAST_NPS_PROMPT_KEY, 0);
  const shouldPromptForNps = count >= NPS_INTERVAL && count - lastPromptAt >= NPS_INTERVAL;

  return { count, shouldPromptForNps };
};

export const markNpsPromptShown = (interactionCount: number): void => {
  writeNumber(LAST_NPS_PROMPT_KEY, interactionCount);
};

export const saveNpsScore = (score: number): void => {
  const scores = parseJson<NpsRecord[]>(localStorage.getItem(NPS_SCORES_KEY), []);
  const nextRecord: NpsRecord = { score, createdAt: Date.now() };
  localStorage.setItem(NPS_SCORES_KEY, JSON.stringify([nextRecord, ...scores].slice(0, 100)));
};
