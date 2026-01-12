import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StorageStrategy = 'optimized' | 'archivist';
export type StorageProvider = 'internal' | 's3' | 'webdav' | 'filesystem';

interface S3Config {
  endpoint: string;
  bucket: string;
  region: string;
  accessKeyId: string; // Stored locally only
  secretAccessKey: string; // Stored locally only
}

interface StorageState {
  strategy: StorageStrategy;
  provider: StorageProvider;
  s3Config: S3Config;
  
  setStrategy: (s: StorageStrategy) => void;
  setProvider: (p: StorageProvider) => void;
  setS3Config: (c: Partial<S3Config>) => void;
}

export const useStorageStore = create<StorageState>()(
  persist(
    (set) => ({
      strategy: 'archivist', // Default to keeping data ("Future Proofing")
      provider: 'internal',
      s3Config: {
        endpoint: '',
        bucket: '',
        region: 'us-east-1',
        accessKeyId: '',
        secretAccessKey: '',
      },

      setStrategy: (strategy) => set({ strategy }),
      setProvider: (provider) => set({ provider }),
      setS3Config: (config) => set((state) => ({ 
        s3Config: { ...state.s3Config, ...config } 
      })),
    }),
    {
      name: 'lcc-storage-prefs',
    }
  )
);
