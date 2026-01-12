/**
 * useSaveRecording - Simple hook to save recordings to IndexedDB
 * Does not require encryption key (for MVP - in production, encrypt transcripts)
 */
import { useCallback, useState } from 'react';
import { saveRecording, type StoredRecording } from '@lcc/storage';

export interface RecordingData {
  questionId: string;
  audioBlob: Blob;
  duration: number;
  transcript?: string;
  waveformData?: number[];
}

export function useSaveRecording() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async (data: RecordingData): Promise<StoredRecording | null> => {
    setIsSaving(true);
    setError(null);

    try {
      const recording: StoredRecording = {
        id: crypto.randomUUID(),
        questionId: data.questionId,
        status: 'completed',
        startTime: new Date(Date.now() - data.duration * 1000),
        endTime: new Date(),
        duration: data.duration,
        audioBlob: data.audioBlob,
        waveformData: JSON.stringify(data.waveformData || []),
        // For MVP, store transcript as pseudo-encrypted placeholder
        // In production, this would be properly encrypted with the user's key
        transcriptionText: data.transcript ? {
          version: 1,
          algorithm: 'AES-256-GCM' as const,
          iv: 'unencrypted-mvp', // Placeholder IV
          data: btoa(data.transcript), // Base64 encode the text
          authTag: 'unencrypted-mvp', // Placeholder auth tag
        } : undefined,
        transcriptionConfidence: data.transcript ? 0.8 : undefined,
        createdAt: new Date(),
      };

      await saveRecording(recording);
      return recording;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save recording';
      setError(message);
      console.error('Save recording error:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { save, isSaving, error };
}

export default useSaveRecording;
