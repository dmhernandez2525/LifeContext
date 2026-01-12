/**
 * Mobile Storage Layer
 * Uses expo-file-system for recordings and MMKV for fast key-value storage
 */
import * as FileSystem from 'expo-file-system';
import { MMKV } from 'react-native-mmkv';
import { generateId } from './encryption';

// ============================================================
// MMKV STORAGE (Fast key-value)
// ============================================================

import { Platform } from 'react-native';

export const storage = new MMKV({
  id: 'lcc-storage',
  ...(Platform.OS !== 'web' ? { encryptionKey: 'lcc-encryption-key' } : {}), // Encryption only on native
});


// ============================================================
// CONSTANTS
// ============================================================

const RECORDINGS_DIR = `${FileSystem.documentDirectory}recordings/`;
const JOURNALS_DIR = `${FileSystem.documentDirectory}journals/`;
const EXPORTS_DIR = `${FileSystem.documentDirectory}exports/`;

// ============================================================
// DIRECTORY SETUP
// ============================================================

export async function ensureDirectories(): Promise<void> {
  const dirs = [RECORDINGS_DIR, JOURNALS_DIR, EXPORTS_DIR];
  
  for (const dir of dirs) {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }
}

// ============================================================
// RECORDINGS
// ============================================================

export interface StoredRecording {
  id: string;
  questionId: string;
  audioUri: string;
  duration: number;
  transcriptionText?: string;
  createdAt: string;
}

/**
 * Save an audio recording
 */
export async function saveRecording(
  questionId: string,
  audioUri: string,
  duration: number,
  transcription?: string
): Promise<StoredRecording> {
  await ensureDirectories();
  
  const id = generateId();
  const fileName = `${id}.m4a`;
  const destUri = `${RECORDINGS_DIR}${fileName}`;
  
  // Copy audio file to app storage
  await FileSystem.copyAsync({
    from: audioUri,
    to: destUri,
  });
  
  const recording: StoredRecording = {
    id,
    questionId,
    audioUri: destUri,
    duration,
    transcriptionText: transcription,
    createdAt: new Date().toISOString(),
  };
  
  // Save to index
  const recordings = getRecordings();
  recordings.push(recording);
  storage.set('recordings', JSON.stringify(recordings));
  
  return recording;
}

/**
 * Get all recordings
 */
export function getRecordings(): StoredRecording[] {
  const data = storage.getString('recordings');
  return data ? JSON.parse(data) : [];
}

/**
 * Delete a recording
 */
export async function deleteRecording(id: string): Promise<void> {
  const recordings = getRecordings();
  const recording = recordings.find(r => r.id === id);
  
  if (recording) {
    // Delete audio file
    await FileSystem.deleteAsync(recording.audioUri, { idempotent: true });
    
    // Update index
    const updated = recordings.filter(r => r.id !== id);
    storage.set('recordings', JSON.stringify(updated));
  }
}

// ============================================================
// JOURNAL ENTRIES
// ============================================================

export interface StoredJournalEntry {
  id: string;
  type: 'text' | 'audio' | 'video';
  content: string;
  mediaUri?: string;
  duration?: number;
  mood?: number;
  tags?: string[];
  date: string;
  createdAt: string;
}

/**
 * Save a journal entry
 */
export async function saveJournalEntry(
  entry: Omit<StoredJournalEntry, 'id' | 'createdAt'>
): Promise<StoredJournalEntry> {
  await ensureDirectories();
  
  const journalEntry: StoredJournalEntry = {
    ...entry,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  
  const entries = getJournalEntries();
  entries.push(journalEntry);
  storage.set('journalEntries', JSON.stringify(entries));
  
  return journalEntry;
}

/**
 * Get all journal entries
 */
export function getJournalEntries(): StoredJournalEntry[] {
  const data = storage.getString('journalEntries');
  return data ? JSON.parse(data) : [];
}

/**
 * Delete a journal entry
 */
export async function deleteJournalEntry(id: string): Promise<void> {
  const entries = getJournalEntries();
  const entry = entries.find(e => e.id === id);
  
  if (entry?.mediaUri) {
    await FileSystem.deleteAsync(entry.mediaUri, { idempotent: true });
  }
  
  const updated = entries.filter(e => e.id !== id);
  storage.set('journalEntries', JSON.stringify(updated));
}

// ============================================================
// BRAIN DUMPS
// ============================================================

export interface StoredBrainDump {
  id: string;
  title?: string;
  bulletPoints: string[];
  audioUri?: string;
  transcription?: string;
  synthesis?: {
    organizedContent: string;
    insights: string[];
    questions: string[];
    contradictions: Array<{
      statement1: string;
      statement2: string;
      context: string;
      resolutionQuestion: string;
    }>;
  };
  duration?: number;
  createdAt: string;
}

/**
 * Save a brain dump
 */
export async function saveBrainDump(
  dump: Omit<StoredBrainDump, 'id' | 'createdAt'>
): Promise<StoredBrainDump> {
  const brainDump: StoredBrainDump = {
    ...dump,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  
  const dumps = getBrainDumps();
  dumps.push(brainDump);
  storage.set('brainDumps', JSON.stringify(dumps));
  
  return brainDump;
}

/**
 * Get all brain dumps
 */
export function getBrainDumps(): StoredBrainDump[] {
  const data = storage.getString('brainDumps');
  return data ? JSON.parse(data) : [];
}

// ============================================================
// TASKS (Kanban)
// ============================================================

export interface StoredTask {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Save/update a task
 */
export function saveTask(task: Omit<StoredTask, 'id' | 'createdAt' | 'updatedAt'>): StoredTask {
  const newTask: StoredTask = {
    ...task,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const tasks = getTasks();
  tasks.push(newTask);
  storage.set('tasks', JSON.stringify(tasks));
  
  return newTask;
}

/**
 * Update a task
 */
export function updateTask(id: string, updates: Partial<StoredTask>): void {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  
  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    storage.set('tasks', JSON.stringify(tasks));
  }
}

/**
 * Get all tasks
 */
export function getTasks(): StoredTask[] {
  const data = storage.getString('tasks');
  return data ? JSON.parse(data) : [];
}

/**
 * Delete a task
 */
export function deleteTask(id: string): void {
  const tasks = getTasks().filter(t => t.id !== id);
  storage.set('tasks', JSON.stringify(tasks));
}

// ============================================================
// SETTINGS
// ============================================================

export interface AppSettings {
  apiKey?: string;
  whisperApiKey?: string;
  showLiveTranscription: boolean;
  darkMode: boolean;
  hapticFeedback: boolean;
  cloudSyncEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  showLiveTranscription: true,
  darkMode: true,
  hapticFeedback: true,
  cloudSyncEnabled: false,
};

export function getSettings(): AppSettings {
  const data = storage.getString('settings');
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
}

export function updateSettings(updates: Partial<AppSettings>): void {
  const current = getSettings();
  storage.set('settings', JSON.stringify({ ...current, ...updates }));
}

// ============================================================
// EXPORT/IMPORT
// ============================================================

export interface ExportData {
  version: string;
  exportedAt: string;
  recordings: StoredRecording[];
  journalEntries: StoredJournalEntry[];
  brainDumps: StoredBrainDump[];
  tasks: StoredTask[];
  settings: AppSettings;
}

/**
 * Export all data to JSON
 */
export async function exportAllData(): Promise<string> {
  const data: ExportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    recordings: getRecordings(),
    journalEntries: getJournalEntries(),
    brainDumps: getBrainDumps(),
    tasks: getTasks(),
    settings: getSettings(),
  };
  
  const json = JSON.stringify(data, null, 2);
  const fileName = `lcc-backup-${Date.now()}.json`;
  const fileUri = `${EXPORTS_DIR}${fileName}`;
  
  await ensureDirectories();
  await FileSystem.writeAsStringAsync(fileUri, json);
  
  return fileUri;
}

/**
 * Clear all data
 */
export async function clearAllData(): Promise<void> {
  // Clear MMKV storage
  storage.clearAll();
  
  // Clear files
  const dirs = [RECORDINGS_DIR, JOURNALS_DIR];
  for (const dir of dirs) {
    await FileSystem.deleteAsync(dir, { idempotent: true });
  }
  
  await ensureDirectories();
}
