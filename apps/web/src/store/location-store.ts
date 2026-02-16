/**
 * Location store for place management and location history.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LocationEntry, SavedPlace } from '@/lib/locationContext';

interface LocationState {
  entries: LocationEntry[];
  places: SavedPlace[];
  trackingEnabled: boolean;
  lastLocation: { lat: number; lon: number } | null;

  addEntry: (entry: Omit<LocationEntry, 'id'>) => void;
  removeEntry: (id: string) => void;
  addPlace: (place: Omit<SavedPlace, 'id' | 'visitCount' | 'lastVisit'>) => void;
  updatePlace: (id: string, updates: Partial<SavedPlace>) => void;
  removePlace: (id: string) => void;
  setTracking: (enabled: boolean) => void;
  setLastLocation: (lat: number, lon: number) => void;
  incrementVisit: (placeId: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      entries: [],
      places: [],
      trackingEnabled: false,
      lastLocation: null,

      addEntry: (entry) =>
        set((state) => ({
          entries: [...state.entries, { ...entry, id: crypto.randomUUID() }],
        })),

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter(e => e.id !== id),
        })),

      addPlace: (place) =>
        set((state) => ({
          places: [
            ...state.places,
            { ...place, id: crypto.randomUUID(), visitCount: 0, lastVisit: null },
          ],
        })),

      updatePlace: (id, updates) =>
        set((state) => ({
          places: state.places.map(p => (p.id === id ? { ...p, ...updates } : p)),
        })),

      removePlace: (id) =>
        set((state) => ({
          places: state.places.filter(p => p.id !== id),
        })),

      setTracking: (enabled) => set({ trackingEnabled: enabled }),

      setLastLocation: (lat, lon) => set({ lastLocation: { lat, lon } }),

      incrementVisit: (placeId) =>
        set((state) => ({
          places: state.places.map(p =>
            p.id === placeId ? { ...p, visitCount: p.visitCount + 1, lastVisit: Date.now() } : p
          ),
        })),
    }),
    { name: 'lcc-location' }
  )
);
