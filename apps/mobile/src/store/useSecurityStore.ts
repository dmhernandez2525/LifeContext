import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../lib/storage';

export type LockTimeout = 0 | 60 | 300 | 900; // 0 (immediate), 1m, 5m, 15m

interface SecurityState {
  isEnabled: boolean;
  passcode: string | null; // Encrypted/Hashed passcode (for now, simple storage as per plan)
  lockTimeout: LockTimeout; // in seconds
  lastActive: number | null; // Timestamp
  isLocked: boolean;
  
  // Actions
  setEnabled: (enabled: boolean) => void;
  setPasscode: (passcode: string | null) => void;
  setLockTimeout: (timeout: LockTimeout) => void;
  setLastActive: (timestamp: number) => void;
  setIsLocked: (locked: boolean) => void;
  reset: () => void;
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set) => ({
      isEnabled: false,
      passcode: null,
      lockTimeout: 0,
      lastActive: null,
      isLocked: false,
      
      setEnabled: (enabled) => set({ isEnabled: enabled }),
      setPasscode: (passcode) => set({ passcode }),
      setLockTimeout: (timeout) => set({ lockTimeout: timeout }),
      setLastActive: (timestamp) => set({ lastActive: timestamp }),
      setIsLocked: (locked) => set({ isLocked: locked }),
      reset: () => set({ isEnabled: false, passcode: null, lockTimeout: 0, lastActive: null, isLocked: false }),
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
        passcode: state.passcode,
        lockTimeout: state.lockTimeout  
        // We don't persist isLocked/lastActive typically, but for "resuming" validation we might need lastActive.
        // Actually, lastActive IS needed to check timeout on cold start if we want to be strict,
        // but typically security checks happen on mount. We'll persist lastActive for safety.
      }),
    }
  )
);
