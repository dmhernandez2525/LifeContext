import { storage } from '../lib/storage';
import type { AuthActivityLog, AuthRateLimitState, AuthSession } from './authTypes';

const SESSIONS_KEY = 'lcc-auth-sessions';
const ACTIVITY_KEY = 'lcc-auth-activity';
const RATE_LIMIT_KEY = 'lcc-auth-rate-limit';

const INITIAL_RATE_STATE: AuthRateLimitState = {
  failedAttempts: 0,
  lockedUntil: null,
};

const parseList = <T>(raw: string | undefined): T[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseRate = (raw: string | undefined): AuthRateLimitState => {
  if (!raw) {
    return INITIAL_RATE_STATE;
  }

  try {
    const parsed = JSON.parse(raw) as AuthRateLimitState;
    if (typeof parsed.failedAttempts !== 'number') {
      return INITIAL_RATE_STATE;
    }
    return parsed;
  } catch {
    return INITIAL_RATE_STATE;
  }
};

export const getAuthSessions = (): AuthSession[] => {
  return parseList<AuthSession>(storage.getString(SESSIONS_KEY));
};

export const setAuthSessions = (sessions: AuthSession[]): void => {
  storage.set(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 25)));
};

export const getAuthActivity = (): AuthActivityLog[] => {
  return parseList<AuthActivityLog>(storage.getString(ACTIVITY_KEY));
};

export const appendAuthActivity = (entry: AuthActivityLog): void => {
  const current = getAuthActivity();
  storage.set(ACTIVITY_KEY, JSON.stringify([entry, ...current].slice(0, 200)));
};

export const getRateLimitState = (): AuthRateLimitState => {
  return parseRate(storage.getString(RATE_LIMIT_KEY));
};

export const setRateLimitState = (value: AuthRateLimitState): void => {
  storage.set(RATE_LIMIT_KEY, JSON.stringify(value));
};
