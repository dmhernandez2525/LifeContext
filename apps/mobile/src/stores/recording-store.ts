import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

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

interface RecordingState {
  recordings: Recording[];
  addRecording: (recording: Recording) => void;
  deleteRecording: (id: string) => void;
  updateTranscription: (id: string, text: string) => void;
  syncRecordings: () => Promise<void>;
}

const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

export const useRecordingStore = create<RecordingState>()(
  persist(
    (set, get) => ({
      recordings: [],
      addRecording: (recording) => 
        set((state) => ({ recordings: [recording, ...state.recordings] })),
      deleteRecording: (id) =>
        set((state) => ({ 
          recordings: state.recordings.filter(r => r.id !== id) 
        })),
      updateTranscription: (id, text) =>
        set((state) => ({
          recordings: state.recordings.map(r => 
            r.id === id ? { ...r, transcription: text } : r
          )
        })),
      syncRecordings: async () => {
        const { recordings } = get();
        const pending = recordings.filter(r => r.syncStatus === 'pending');
        
        if (pending.length === 0) return;

        // Mock generic upload
        // In real app: await convex.mutation(api.recordings.create, { ... })
        console.log(`Syncing ${pending.length} recordings...`);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        set((state) => ({
          recordings: state.recordings.map(r => 
            r.syncStatus === 'pending' ? { ...r, syncStatus: 'synced' } : r
          )
        }));
      }
    }),
    {
      name: 'recording-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
