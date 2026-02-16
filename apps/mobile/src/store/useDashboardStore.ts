import { create } from 'zustand';
import type { DashboardCardConfig, DashboardCardId } from '../components/dashboard/dashboardTypes';

const DEFAULT_CARDS: DashboardCardConfig[] = [
  { id: 'daily-summary', visible: true, order: 0 },
  { id: 'progress-ring', visible: true, order: 1 },
  { id: 'stats', visible: true, order: 2 },
  { id: 'streak', visible: true, order: 3 },
  { id: 'life-score', visible: true, order: 4 },
  { id: 'thought-of-day', visible: true, order: 5 },
  { id: 'quick-actions', visible: true, order: 6 },
  { id: 'recent-activity', visible: true, order: 7 },
  { id: 'suggested-prompt', visible: true, order: 8 },
];

interface DashboardState {
  cards: DashboardCardConfig[];
  isRefreshing: boolean;
  lastRefreshed: number | null;
  setCards: (cards: DashboardCardConfig[]) => void;
  toggleCardVisibility: (cardId: DashboardCardId) => void;
  reorderCard: (cardId: DashboardCardId, newOrder: number) => void;
  setRefreshing: (value: boolean) => void;
  resetLayout: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  cards: DEFAULT_CARDS,
  isRefreshing: false,
  lastRefreshed: null,

  setCards: (cards) => set({ cards }),

  toggleCardVisibility: (cardId) => {
    const { cards } = get();
    set({
      cards: cards.map((c) =>
        c.id === cardId ? { ...c, visible: !c.visible } : c,
      ),
    });
  },

  reorderCard: (cardId, newOrder) => {
    const { cards } = get();
    const sorted = [...cards].sort((a, b) => a.order - b.order);
    const currentIndex = sorted.findIndex((c) => c.id === cardId);
    if (currentIndex === -1) return;

    const [moved] = sorted.splice(currentIndex, 1);
    sorted.splice(newOrder, 0, moved);

    set({
      cards: sorted.map((c, i) => ({ ...c, order: i })),
    });
  },

  setRefreshing: (value) =>
    set({
      isRefreshing: value,
      lastRefreshed: value ? get().lastRefreshed : Date.now(),
    }),

  resetLayout: () => set({ cards: DEFAULT_CARDS }),
}));

export function getVisibleCards(cards: DashboardCardConfig[]): DashboardCardConfig[] {
  return [...cards].filter((c) => c.visible).sort((a, b) => a.order - b.order);
}
