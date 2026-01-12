/**
 * useRecentRecordings - Simple hook to fetch recent recordings without encryption key
 * For MVP display on Dashboard - in production would decrypt transcripts
 */
import { useState, useEffect, useCallback } from 'react';
import { getRecordings, deleteRecording as deleteRecordingFromDb, type StoredRecording } from '@lcc/storage';

export function useRecentRecordings(limit = 5) {
  const [recordings, setRecordings] = useState<StoredRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const all = await getRecordings();
      // Sort by most recent and take limit
      const sorted = all
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
      setRecordings(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recordings');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Delete a recording
  const deleteRecording = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteRecordingFromDb(id);
      // Optimistic update - remove from local state
      setRecordings(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recording');
      return false;
    }
  }, []);

  // Helper to decode transcript (for MVP pseudo-encrypted format)
  const getTranscript = (recording: StoredRecording): string | null => {
    if (!recording.transcriptionText) return null;
    try {
      // MVP format: base64 encoded in data field
      if (recording.transcriptionText.iv === 'unencrypted-mvp') {
        return atob(recording.transcriptionText.data);
      }
      return null; // Encrypted - would need key to decrypt
    } catch {
      return null;
    }
  };

  return { recordings, isLoading, error, refresh, getTranscript, deleteRecording };
}

export default useRecentRecordings;
