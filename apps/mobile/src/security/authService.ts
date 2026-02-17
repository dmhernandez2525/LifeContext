import * as LocalAuthentication from 'expo-local-authentication';
import { generateId } from '../lib/encryption';
import { appendAuthActivity, getAuthActivity, getAuthSessions, getRateLimitState, setAuthSessions, setRateLimitState } from './authLocalStore';
import { generateAuthToken, generateSalt, hashWithSalt } from './authCrypto';
import { getDeviceId, getDeviceLabel } from './authDevice';
import { clearActiveSessionToken, getActiveSessionToken, getStoredCredential, setActiveSessionToken, setStoredCredential } from './authSecureStore';
import type { AuthActivityLog, AuthSession, AuthVerifyResult } from './authTypes';

const MAX_BACKOFF_MS = 5 * 60 * 1000;
const BASE_BACKOFF_MS = 4_000;

const createActivity = (type: AuthActivityLog['type'], details: string): AuthActivityLog => {
  return {
    id: generateId(),
    type,
    createdAt: Date.now(),
    deviceLabel: getDeviceLabel(),
    details,
  };
};

const getBackoffMs = (failedAttempts: number): number => {
  if (failedAttempts <= 1) {
    return 0;
  }

  return Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** (failedAttempts - 2));
};

const ensureCurrentSession = async (): Promise<AuthSession> => {
  const currentToken = await getActiveSessionToken();
  const sessions = getAuthSessions();
  const now = Date.now();

  if (currentToken) {
    const existing = sessions.find((session) => session.token === currentToken && !session.revokedAt);
    if (existing) {
      const updated = sessions.map((session) => {
        if (session.id !== existing.id) {
          return session;
        }
        return { ...session, lastActiveAt: now };
      });
      setAuthSessions(updated);
      return { ...existing, lastActiveAt: now };
    }
  }

  const nextSession: AuthSession = {
    id: generateId(),
    token: generateAuthToken(),
    deviceId: getDeviceId(),
    deviceLabel: getDeviceLabel(),
    createdAt: now,
    lastActiveAt: now,
    revokedAt: null,
  };

  setAuthSessions([nextSession, ...sessions.filter((session) => !session.revokedAt)]);
  await setActiveSessionToken(nextSession.token);
  return nextSession;
};

export const getLockoutRemainingMs = (): number => {
  const state = getRateLimitState();
  if (!state.lockedUntil) {
    return 0;
  }

  return Math.max(0, state.lockedUntil - Date.now());
};

export const hasConfiguredCredential = async (): Promise<boolean> => {
  const credential = await getStoredCredential();
  return Boolean(credential?.passcodeHash && credential.salt);
};

export const registerCredential = async (passcode: string, recoveryEmail: string | null): Promise<{ backupCode: string }> => {
  const trimmedPasscode = passcode.trim();
  const normalizedEmail = recoveryEmail?.trim().toLowerCase() || null;

  const salt = await generateSalt();
  const passcodeHash = await hashWithSalt(trimmedPasscode, salt);
  const backupCode = generateAuthToken().replace(/-/g, '').slice(0, 16).toUpperCase();
  const recoveryBackupHash = await hashWithSalt(backupCode, salt);
  const now = Date.now();

  await setStoredCredential({
    version: 1,
    salt,
    passcodeHash,
    createdAt: now,
    updatedAt: now,
    recoveryEmail: normalizedEmail,
    recoveryBackupHash,
  });

  setRateLimitState({ failedAttempts: 0, lockedUntil: null });
  await ensureCurrentSession();
  appendAuthActivity(createActivity('login_success', 'Credential setup complete'));
  return { backupCode };
};

export const verifyPasscode = async (passcode: string): Promise<AuthVerifyResult> => {
  const remainingLockMs = getLockoutRemainingMs();
  if (remainingLockMs > 0) {
    return { success: false, remainingLockMs };
  }

  const credential = await getStoredCredential();
  if (!credential) {
    return { success: false, remainingLockMs: 0 };
  }

  const hash = await hashWithSalt(passcode.trim(), credential.salt);
  if (hash === credential.passcodeHash) {
    setRateLimitState({ failedAttempts: 0, lockedUntil: null });
    await ensureCurrentSession();
    appendAuthActivity(createActivity('login_success', 'Passcode unlock'));
    return { success: true, remainingLockMs: 0 };
  }

  const state = getRateLimitState();
  const failedAttempts = state.failedAttempts + 1;
  const backoffMs = getBackoffMs(failedAttempts);
  const lockedUntil = backoffMs > 0 ? Date.now() + backoffMs : null;
  setRateLimitState({ failedAttempts, lockedUntil });
  appendAuthActivity(createActivity('login_failed', `Failed passcode attempt #${failedAttempts}`));

  return {
    success: false,
    remainingLockMs: backoffMs,
  };
};

export const authenticateBiometric = async (): Promise<boolean> => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock LifeContext',
    fallbackLabel: 'Use Passcode',
    disableDeviceFallback: false,
    cancelLabel: 'Cancel',
  });

  if (result.success) {
    await ensureCurrentSession();
    appendAuthActivity(createActivity('biometric_success', 'Biometric unlock'));
    return true;
  }

  appendAuthActivity(createActivity('biometric_failed', `Biometric unlock failed: ${result.error ?? 'cancelled'}`));
  return false;
};

export const recoverPasscode = async (email: string, backupCode: string, nextPasscode: string): Promise<boolean> => {
  const credential = await getStoredCredential();
  if (!credential || !credential.recoveryEmail || !credential.recoveryBackupHash) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== credential.recoveryEmail) {
    return false;
  }

  const backupHash = await hashWithSalt(backupCode.trim().toUpperCase(), credential.salt);
  if (backupHash !== credential.recoveryBackupHash) {
    return false;
  }

  const passcodeHash = await hashWithSalt(nextPasscode.trim(), credential.salt);
  await setStoredCredential({
    ...credential,
    passcodeHash,
    updatedAt: Date.now(),
  });

  setRateLimitState({ failedAttempts: 0, lockedUntil: null });
  appendAuthActivity(createActivity('recovery_reset', 'Passcode recovered with backup code'));
  return true;
};

export const listSessions = async (): Promise<{ sessions: AuthSession[]; activeSessionId: string | null }> => {
  const sessions = getAuthSessions().filter((session) => !session.revokedAt);
  const activeToken = await getActiveSessionToken();
  const activeSession = sessions.find((session) => session.token === activeToken);
  return {
    sessions,
    activeSessionId: activeSession?.id ?? null,
  };
};

export const revokeSession = async (sessionId: string): Promise<void> => {
  const activeToken = await getActiveSessionToken();
  const sessions = getAuthSessions();

  const nextSessions = sessions.map((session) => {
    if (session.id !== sessionId) {
      return session;
    }
    return { ...session, revokedAt: Date.now() };
  });

  const revoked = nextSessions.find((session) => session.id === sessionId);
  if (revoked && revoked.token === activeToken) {
    await clearActiveSessionToken();
  }

  setAuthSessions(nextSessions);
  appendAuthActivity(createActivity('session_revoked', `Revoked session ${sessionId}`));
};

export const getSessionActivityLog = (): AuthActivityLog[] => {
  return getAuthActivity();
};
