/**
 * useDemoData - Hook to seed the application with demo data
 * 
 * This hook provides functions to hydrate the app with pre-filled
 * recordings, patterns, and insights for demonstration purposes.
 */

import { useCallback, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { db } from '@lcc/storage';
import { 
  DEMO_RECORDINGS, 
  DEMO_PATTERNS, 
  DEMO_STATS,
  DEMO_JOURNAL_ENTRIES,
  type DemoRecording,
  type DemoPattern,
  type DemoJournalEntry
} from '@/data/demoData';
import {
  EXTENDED_RECORDINGS,
  EXTENDED_JOURNAL_ENTRIES,
  EXTENDED_PATTERNS,
} from '@/data/extendedDemoData';
import { PrivacyLevel } from '@lcc/types';

export interface UseDemoDataReturn {
  seedDemoData: () => Promise<void>;
  clearDemoData: () => Promise<void>;
  isSeeding: boolean;
  isSeeded: boolean;
  progress: number;
}

export function useDemoData(): UseDemoDataReturn {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const { 
    addRecordingTime, 
    markQuestionAnswered,
    reset 
  } = useAppStore();

  const seedDemoData = useCallback(async () => {
    setIsSeeding(true);
    setProgress(0);

    try {
      // Combine all data
      const allRecordings = [...DEMO_RECORDINGS, ...EXTENDED_RECORDINGS];
      const allPatterns = [...DEMO_PATTERNS, ...EXTENDED_PATTERNS];
      const allJournals = [...DEMO_JOURNAL_ENTRIES, ...EXTENDED_JOURNAL_ENTRIES];
      
      const totalItems = allRecordings.length + allPatterns.length + allJournals.length;
      let completed = 0;

      // Seed recordings
      for (const recording of allRecordings) {
        await seedRecording(recording);
        markQuestionAnswered(recording.questionId);
        completed++;
        setProgress(Math.round((completed / totalItems) * 100));
      }

      // Seed patterns
      for (const pattern of allPatterns) {
        await seedPattern(pattern);
        completed++;
        setProgress(Math.round((completed / totalItems) * 100));
      }

      // Seed journal entries
      for (const journal of allJournals) {
        await seedJournalEntry(journal);
        completed++;
        setProgress(Math.round((completed / totalItems) * 100));
      }

      // Update stats
      addRecordingTime(DEMO_STATS.totalRecordingTime + 3000); // Include extended recordings

      setIsSeeded(true);
      setProgress(100);
    } catch (error) {
      console.error('Failed to seed demo data:', error);
      throw error;
    } finally {
      setIsSeeding(false);
    }
  }, [addRecordingTime, markQuestionAnswered]);

  const clearDemoData = useCallback(async () => {
    reset();
    setIsSeeded(false);
    setProgress(0);
  }, [reset]);

  return {
    seedDemoData,
    clearDemoData,
    isSeeding,
    isSeeded,
    progress,
  };
}

// Helper to create a mock encrypted data structure for demo purposes
// In production, this would use real encryption
function createMockEncryptedData(value: string): {
  version: number;
  algorithm: 'AES-256-GCM';
  iv: string;
  data: string;
  authTag: string;
} {
  return {
    version: 1,
    algorithm: 'AES-256-GCM',
    iv: btoa('demo-iv-' + Date.now()),
    data: btoa(value), // Base64 encode for demo
    authTag: btoa('demo-tag'),
  };
}

// Helper to seed a single recording
async function seedRecording(demo: DemoRecording): Promise<void> {
  const emptyBlob = new Blob([], { type: 'audio/webm' });
  const waveformData = generateDemoWaveform(demo.duration);

  await db.recordings.put({
    id: demo.id,
    questionId: demo.questionId,
    status: 'completed',
    startTime: new Date(demo.createdAt.getTime() - demo.duration * 1000),
    endTime: demo.createdAt,
    duration: demo.duration,
    audioBlob: emptyBlob,
    waveformData: JSON.stringify(waveformData),
    transcriptionText: createMockEncryptedData(demo.transcript),
    transcriptionConfidence: 0.95,
    createdAt: demo.createdAt,
  });
}

// Helper to seed a single pattern
async function seedPattern(demo: DemoPattern): Promise<void> {
  await db.patterns.put({
    id: demo.id,
    type: demo.type,
    title: createMockEncryptedData(demo.title),
    description: createMockEncryptedData(demo.description),
    evidence: createMockEncryptedData(JSON.stringify(demo.evidence)),
    significance: demo.significance,
    recommendation: demo.recommendation ? createMockEncryptedData(demo.recommendation) : undefined,
    createdAt: demo.createdAt,
  });
}

// Generate a fake waveform for demo recordings
function generateDemoWaveform(duration: number): number[] {
  const sampleCount = Math.min(100, Math.round(duration / 2));
  return Array.from({ length: sampleCount }, () => Math.random() * 0.8 + 0.1);
}

// Helper to seed a single journal entry
async function seedJournalEntry(demo: DemoJournalEntry): Promise<void> {
  await db.journalEntries.put({
    id: demo.id,
    date: demo.date,
    content: createMockEncryptedData(demo.content),
    mood: demo.mood,
    energyLevel: demo.energyLevel,
    mediaType: demo.mediaType,
    duration: demo.duration,
    tags: demo.tags,
    privacyLevel: PrivacyLevel.PRIVATE,
    createdAt: demo.date,
    updatedAt: demo.date,
  });
}

export default useDemoData;
