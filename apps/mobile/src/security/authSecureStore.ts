import * as SecureStore from 'expo-secure-store';
import type { AuthCredential } from './authTypes';

const CREDENTIAL_KEY = 'lcc-auth-credential';
const ACTIVE_TOKEN_KEY = 'lcc-auth-active-token';

const SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const parseCredential = (raw: string | null): AuthCredential | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthCredential;
    if (!parsed?.salt || !parsed?.passcodeHash) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const getStoredCredential = async (): Promise<AuthCredential | null> => {
  const raw = await SecureStore.getItemAsync(CREDENTIAL_KEY, SECURE_OPTIONS);
  return parseCredential(raw);
};

export const setStoredCredential = async (credential: AuthCredential): Promise<void> => {
  await SecureStore.setItemAsync(CREDENTIAL_KEY, JSON.stringify(credential), SECURE_OPTIONS);
};

export const clearStoredCredential = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(CREDENTIAL_KEY, SECURE_OPTIONS);
};

export const getActiveSessionToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(ACTIVE_TOKEN_KEY, SECURE_OPTIONS);
};

export const setActiveSessionToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(ACTIVE_TOKEN_KEY, token, SECURE_OPTIONS);
};

export const clearActiveSessionToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(ACTIVE_TOKEN_KEY, SECURE_OPTIONS);
};
