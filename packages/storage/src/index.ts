/**
 * @lcc/storage
 * 
 * Local-first encrypted storage using IndexedDB (via Dexie.js)
 * All data is encrypted before storage using @lcc/encryption
 */

import Dexie, { type EntityTable } from 'dexie';
import type {
  Question,
  QuestionCategory,
  EncryptedData,
  EncryptionMeta,
} from '@lcc/types';

// ============================================================
// DATABASE SCHEMA
// ============================================================

/**
 * Stored question category (from seed data or user-added)
 */
interface StoredCategory extends QuestionCategory {
  // All fields from QuestionCategory
}

/**
 * Stored question
 */
interface StoredQuestion extends Question {
  // All fields from Question
}

/**
 * Stored context segment (encrypted)
 */
interface StoredContextSegment {
  id: string;
  questionId: string;
  categoryId: string;
  content: EncryptedData; // Encrypted
  privacyLevel: number;
  recordingId?: string;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

/**
 * Stored recording (audio data stored separately)
 */
interface StoredRecording {
  id: string;
  questionId: string;
  status: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  audioBlob?: Blob; // Raw audio
  waveformData: string; // JSON serialized
  transcriptionText?: EncryptedData; // Encrypted
  transcriptionConfidence?: number;
  createdAt: Date;
}

/**
 * Stored brain dump session
 */
interface StoredBrainDump {
  id: string;
  title: EncryptedData; // Encrypted
  description?: EncryptedData; // Encrypted
  bulletPoints: EncryptedData; // Encrypted JSON array
  recordingIds: string[];
  status: string;
  synthesis?: EncryptedData; // Encrypted JSON
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Stored pattern/insight
 */
interface StoredPattern {
  id: string;
  type: string;
  title: EncryptedData;
  description: EncryptedData;
  evidence: EncryptedData; // Encrypted JSON array
  significance: number;
  recommendation?: EncryptedData;
  createdAt: Date;
}

/**
 * Stored journal entry
 */
interface StoredJournalEntry {
  id: string;
  date: Date;
  content: EncryptedData; // Encrypted
  mood?: string;
  energyLevel?: number;
  mediaType: string;
  audioBlob?: Blob;
  videoBlob?: Blob;
  duration?: number;
  tags: string[];
  privacyLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User settings (some encrypted)
 */
interface StoredSettings {
  id: 'main'; // Singleton
  encryptionMeta: EncryptionMeta;
  passcodeHash: string;
  settings: EncryptedData; // Encrypted UserSettings
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// DATABASE CLASS
// ============================================================

class LifeContextDatabase extends Dexie {
  categories!: EntityTable<StoredCategory, 'id'>;
  questions!: EntityTable<StoredQuestion, 'id'>;
  contextSegments!: EntityTable<StoredContextSegment, 'id'>;
  recordings!: EntityTable<StoredRecording, 'id'>;
  brainDumps!: EntityTable<StoredBrainDump, 'id'>;
  patterns!: EntityTable<StoredPattern, 'id'>;
  settings!: EntityTable<StoredSettings, 'id'>;
  journalEntries!: EntityTable<StoredJournalEntry, 'id'>;

  constructor() {
    super('LifeContextCompiler');
    
    this.version(1).stores({
      categories: 'id, slug, order',
      questions: 'id, categoryId, order, isFollowUp',
      contextSegments: 'id, questionId, categoryId, privacyLevel, createdAt',
      recordings: 'id, questionId, status, createdAt',
      brainDumps: 'id, status, createdAt',
      patterns: 'id, type, createdAt',
      settings: 'id',
    });

    this.version(2).stores({
      categories: 'id, slug, order',
      questions: 'id, categoryId, order, isFollowUp',
      contextSegments: 'id, questionId, categoryId, privacyLevel, createdAt',
      recordings: 'id, questionId, status, createdAt',
      brainDumps: 'id, status, createdAt',
      patterns: 'id, type, createdAt',
      settings: 'id',
      journalEntries: 'id, date, mood, createdAt',
    });
  }
}

// ============================================================
// DATABASE INSTANCE
// ============================================================

export const db = new LifeContextDatabase();

// ============================================================
// SETTINGS OPERATIONS
// ============================================================

export async function getSettings(): Promise<StoredSettings | undefined> {
  return db.settings.get('main');
}

export async function saveSettings(settings: StoredSettings): Promise<void> {
  await db.settings.put(settings);
}

export async function isInitialized(): Promise<boolean> {
  const settings = await getSettings();
  return settings !== undefined;
}

// ============================================================
// CATEGORY OPERATIONS
// ============================================================

export async function getCategories(): Promise<StoredCategory[]> {
  return db.categories.orderBy('order').toArray();
}

export async function seedCategories(categories: StoredCategory[]): Promise<void> {
  await db.categories.bulkPut(categories);
}

export async function getCategoryBySlug(slug: string): Promise<StoredCategory | undefined> {
  return db.categories.where('slug').equals(slug).first();
}

// ============================================================
// QUESTION OPERATIONS
// ============================================================

export async function getQuestions(): Promise<StoredQuestion[]> {
  return db.questions.orderBy('order').toArray();
}

export async function getQuestionsByCategory(categoryId: string): Promise<StoredQuestion[]> {
  return db.questions.where('categoryId').equals(categoryId).toArray();
}

export async function saveQuestion(question: StoredQuestion): Promise<void> {
  await db.questions.put(question);
}

export async function seedQuestions(questions: StoredQuestion[]): Promise<void> {
  await db.questions.bulkPut(questions);
}

// ============================================================
// CONTEXT SEGMENT OPERATIONS
// ============================================================

export async function getContextSegments(): Promise<StoredContextSegment[]> {
  return db.contextSegments.orderBy('createdAt').toArray();
}

export async function getContextSegmentsByCategory(categoryId: string): Promise<StoredContextSegment[]> {
  return db.contextSegments.where('categoryId').equals(categoryId).toArray();
}

export async function getContextSegmentsByQuestion(questionId: string): Promise<StoredContextSegment[]> {
  return db.contextSegments.where('questionId').equals(questionId).toArray();
}

export async function saveContextSegment(segment: StoredContextSegment): Promise<void> {
  await db.contextSegments.put(segment);
}

export async function deleteContextSegment(id: string): Promise<void> {
  await db.contextSegments.delete(id);
}

// ============================================================
// RECORDING OPERATIONS
// ============================================================

export async function getRecordings(): Promise<StoredRecording[]> {
  return db.recordings.orderBy('createdAt').toArray();
}

export async function getRecording(id: string): Promise<StoredRecording | undefined> {
  return db.recordings.get(id);
}

export async function saveRecording(recording: StoredRecording): Promise<void> {
  await db.recordings.put(recording);
}

export async function deleteRecording(id: string): Promise<void> {
  await db.recordings.delete(id);
}

// ============================================================
// BRAIN DUMP OPERATIONS
// ============================================================

export async function getBrainDumps(): Promise<StoredBrainDump[]> {
  return db.brainDumps.orderBy('createdAt').reverse().toArray();
}

export async function getBrainDump(id: string): Promise<StoredBrainDump | undefined> {
  return db.brainDumps.get(id);
}

export async function saveBrainDump(brainDump: StoredBrainDump): Promise<void> {
  await db.brainDumps.put(brainDump);
}

export async function deleteBrainDump(id: string): Promise<void> {
  await db.brainDumps.delete(id);
}

// ============================================================
// PATTERN OPERATIONS
// ============================================================

export async function getPatterns(): Promise<StoredPattern[]> {
  return db.patterns.orderBy('createdAt').reverse().toArray();
}

export async function savePattern(pattern: StoredPattern): Promise<void> {
  await db.patterns.put(pattern);
}

// ============================================================
// JOURNAL ENTRY OPERATIONS
// ============================================================

export async function getJournalEntries(): Promise<StoredJournalEntry[]> {
  return db.journalEntries.orderBy('date').reverse().toArray();
}

export async function getJournalEntry(id: string): Promise<StoredJournalEntry | undefined> {
  return db.journalEntries.get(id);
}

export async function getJournalEntriesByDateRange(start: Date, end: Date): Promise<StoredJournalEntry[]> {
  return db.journalEntries
    .where('date')
    .between(start, end, true, true)
    .reverse()
    .toArray();
}

export async function saveJournalEntry(entry: StoredJournalEntry): Promise<void> {
  await db.journalEntries.put(entry);
}

export async function deleteJournalEntry(id: string): Promise<void> {
  await db.journalEntries.delete(id);
}

// ============================================================
// EXPORT / IMPORT
// ============================================================

export interface ExportedData {
  version: number;
  exportedAt: Date;
  settings: StoredSettings;
  categories: StoredCategory[];
  questions: StoredQuestion[];
  contextSegments: StoredContextSegment[];
  recordings: Omit<StoredRecording, 'audioBlob'>[]; // Exclude large blobs
  brainDumps: StoredBrainDump[];
  patterns: StoredPattern[];
}

/**
 * Export all data (except audio blobs) to a JSON-serializable object
 * All sensitive data remains encrypted
 */
export async function exportData(): Promise<ExportedData> {
  const [settings, categories, questions, contextSegments, recordings, brainDumps, patterns] = await Promise.all([
    getSettings(),
    getCategories(),
    getQuestions(),
    getContextSegments(),
    getRecordings(),
    getBrainDumps(),
    getPatterns(),
  ]);

  if (!settings) {
    throw new Error('Cannot export: no settings found');
  }

  // Remove audio blobs from recordings (too large)
  const recordingsWithoutBlobs = recordings.map(({ audioBlob, ...rest }) => rest);

  return {
    version: 1,
    exportedAt: new Date(),
    settings,
    categories,
    questions,
    contextSegments,
    recordings: recordingsWithoutBlobs,
    brainDumps,
    patterns,
  };
}

/**
 * Import data from an exported JSON object
 * This will REPLACE all existing data
 */
export async function importData(data: ExportedData): Promise<void> {
  // Clear existing data
  await Promise.all([
    db.settings.clear(),
    db.categories.clear(),
    db.questions.clear(),
    db.contextSegments.clear(),
    db.recordings.clear(),
    db.brainDumps.clear(),
    db.patterns.clear(),
  ]);

  // Import new data
  await Promise.all([
    db.settings.put(data.settings),
    db.categories.bulkPut(data.categories),
    db.questions.bulkPut(data.questions),
    db.contextSegments.bulkPut(data.contextSegments),
    db.recordings.bulkPut(data.recordings as StoredRecording[]),
    db.brainDumps.bulkPut(data.brainDumps),
    db.patterns.bulkPut(data.patterns),
  ]);
}

/**
 * Clear all data from the database
 */
export async function clearAllData(): Promise<void> {
  await Promise.all([
    db.settings.clear(),
    db.categories.clear(),
    db.questions.clear(),
    db.contextSegments.clear(),
    db.recordings.clear(),
    db.brainDumps.clear(),
    db.patterns.clear(),
  ]);
}

// Re-export types for convenience
export type {
  StoredCategory,
  StoredQuestion,
  StoredContextSegment,
  StoredRecording,
  StoredBrainDump,
  StoredPattern,
  StoredSettings,
};

// Export storage drivers
export {
  type StorageDriver,
  type S3Config,
  type FileSystemConfig,
  type DriverType,
  type SyncStatus,
  S3Driver,
  FileSystemDriver,
  InternalDriver,
  SyncManager,
  createDriver,
} from './drivers';
