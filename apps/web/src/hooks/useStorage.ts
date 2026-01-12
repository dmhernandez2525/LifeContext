/**
 * useStorage - React hooks for IndexedDB storage operations
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  getSettings, 
  saveSettings, 
  isInitialized as checkDbInitialized,
  getRecordings,
  saveRecording,
  getPatterns,
  savePattern,
  exportData,
  importData,
  type StoredSettings,
  type StoredRecording,
  type StoredPattern,
  type ExportedData,
} from '@lcc/storage';
import { 
  deriveKey, 
  createEncryptionMeta, 
  hashPasscode,
  encryptObject,
} from '@lcc/encryption';
import type { UserSettings } from '@lcc/types';

// ============================================================
// INITIALIZATION HOOK
// ============================================================

export function useStorageInit() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkInit = async () => {
      try {
        const initialized = await checkDbInitialized();
        setIsReady(initialized);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to check DB'));
      } finally {
        setIsLoading(false);
      }
    };
    checkInit();
  }, []);

  const initialize = useCallback(async (passcode: string, settings: UserSettings) => {
    try {
      setIsLoading(true);
      
      // Create encryption metadata
      const encryptionMeta = createEncryptionMeta();
      
      // Derive key and hash passcode
      const key = await deriveKey(passcode, encryptionMeta.salt);
      const hash = await hashPasscode(passcode, encryptionMeta.salt);
      
      // Encrypt settings
      const encryptedSettings = await encryptObject(settings, key);
      
      // Save to DB
      const storedSettings: StoredSettings = {
        id: 'main',
        encryptionMeta,
        passcodeHash: hash,
        settings: encryptedSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await saveSettings(storedSettings);
      setIsReady(true);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isReady, isLoading, error, initialize };
}

// ============================================================
// UNLOCK HOOK
// ============================================================

export function useUnlock() {
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlock = useCallback(async (passcode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const settings = await getSettings();
      if (!settings) {
        throw new Error('No settings found');
      }
      
      // Verify passcode hash
      const hash = await hashPasscode(passcode, settings.encryptionMeta.salt);
      if (hash !== settings.passcodeHash) {
        setError('Incorrect passcode');
        return false;
      }
      
      // Derive encryption key
      const key = await deriveKey(passcode, settings.encryptionMeta.salt);
      setEncryptionKey(key);
      setIsUnlocked(true);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const lock = useCallback(() => {
    setEncryptionKey(null);
    setIsUnlocked(false);
  }, []);

  return { encryptionKey, isUnlocked, isLoading, error, unlock, lock };
}

// ============================================================
// RECORDINGS HOOK
// ============================================================

export function useRecordings(encryptionKey: CryptoKey | null) {
  const [recordings, setRecordings] = useState<StoredRecording[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadRecordings = useCallback(async () => {
    if (!encryptionKey) return;
    setIsLoading(true);
    try {
      const data = await getRecordings();
      setRecordings(data);
    } finally {
      setIsLoading(false);
    }
  }, [encryptionKey]);

  useEffect(() => {
    if (encryptionKey) {
      loadRecordings();
    }
  }, [encryptionKey, loadRecordings]);

  const addRecording = useCallback(async (recording: Omit<StoredRecording, 'id' | 'createdAt'>) => {
    if (!encryptionKey) return null;
    
    const newRecording: StoredRecording = {
      ...recording,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    await saveRecording(newRecording);
    setRecordings(prev => [...prev, newRecording]);
    return newRecording;
  }, [encryptionKey]);

  return { recordings, isLoading, loadRecordings, addRecording };
}

// ============================================================
// PATTERNS HOOK
// ============================================================

export function usePatterns(encryptionKey: CryptoKey | null) {
  const [patterns, setPatterns] = useState<StoredPattern[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadPatterns = useCallback(async () => {
    if (!encryptionKey) return;
    setIsLoading(true);
    try {
      const data = await getPatterns();
      setPatterns(data);
    } finally {
      setIsLoading(false);
    }
  }, [encryptionKey]);

  useEffect(() => {
    if (encryptionKey) {
      loadPatterns();
    }
  }, [encryptionKey, loadPatterns]);

  const addPattern = useCallback(async (pattern: Omit<StoredPattern, 'id' | 'createdAt'>) => {
    if (!encryptionKey) return null;
    
    const newPattern: StoredPattern = {
      ...pattern,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    await savePattern(newPattern);
    setPatterns(prev => [...prev, newPattern]);
    return newPattern;
  }, [encryptionKey]);

  const addPatterns = useCallback(async (patternList: Array<Omit<StoredPattern, 'id' | 'createdAt'>>) => {
    if (!encryptionKey) return [];
    
    const newPatterns: StoredPattern[] = patternList.map(p => ({
      ...p,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }));
    
    for (const pattern of newPatterns) {
      await savePattern(pattern);
    }
    
    setPatterns(prev => [...prev, ...newPatterns]);
    return newPatterns;
  }, [encryptionKey]);

  return { patterns, isLoading, loadPatterns, addPattern, addPatterns };
}

// ============================================================
// EXPORT/IMPORT HOOK
// ============================================================

export function useDataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadExport = useCallback(async () => {
    try {
      setIsExporting(true);
      setError(null);
      
      const data = await exportData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `life-context-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
      return false;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const uploadImport = useCallback(async (file: File) => {
    try {
      setIsImporting(true);
      setError(null);
      
      const text = await file.text();
      const data = JSON.parse(text) as ExportedData;
      
      // Validate data structure
      if (!data.version || !data.settings) {
        throw new Error('Invalid backup file');
      }
      
      await importData(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
      return false;
    } finally {
      setIsImporting(false);
    }
  }, []);

  return { downloadExport, uploadImport, isExporting, isImporting, error };
}
