/**
 * RocketTabBar - Rocket Money-inspired premium tab bar
 * 
 * Features:
 * - Glassmorphic background with BlurView
 * - Spring animations on tab press
 * - Central FAB button
 * - Hide on scroll down, show on scroll up
 * - Badge support for notifications
 * - Long-press quick actions (TODO)
 * - Haptic feedback throughout
 */
import React, { useCallback, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Platform, StyleSheet, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeHaptics as Haptics } from '../../lib/haptics';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withSpring,
  FadeIn,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  Clock,
  BookOpen,
  MoreHorizontal,
  LucideIcon,
} from 'lucide-react-native';

import { useTabBar, TabRoute } from '../../context/TabBarContext';
import { FAB } from './FAB';
import { WebMoreMenu } from './WebMoreMenu';

// Conditionally import BottomSheet and MenuSheet only on native
let MenuSheet: any = null;
if (Platform.OS !== 'web') {
  MenuSheet = require('./BottomSheets').MenuSheet;
}

// ============================================================
// TYPES
// ============================================================

interface TabConfig {
  route: string;
  icon: LucideIcon;
  label: string;
  activeColor: string;
}

// ============================================================
// TAB CONFIGURATION
// ============================================================

const TABS: TabConfig[] = [
  { route: 'index', icon: Home, label: 'Home', activeColor: '#3b82f6' },
  { route: 'timeline', icon: Clock, label: 'Timeline', activeColor: '#10b981' },
  // FAB placeholder (index 2)
  { route: 'journal', icon: BookOpen, label: 'Journal', activeColor: '#a855f7' },
  { route: 'more', icon: MoreHorizontal, label: 'More', activeColor: '#64748b' },
];

// ============================================================
// ANIMATED COMPONENTS
// ============================================================

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// ============================================================
// TAB BUTTON
// ============================================================

interface TabButtonProps {
  tab: TabConfig;
  isFocused: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  badge?: number;
}

function TabButton({ tab, isFocused, onPress, onLongPress, badge }: TabButtonProps) {
  const scale = useSharedValue(1);
  
  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { scale: withSpring(isFocused ? 1.1 : 1, { damping: 15, stiffness: 200 }) },
    ],
  }));
  
  const IconComponent = tab.icon;
  
  return (
    <AnimatedTouchableOpacity
      style={[styles.tabButton, animatedStyle]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={tab.label}
    >
      <View style={styles.iconWrapper}>
        <IconComponent
          size={22}
          color={isFocused ? tab.activeColor : '#94a3b8'}
          strokeWidth={isFocused ? 2.5 : 2}
        />
        
        {/* Badge */}
        {badge && badge > 0 && (
          <View style={styles.badge}>
            <Animated.Text 
              entering={FadeIn.duration(200)}
              style={styles.badgeText}
            >
              {badge > 99 ? '99+' : badge}
            </Animated.Text>
          </View>
        )}
      </View>
      
      {/* Active indicator */}
      {isFocused && (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={[styles.activeIndicator, { backgroundColor: tab.activeColor }]}
        />
      )}
    </AnimatedTouchableOpacity>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function RocketTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const menuSheetRef = useRef<any>(null);
  const { 
    setActiveTab, 
    isTabBarVisible, 
    openMoreMenu, 
    closeMoreMenu,
    isMoreMenuOpen,
    badgeCounts,
  } = useTabBar();
  
  // Tab bar visibility animation
  const translateY = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(isTabBarVisible.value ? 0 : 120, {
          damping: 20,
          stiffness: 200,
        }),
      },
    ],
  }));
  
  // Handle More menu
  useEffect(() => {
    if (isMoreMenuOpen) {
      menuSheetRef.current?.snapToIndex(0);
    } else {
      menuSheetRef.current?.close();
    }
  }, [isMoreMenuOpen]);
  
  // Tab press handler
  const handleTabPress = useCallback((route: string, isFocused: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (route === 'more') {
      openMoreMenu();
      return;
    }
    
    if (!isFocused) {
      setActiveTab(route as TabRoute);
      navigation.navigate(route);
    }
  }, [navigation, setActiveTab, openMoreMenu]);
  
  // Get the current route index for highlighting
  const currentRouteName = state.routes[state.index]?.name;
  
  // Map route names to our tabs
  const getIsFocused = (tabRoute: string) => {
    if (tabRoute === 'index' && currentRouteName === 'index') return true;
    // Since we're hiding some tabs, "timeline" doesn't exist yet as a separate tab
    // For now, we map based on the current state
    return currentRouteName === tabRoute;
  };
  
  return (
    <>
      <Animated.View
        style={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, 8) },
          translateY,
        ]}
      >
        <View style={styles.tabBarWrapper}>
          <BlurView
            intensity={65}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.tabsContainer}>
            {/* Left tabs */}
            <TabButton
              tab={TABS[0]}
              isFocused={getIsFocused('index')}
              onPress={() => handleTabPress('index', getIsFocused('index'))}
              badge={0}
            />
            <TabButton
              tab={TABS[1]}
              isFocused={getIsFocused('timeline')}
              onPress={() => handleTabPress('timeline', getIsFocused('timeline'))}
            />
            
            {/* FAB Spacer */}
            <View style={styles.fabSpacer} />
            
            {/* Right tabs */}
            <TabButton
              tab={TABS[2]}
              isFocused={getIsFocused('journal')}
              onPress={() => handleTabPress('journal', getIsFocused('journal'))}
              badge={badgeCounts.journal}
            />
            <TabButton
              tab={TABS[3]}
              isFocused={false}
              onPress={() => handleTabPress('more', false)}
            />
          </View>
          
          {/* FAB */}
          <View style={styles.fabContainer}>
            <FAB />
          </View>
        </View>
      </Animated.View>
      
      {/* More Menu Sheet - only on native */}
      {Platform.OS !== 'web' && MenuSheet && (
        <MenuSheet
          ref={menuSheetRef}
          onClose={closeMoreMenu}
        />
      )}
      
      {/* Web More Menu */}
      {Platform.OS === 'web' && (
        <WebMoreMenu
          visible={isMoreMenuOpen}
          onClose={closeMoreMenu}
        />
      )}
    </>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  tabBarWrapper: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 6,
  },
  fabSpacer: {
    width: 72, // FAB width + some padding
  },
  fabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
});
