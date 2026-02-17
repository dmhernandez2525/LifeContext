/**
 * Health metrics store for tracking daily health data.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HealthEntry, MetricType } from '@/lib/healthMetrics';

interface HealthState {
  entries: HealthEntry[];
  goals: Partial<Record<MetricType, number>>;

  addEntry: (entry: Omit<HealthEntry, 'id' | 'createdAt'>) => void;
  removeEntry: (id: string) => void;
  importEntries: (entries: Omit<HealthEntry, 'id' | 'createdAt'>[]) => number;
  setGoal: (type: MetricType, value: number) => void;
  clearAll: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      entries: [],
      goals: {},

      addEntry: (entry) =>
        set((state) => ({
          entries: [
            ...state.entries,
            { ...entry, id: crypto.randomUUID(), createdAt: Date.now() },
          ],
        })),

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter(e => e.id !== id),
        })),

      importEntries: (newEntries) => {
        const existing = get().entries;
        const existingKeys = new Set(
          existing.map(e => `${e.date}:${e.type}:${e.value}:${e.source}`)
        );

        const toAdd: HealthEntry[] = [];
        for (const entry of newEntries) {
          const key = `${entry.date}:${entry.type}:${entry.value}:${entry.source}`;
          if (!existingKeys.has(key)) {
            toAdd.push({ ...entry, id: crypto.randomUUID(), createdAt: Date.now() });
            existingKeys.add(key);
          }
        }

        if (toAdd.length > 0) {
          set((state) => ({ entries: [...state.entries, ...toAdd] }));
        }
        return toAdd.length;
      },

      setGoal: (type, value) =>
        set((state) => ({
          goals: { ...state.goals, [type]: value },
        })),

      clearAll: () => set({ entries: [], goals: {} }),
    }),
    { name: 'lcc-health' }
  )
);
