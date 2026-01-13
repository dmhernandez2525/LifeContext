/**
 * TabBarContext - Provides shared state for navigation components
 * 
 * Manages:
 * - Current active tab
 * - Tab bar visibility (for hide on scroll)
 * - FAB context (icon, action, color per screen)
 * - Badge counts for notifications
 */
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Mic, Plus, Pencil, Sparkles, LucideIcon } from 'lucide-react-native';

// ============================================================
// TYPES
// ============================================================

export type TabRoute = 'index' | 'timeline' | 'journal' | 'braindump' | 'kanban' | 'settings' | 'insights' | 'record' | 'questions' | 'family';

export interface FABConfig {
  icon: LucideIcon;
  color: string;
  glowColor: string;
  action: () => void;
  label: string;
}

export interface BadgeCounts {
  journal: number;
  tasks: number;
}

export interface TabBarContextType {
  // Visibility
  isTabBarVisible: SharedValue<boolean>;
  scrollOffset: SharedValue<number>;
  setScrollOffset: (offset: number) => void;
  
  // Active tab tracking
  activeTab: TabRoute;
  setActiveTab: (tab: TabRoute) => void;
  
  // FAB configuration
  fabConfig: FABConfig;
  
  // Badges
  badgeCounts: BadgeCounts;
  setBadgeCounts: (counts: Partial<BadgeCounts>) => void;
  
  // More menu
  isMoreMenuOpen: boolean;
  openMoreMenu: () => void;
  closeMoreMenu: () => void;
}

// ============================================================
// FAB CONFIGURATIONS PER SCREEN
// ============================================================

const createFABConfigs = (router: ReturnType<typeof useRouter>): Record<TabRoute, FABConfig> => ({
  index: {
    icon: Mic,
    color: '#3b82f6', // Primary blue
    glowColor: 'rgba(59, 130, 246, 0.5)',
    action: () => router.push('/recording'),
    label: 'Record',
  },
  timeline: {
    icon: Plus,
    color: '#10b981', // Green
    glowColor: 'rgba(16, 185, 129, 0.5)',
    action: () => {}, // Will open add event sheet
    label: 'Add Event',
  },
  journal: {
    icon: Pencil,
    color: '#a855f7', // Purple
    glowColor: 'rgba(168, 85, 247, 0.5)',
    action: () => {}, // Will open journal editor
    label: 'New Entry',
  },
  braindump: {
    icon: Mic,
    color: '#0ea5e9', // Sky
    glowColor: 'rgba(14, 165, 233, 0.5)',
    action: () => router.push('/brain-dump'),
    label: 'Brain Dump',
  },
  kanban: {
    icon: Plus,
    color: '#f59e0b', // Amber
    glowColor: 'rgba(245, 158, 11, 0.5)',
    action: () => {}, // Will open task creation sheet
    label: 'New Task',
  },
  settings: {
    icon: Mic,
    color: '#64748b', // Slate
    glowColor: 'rgba(100, 116, 139, 0.5)',
    action: () => router.push('/recording'),
    label: 'Record',
  },
  insights: {
    icon: Sparkles,
    color: '#0ea5e9', // Sky
    glowColor: 'rgba(14, 165, 233, 0.5)',
    action: () => {}, // Will trigger AI prompt
    label: 'Ask AI',
  },
  questions: {
    icon: Plus,
    color: '#14b8a6', // Teal
    glowColor: 'rgba(20, 184, 166, 0.5)',
    action: () => {}, // Will open add question sheet
    label: 'Add Question',
  },
  record: {
    icon: Mic,
    color: '#a855f7', // Purple
    glowColor: 'rgba(168, 85, 247, 0.5)',
    action: () => {},
    label: 'Recording',
  },
  family: {
    icon: Plus,
    color: '#6366f1', // Indigo
    glowColor: 'rgba(99, 102, 241, 0.5)',
    action: () => {}, // Opens invite sheet (can implement if context allows, or leave generic)
    label: 'Invite',
  },
});

// ============================================================
// CONTEXT
// ============================================================

const TabBarContext = createContext<TabBarContextType | null>(null);

export function useTabBar(): TabBarContextType {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
}

// ============================================================
// PROVIDER
// ============================================================

interface TabBarProviderProps {
  children: ReactNode;
}

export function TabBarProvider({ children }: TabBarProviderProps) {
  const router = useRouter();
  
  // Shared values for animations
  const isTabBarVisible = useSharedValue(true);
  const scrollOffset = useSharedValue(0);
  
  // State
  const [activeTab, setActiveTab] = useState<TabRoute>('index');
  const [badgeCounts, setBadgeCountsState] = useState<BadgeCounts>({ journal: 0, tasks: 0 });
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  // FAB configs
  const fabConfigs = createFABConfigs(router);
  
  // Handlers
  const setScrollOffset = useCallback((offset: number) => {
    const previousOffset = scrollOffset.value;
    scrollOffset.value = offset;
    
    // Hide on scroll down (positive delta), show on scroll up (negative delta)
    const scrollDelta = offset - previousOffset;
    const threshold = 10; // Minimum scroll distance to trigger
    
    if (scrollDelta > threshold && offset > 100) {
      isTabBarVisible.value = false;
    } else if (scrollDelta < -threshold || offset < 50) {
      isTabBarVisible.value = true;
    }
  }, []);
  
  const setBadgeCounts = useCallback((counts: Partial<BadgeCounts>) => {
    setBadgeCountsState(prev => ({ ...prev, ...counts }));
  }, []);
  
  const openMoreMenu = useCallback(() => setIsMoreMenuOpen(true), []);
  const closeMoreMenu = useCallback(() => setIsMoreMenuOpen(false), []);
  
  const value: TabBarContextType = {
    isTabBarVisible,
    scrollOffset,
    setScrollOffset,
    activeTab,
    setActiveTab,
    fabConfig: fabConfigs[activeTab],
    badgeCounts,
    setBadgeCounts,
    isMoreMenuOpen,
    openMoreMenu,
    closeMoreMenu,
  };
  
  return (
    <TabBarContext.Provider value={value}>
      {children}
    </TabBarContext.Provider>
  );
}
