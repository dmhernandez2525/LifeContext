import { useState, useCallback, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

export interface StorageStats {
  recordingsSize: number;
  journalsSize: number; // Includes media in journals
  exportsSize: number;
  totalSize: number;
  isLoading: boolean;
}

const RECORDINGS_DIR = `${FileSystem.documentDirectory}recordings/`;
const JOURNALS_DIR = `${FileSystem.documentDirectory}journals/`;
const EXPORTS_DIR = `${FileSystem.documentDirectory}exports/`;

export function useStorageStats() {
  const [stats, setStats] = useState<StorageStats>({
    recordingsSize: 0,
    journalsSize: 0,
    exportsSize: 0,
    totalSize: 0,
    isLoading: true,
  });

  const getDirSize = async (uri: string): Promise<number> => {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists || !info.isDirectory) {
        return 0;
      }

      const files = await FileSystem.readDirectoryAsync(uri);
      let total = 0;

      for (const file of files) {
        // We know structure is flat for now, but to be safe we could assume flat files
        const fileInfo = await FileSystem.getInfoAsync(`${uri}${file}`);
        if (fileInfo.exists && !fileInfo.isDirectory) {
          total += fileInfo.size || 0;
        }
      }
      return total;
    } catch (error) {
      console.warn('Error reading directory size:', error);
      return 0;
    }
  };

  const refreshStats = useCallback(async () => {
    setStats(prev => ({ ...prev, isLoading: true }));
    
    try {
      const [recordings, journals, exports] = await Promise.all([
        getDirSize(RECORDINGS_DIR),
        getDirSize(JOURNALS_DIR),
        getDirSize(EXPORTS_DIR),
      ]);

      setStats({
        recordingsSize: recordings,
        journalsSize: journals,
        exportsSize: exports,
        totalSize: recordings + journals + exports,
        isLoading: false,
      });
    } catch (error) {
        console.error('Failed to calculate storage stats', error);
        setStats(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return {
    stats,
    refreshStats,
    formatSize,
  };
}
