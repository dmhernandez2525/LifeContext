/**
 * Data Management Utilities
 * 
 * Export/import data, storage stats, and selective deletion
 */
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as storage from './storage';
import * as questions from './questions';

// ============================================================
// TYPES
// ============================================================

export interface ExportData {
  version: string;
  exportedAt: string;
  recordings: any[];
  journalEntries: any[];
  brainDumps: any[];
  tasks: any[];
  categories: any[];
  questions: any[];
  answeredQuestions: any[];
  settings: any;
}

export interface StorageStats {
  totalItems: number;
  recordings: { count: number; totalDuration: number };
  journals: { count: number };
  brainDumps: { count: number };
  tasks: { count: number; completed: number };
  questions: { count: number; answered: number };
}

// ============================================================
// EXPORT
// ============================================================

export async function exportAllData(): Promise<string | null> {
  try {
    const exportData: ExportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      recordings: storage.getRecordings(),
      journalEntries: storage.getJournalEntries(),
      brainDumps: storage.getBrainDumps(),
      tasks: storage.getTasks(),
      categories: questions.getCategories(),
      questions: questions.getQuestions(),
      answeredQuestions: questions.getAnsweredQuestions(),
      settings: storage.getSettings(),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = `lifecontext-export-${new Date().toISOString().split('T')[0]}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, jsonString);
    
    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/json',
        dialogTitle: 'Export Life Context Data',
      });
    }

    return filePath;
  } catch {
    // Export failed - file system or sharing error
    return null;
  }
}

// ============================================================
// IMPORT
// ============================================================

export async function importData(): Promise<{ success: boolean; message: string }> {
  // DocumentPicker not available on web
  if (Platform.OS === 'web') {
    return { success: false, message: 'Import is not supported on web' };
  }
  
  try {
    // Dynamic import to avoid bundling on web
    const DocumentPicker = require('expo-document-picker');
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.[0]) {
      return { success: false, message: 'Import cancelled' };
    }

    const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
    const data: ExportData = JSON.parse(fileContent);

    // Validate version
    if (!data.version) {
      return { success: false, message: 'Invalid export file format' };
    }

    // Import each data type (merge, don't overwrite)
    let imported = 0;

    // Recordings
    for (const recording of data.recordings || []) {
      try {
        await storage.saveRecording(
          recording.questionId || '',
          recording.audioUri || recording.uri || '',
          recording.duration || 0,
          recording.transcriptionText
        );
        imported++;
      } catch {
        // Already exists or error, skip
      }
    }

    // Journal entries
    for (const journal of data.journalEntries || []) {
      try {
        await storage.saveJournalEntry(journal);
        imported++;
      } catch {
        // Skip
      }
    }

    // Brain dumps
    for (const dump of data.brainDumps || []) {
      try {
        await storage.saveBrainDump(dump);
        imported++;
      } catch {
        // Skip
      }
    }

    // Tasks
    for (const task of data.tasks || []) {
      try {
        await storage.saveTask(task);
        imported++;
      } catch {
        // Skip
      }
    }

    return {
      success: true,
      message: `Successfully imported ${imported} items`
    };
  } catch {
    // Import failed - invalid file or parse error
    return { success: false, message: 'Failed to import data' };
  }
}

// ============================================================
// STORAGE STATS
// ============================================================

export function getStorageStats(): StorageStats {
  const recordings = storage.getRecordings();
  const journals = storage.getJournalEntries();
  const brainDumps = storage.getBrainDumps();
  const tasks = storage.getTasks();
  const allQuestions = questions.getQuestions();
  const answered = questions.getAnsweredQuestions();

  return {
    totalItems: recordings.length + journals.length + brainDumps.length + tasks.length,
    recordings: {
      count: recordings.length,
      totalDuration: recordings.reduce((sum, r) => sum + (r.duration || 0), 0),
    },
    journals: {
      count: journals.length,
    },
    brainDumps: {
      count: brainDumps.length,
    },
    tasks: {
      count: tasks.length,
      completed: tasks.filter(t => t.status === 'done').length,
    },
    questions: {
      count: allQuestions.length,
      answered: answered.length,
    },
  };
}

// ============================================================
// SELECTIVE DELETION
// ============================================================

export async function deleteAllRecordings(): Promise<boolean> {
  try {
    const recordings = storage.getRecordings();
    for (const recording of recordings) {
      await storage.deleteRecording(recording.id);
    }
    return true;
  } catch {
    return false;
  }
}

export async function deleteAllJournals(): Promise<boolean> {
  try {
    const journals = storage.getJournalEntries();
    for (const journal of journals) {
      await storage.deleteJournalEntry(journal.id);
    }
    return true;
  } catch {
    return false;
  }
}

export async function deleteAllBrainDumps(): Promise<boolean> {
  try {
    const dumps = storage.getBrainDumps();
    for (const dump of dumps) {
      await storage.deleteBrainDump(dump.id);
    }
    return true;
  } catch {
    return false;
  }
}

export async function deleteAllData(): Promise<boolean> {
  try {
    await deleteAllRecordings();
    await deleteAllJournals();
    await deleteAllBrainDumps();

    const tasks = storage.getTasks();
    for (const task of tasks) {
      storage.deleteTask(task.id);
    }

    return true;
  } catch {
    return false;
  }
}

// ============================================================
// FORMAT HELPERS
// ============================================================

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDurationMinutes(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} min`;
}
