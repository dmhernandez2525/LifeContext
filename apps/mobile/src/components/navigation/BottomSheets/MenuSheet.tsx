/**
 * MenuSheet - Bottom sheet for the "More" menu
 * 
 * Displays navigation options for screens not shown in the main tab bar:
 * - Insights (AI Chat)
 * - Kanban (Tasks)
 * - Brain Dump
 * - Settings
 * - Search (when implemented)
 */
import React, { forwardRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { SafeHaptics as Haptics } from '../../../lib/haptics';
import Animated, { FadeInRight } from 'react-native-reanimated';
import {
  Sparkles,
  Columns,
  Brain,
  Settings,
  Search,
  ChevronRight,
  HelpCircle,
  LucideIcon,
  Users,
} from 'lucide-react-native';

import { BaseBottomSheet } from './BaseBottomSheet';
import { useTabBar, TabRoute } from '../../../context/TabBarContext';

// ============================================================
// TYPES
// ============================================================

interface MenuItemConfig {
  route: TabRoute | string; // Allow string for raw paths
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
}

// ============================================================
// MENU ITEMS
// ============================================================

const MENU_ITEMS: MenuItemConfig[] = [
  {
    route: 'insights',
    icon: Sparkles,
    label: 'AI Insights',
    description: 'Chat with your context',
    color: '#0ea5e9',
  },
  {
    route: '/family',
    icon: Users,
    label: 'Family Circle',
    description: 'Manage shared journals & chapters',
    color: '#6366f1',
  },
  {
    route: 'questions',
    icon: HelpCircle,
    label: 'Life Questions',
    description: 'Build your personal context',
    color: '#14b8a6',
  },
  {
    route: 'kanban',
    icon: Columns,
    label: 'Action Items',
    description: 'Tasks and planning',
    color: '#f59e0b',
  },
  {
    route: 'braindump',
    icon: Brain,
    label: 'Brain Dump',
    description: 'Capture your thoughts',
    color: '#a855f7',
  },
  {
    route: '/settings',
    icon: Settings,
    label: 'Security',
    description: 'App lock & privacy',
    color: '#64748b',
  },
];

// ============================================================
// COMPONENT
// ============================================================

export interface MenuSheetProps {
  onClose?: () => void;
}

export const MenuSheet = forwardRef<BottomSheet, MenuSheetProps>(
  ({ onClose }, ref) => {
    const router = useRouter();
    const { setActiveTab, closeMoreMenu } = useTabBar();

    const handleItemPress = useCallback((item: MenuItemConfig) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      // Only set active tab if it's a known tab route, otherwise just navigate
      if (!item.route.startsWith('/')) {
        setActiveTab(item.route as TabRoute);
      }
      
      closeMoreMenu();
      
      // Navigate to the screen
      // If route starts with /, treat as absolute path. Otherwise assume tab.
      if (item.route.startsWith('/')) {
        router.push(item.route as any);
      } else {
        router.push(`/(tabs)/${item.route}` as any);
      }
      
      if (onClose) {
        onClose();
      }
    }, [router, setActiveTab, closeMoreMenu, onClose]);

    return (
      <BaseBottomSheet
        ref={ref}
        snapPoints={['55%']}
        onDismiss={onClose}
        index={0}
      >
        <View style={styles.container}>
          <Text style={styles.title}>More Options</Text>
          
          <View style={styles.menuList}>
            {MENU_ITEMS.map((item, index) => {
              const IconComponent = item.icon;
              
              return (
                <Animated.View
                  key={item.label}
                  entering={FadeInRight.delay(index * 50).duration(200)}
                >
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                      <IconComponent size={22} color={item.color} strokeWidth={2} />
                    </View>
                    
                    <View style={styles.textContainer}>
                      <Text style={styles.label}>{item.label}</Text>
                      <Text style={styles.description}>{item.description}</Text>
                    </View>
                    
                    <ChevronRight size={20} color="#64748b" />
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </BaseBottomSheet>
    );
  }
);

MenuSheet.displayName = 'MenuSheet';

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#f8fafc',
    marginBottom: 20,
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#f8fafc',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#94a3b8',
  },
});
