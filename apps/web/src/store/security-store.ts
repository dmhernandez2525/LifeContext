/**
 * Security store for WebAuthn credentials and advanced security settings.
 * Persists in localStorage alongside the existing lcc-security data.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StoredCredential } from '@/lib/webauthn';

interface SecurityState {
  // WebAuthn
  webauthnCredentials: StoredCredential[];
  webauthnEnabled: boolean;
  passkeyAsDefault: boolean;

  // Duress (F9.2)
  duressEnabled: boolean;
  duressHash: string | null;

  // Key rotation (F9.3)
  lastKeyRotation: number | null;
  keyRotationReminder: number; // days

  // Dead man's switch (F9.4)
  deadManEnabled: boolean;
  deadManDays: number;
  deadManAction: 'wipe' | 'notify' | 'export';
  deadManContacts: string[];
  lastActivity: number;

  // WebAuthn actions
  addCredential: (credential: StoredCredential) => void;
  removeCredential: (id: string) => void;
  updateCredentialLastUsed: (id: string) => void;
  setWebauthnEnabled: (enabled: boolean) => void;
  setPasskeyAsDefault: (enabled: boolean) => void;

  // Duress actions
  setDuressEnabled: (enabled: boolean) => void;
  setDuressHash: (hash: string | null) => void;

  // Key rotation actions
  setLastKeyRotation: (timestamp: number) => void;
  setKeyRotationReminder: (days: number) => void;

  // Dead man's switch actions
  setDeadManEnabled: (enabled: boolean) => void;
  setDeadManDays: (days: number) => void;
  setDeadManAction: (action: 'wipe' | 'notify' | 'export') => void;
  setDeadManContacts: (contacts: string[]) => void;
  recordActivity: () => void;
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set) => ({
      webauthnCredentials: [],
      webauthnEnabled: false,
      passkeyAsDefault: false,

      duressEnabled: false,
      duressHash: null,

      lastKeyRotation: null,
      keyRotationReminder: 90,

      deadManEnabled: false,
      deadManDays: 90,
      deadManAction: 'notify',
      deadManContacts: [],
      lastActivity: Date.now(),

      addCredential: (credential) =>
        set((state) => ({
          webauthnCredentials: [...state.webauthnCredentials, credential],
          webauthnEnabled: true,
        })),

      removeCredential: (id) =>
        set((state) => {
          const filtered = state.webauthnCredentials.filter(c => c.id !== id);
          return {
            webauthnCredentials: filtered,
            webauthnEnabled: filtered.length > 0,
          };
        }),

      updateCredentialLastUsed: (id) =>
        set((state) => ({
          webauthnCredentials: state.webauthnCredentials.map(c =>
            c.id === id ? { ...c, lastUsed: Date.now() } : c
          ),
        })),

      setWebauthnEnabled: (enabled) => set({ webauthnEnabled: enabled }),
      setPasskeyAsDefault: (enabled) => set({ passkeyAsDefault: enabled }),

      setDuressEnabled: (enabled) => set({ duressEnabled: enabled }),
      setDuressHash: (hash) => set({ duressHash: hash }),

      setLastKeyRotation: (timestamp) => set({ lastKeyRotation: timestamp }),
      setKeyRotationReminder: (days) => set({ keyRotationReminder: days }),

      setDeadManEnabled: (enabled) => set({ deadManEnabled: enabled }),
      setDeadManDays: (days) => set({ deadManDays: days }),
      setDeadManAction: (action) => set({ deadManAction: action }),
      setDeadManContacts: (contacts) => set({ deadManContacts: contacts }),
      recordActivity: () => set({ lastActivity: Date.now() }),
    }),
    { name: 'lcc-security-advanced' }
  )
);
