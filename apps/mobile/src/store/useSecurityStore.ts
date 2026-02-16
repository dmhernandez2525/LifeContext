import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../lib/storage';

export type LockTimeout = 60 | 300 | 900 | 1800 | 3600;

interface SecurityState {
  isEnabled: boolean;
  biometricEnabled: boolean;
  recoveryEmail: string | null;
  lockTimeout: LockTimeout;
  lastActive: number | null;
  lastUnlockAt: number | null;
  failedLockUntil: number | null;
  isLocked: boolean;
  activeSessionId: string | null;
  setEnabled: (enabled: boolean) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  setRecoveryEmail: (email: string | null) => void;
  setLockTimeout: (timeout: LockTimeout) => void;
  setLastActive: (timestamp: number | null) => void;
  setLastUnlockAt: (timestamp: number | null) => void;
  setFailedLockUntil: (timestamp: number | null) => void;
  setIsLocked: (locked: boolean) => void;
  setActiveSessionId: (sessionId: string | null) => void;
  lockNow: () => void;
  reset: () => void;
}

const initialState = {
  isEnabled: false,
  biometricEnabled: true,
  recoveryEmail: null,
  lockTimeout: 300 as LockTimeout,
  lastActive: null,
  lastUnlockAt: null,
  failedLockUntil: null,
  isLocked: false,
  activeSessionId: null,
};

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set) => ({
      ...initialState,
      setEnabled: (enabled) => set({ isEnabled: enabled }),
      setBiometricEnabled: (enabled) => set({ biometricEnabled: enabled }),
      setRecoveryEmail: (email) => set({ recoveryEmail: email }),
      setLockTimeout: (timeout) => set({ lockTimeout: timeout }),
      setLastActive: (timestamp) => set({ lastActive: timestamp }),
      setLastUnlockAt: (timestamp) => set({ lastUnlockAt: timestamp }),
      setFailedLockUntil: (timestamp) => set({ failedLockUntil: timestamp }),
      setIsLocked: (locked) => set({ isLocked: locked }),
      setActiveSessionId: (sessionId) => set({ activeSessionId: sessionId }),
      lockNow: () => set({ isLocked: true, lastActive: Date.now() }),
      reset: () => set(initialState),
    }),
    {
      name: 'security-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => storage.getString(name) || null,
        setItem: (name, value) => storage.set(name, value),
        removeItem: (name) => storage.delete(name),
      })),
      partialize: (state) => ({
        isEnabled: state.isEnabled,
        biometricEnabled: state.biometricEnabled,
        recoveryEmail: state.recoveryEmail,
        lockTimeout: state.lockTimeout,
        lastActive: state.lastActive,
        lastUnlockAt: state.lastUnlockAt,
        activeSessionId: state.activeSessionId,
      }),
    }
  )
);
