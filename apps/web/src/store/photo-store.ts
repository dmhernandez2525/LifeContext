/**
 * Photo store for managing photo gallery and timeline.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PhotoEntry } from '@/lib/photoManager';

interface PhotoState {
  photos: PhotoEntry[];

  addPhoto: (photo: Omit<PhotoEntry, 'id'>) => string;
  addPhotos: (photos: Omit<PhotoEntry, 'id'>[]) => number;
  removePhoto: (id: string) => void;
  updatePhoto: (id: string, updates: Partial<PhotoEntry>) => void;
  setCaption: (id: string, caption: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  linkToJournal: (photoId: string, journalEntryId: string) => void;
  clearAll: () => void;
}

export const usePhotoStore = create<PhotoState>()(
  persist(
    (set) => ({
      photos: [],

      addPhoto: (photo) => {
        const id = crypto.randomUUID();
        set((state) => ({
          photos: [...state.photos, { ...photo, id }],
        }));
        return id;
      },

      addPhotos: (newPhotos) => {
        const toAdd = newPhotos.map(p => ({ ...p, id: crypto.randomUUID() }));
        set((state) => ({
          photos: [...state.photos, ...toAdd],
        }));
        return toAdd.length;
      },

      removePhoto: (id) =>
        set((state) => ({
          photos: state.photos.filter(p => p.id !== id),
        })),

      updatePhoto: (id, updates) =>
        set((state) => ({
          photos: state.photos.map(p => (p.id === id ? { ...p, ...updates } : p)),
        })),

      setCaption: (id, caption) =>
        set((state) => ({
          photos: state.photos.map(p => (p.id === id ? { ...p, caption } : p)),
        })),

      addTag: (id, tag) =>
        set((state) => ({
          photos: state.photos.map(p =>
            p.id === id && !p.tags.includes(tag) ? { ...p, tags: [...p.tags, tag] } : p
          ),
        })),

      removeTag: (id, tag) =>
        set((state) => ({
          photos: state.photos.map(p =>
            p.id === id ? { ...p, tags: p.tags.filter(t => t !== tag) } : p
          ),
        })),

      linkToJournal: (photoId, journalEntryId) =>
        set((state) => ({
          photos: state.photos.map(p =>
            p.id === photoId ? { ...p, journalEntryId } : p
          ),
        })),

      clearAll: () => set({ photos: [] }),
    }),
    { name: 'lcc-photos' }
  )
);
