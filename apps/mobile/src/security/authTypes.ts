export interface AuthCredential {
  version: 1;
  salt: string;
  passcodeHash: string;
  createdAt: number;
  updatedAt: number;
  recoveryEmail: string | null;
  recoveryBackupHash: string | null;
}

export interface AuthSession {
  id: string;
  token: string;
  deviceId: string;
  deviceLabel: string;
  createdAt: number;
  lastActiveAt: number;
  revokedAt: number | null;
}

export type AuthActivityType =
  | 'login_success'
  | 'login_failed'
  | 'biometric_success'
  | 'biometric_failed'
  | 'session_revoked'
  | 'recovery_reset';

export interface AuthActivityLog {
  id: string;
  type: AuthActivityType;
  createdAt: number;
  deviceLabel: string;
  details: string;
}

export interface AuthRateLimitState {
  failedAttempts: number;
  lockedUntil: number | null;
}

export interface AuthVerifyResult {
  success: boolean;
  remainingLockMs: number;
}
