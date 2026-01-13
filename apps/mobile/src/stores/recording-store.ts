/**
 * Recording Store - Simple state management without zustand
 * 
 * Uses platform-aware storage with web fallback
 * Avoids zustand to prevent import.meta issues on web
 */
import { Platform } from 'react-native';

// ============================================================
// PLATFORM-AWARE STORAGE
// ============================================================

interface SimpleStorage {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
}

const webStorage: SimpleStorage = {
  getString: (key: string) => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key) || undefined;
    }
    return undefined;
  },
  set: (key: string, value: string) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  delete: (key: string) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};

let _storage: SimpleStorage | null = null;

function getStorageInstance(): SimpleStorage {
  if (_storage) return _storage;
  
  if (Platform.OS === 'web') {
    _storage = webStorage;
    return _storage;
  }
  
  try {
    const { MMKV } = require('react-native-mmkv');
    _storage = new MMKV();
  } catch (e) {
    _storage = webStorage;
  }
  
  return _storage as SimpleStorage;
}

export const storage: SimpleStorage = {
  getString: (key: string) => getStorageInstance().getString(key),
  set: (key: string, value: string) => getStorageInstance().set(key, value),
  delete: (key: string) => getStorageInstance().delete(key),
};

// ============================================================
// TYPES
// ============================================================

export interface Recording {
  id: string;
  uri: string;
  duration: number;
  createdAt: number;
  title: string;
  transcription?: string;
  syncStatus: 'pending' | 'synced' | 'failed';
  tags: string[];
}

// ============================================================
// SIMPLE STORE (no zustand)
// ============================================================

const STORAGE_KEY = 'recording-storage';

let recordings: Recording[] = [];
let listeners: Set<() => void> = new Set();
let hydrated = false;

function notifyListeners() {
  listeners.forEach(listener => listener());
}

function persist() {
  try {
    storage.set(STORAGE_KEY, JSON.stringify({ state: { recordings } }));
  } catch (e) {
    console.error('Failed to persist recordings:', e);
  }
}

function hydrate() {
  if (hydrated) return;
  if (typeof window === 'undefined') return;
  
  try {
    const data = storage.getString(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed?.state?.recordings) {
        recordings = parsed.state.recordings;
      }
    }
    hydrated = true;
  } catch (e) {
    console.error('Failed to hydrate recordings:', e);
  }
}

// Store actions
export const recordingStore = {
  getState: () => {
    hydrate();
    return { recordings };
  },
  
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  
  addRecording: (recording: Recording) => {
    hydrate();
    recordings = [recording, ...recordings];
    persist();
    notifyListeners();
  },
  
  deleteRecording: (id: string) => {
    hydrate();
    recordings = recordings.filter(r => r.id !== id);
    persist();
    notifyListeners();
  },
  
  updateTranscription: (id: string, text: string) => {
    hydrate();
    recordings = recordings.map(r => 
      r.id === id ? { ...r, transcription: text } : r
    );
    persist();
    notifyListeners();
  },
  
  syncRecordings: async () => {
    hydrate();
    const pending = recordings.filter(r => r.syncStatus === 'pending');
    
    if (pending.length === 0) return;

    console.log(`Syncing ${pending.length} recordings...`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    recordings = recordings.map(r => 
      r.syncStatus === 'pending' ? { ...r, syncStatus: 'synced' as const } : r
    );
    persist();
    notifyListeners();
  },
};

// React hook
import { useSyncExternalStore, useCallback } from 'react';

export function useRecordingStore<T>(selector: (state: { recordings: Recording[] }) => T): T {
  const getSnapshot = useCallback(() => {
    return selector(recordingStore.getState());
  }, [selector]);
  
  return useSyncExternalStore(
    recordingStore.subscribe,
    getSnapshot,
    getSnapshot // Server snapshot (same for SSR)
  );
}

// Convenience exports for common selectors
export const selectRecordings = (state: { recordings: Recording[] }) => state.recordings;
export const selectAddRecording = () => recordingStore.addRecording;
export const selectDeleteRecording = () => recordingStore.deleteRecording;
