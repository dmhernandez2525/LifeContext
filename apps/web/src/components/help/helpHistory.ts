import type { HelpHistoryItem } from './helpTypes';

const HISTORY_KEY = 'lcc-help-history';
const MAX_HISTORY_ITEMS = 30;

const parseHistory = (raw: string | null): HelpHistoryItem[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as HelpHistoryItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => {
      return Boolean(item.id && item.query && item.response && item.appSection);
    });
  } catch {
    return [];
  }
};

const createId = (): string => {
  if ('crypto' in window && 'randomUUID' in window.crypto) {
    return window.crypto.randomUUID();
  }

  return `help-${Date.now()}`;
};

export const getHelpHistory = (): HelpHistoryItem[] => {
  return parseHistory(localStorage.getItem(HISTORY_KEY));
};

export const saveHelpHistoryItem = (item: Omit<HelpHistoryItem, 'id' | 'createdAt'>): HelpHistoryItem => {
  const history = getHelpHistory();

  const nextItem: HelpHistoryItem = {
    ...item,
    id: createId(),
    createdAt: Date.now(),
  };

  const nextHistory = [nextItem, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));

  return nextItem;
};

export const clearHelpHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};
