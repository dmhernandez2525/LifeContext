/**
 * Retention policy store for data lifecycle management.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type RetentionPolicy,
  type RetentionPeriod,
  type DataCategory,
  DEFAULT_POLICIES,
} from '@/lib/retentionPolicies';

interface RetentionState {
  policies: RetentionPolicy[];
  autoDelete: boolean;
  lastPurge: number | null;
  purgeIntervalDays: number;

  updatePolicy: (category: DataCategory, period: RetentionPeriod) => void;
  togglePolicy: (category: DataCategory) => void;
  setAutoDelete: (enabled: boolean) => void;
  setPurgeInterval: (days: number) => void;
  recordPurge: () => void;
  resetToDefaults: () => void;
}

export const useRetentionStore = create<RetentionState>()(
  persist(
    (set) => ({
      policies: DEFAULT_POLICIES,
      autoDelete: false,
      lastPurge: null,
      purgeIntervalDays: 7,

      updatePolicy: (category, period) =>
        set((state) => ({
          policies: state.policies.map(p =>
            p.category === category ? { ...p, period } : p
          ),
        })),

      togglePolicy: (category) =>
        set((state) => ({
          policies: state.policies.map(p =>
            p.category === category ? { ...p, enabled: !p.enabled } : p
          ),
        })),

      setAutoDelete: (enabled) => set({ autoDelete: enabled }),

      setPurgeInterval: (days) => set({ purgeIntervalDays: days }),

      recordPurge: () => set({ lastPurge: Date.now() }),

      resetToDefaults: () => set({
        policies: DEFAULT_POLICIES,
        autoDelete: false,
        lastPurge: null,
        purgeIntervalDays: 7,
      }),
    }),
    { name: 'lcc-retention' }
  )
);
