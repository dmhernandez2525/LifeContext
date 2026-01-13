/**
 * FAB - Floating Action Button
 * 
 * Context-aware floating action button that changes icon and action
 * based on the currently active screen. Features:
 * - Gradient background with glow shadow
 * - Rotation animation on screen change
 * - Long-press for radial menu (TODO in Phase 2)
 * - Success pulse animation after action
 */
import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Platform, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTabBar } from '../../context/TabBarContext';

// ============================================================
// ANIMATED COMPONENTS
// ============================================================

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// ============================================================
// COMPONENT
// ============================================================

interface FABProps {
  onPress?: () => void;
  isVisible?: boolean;
}

export function FAB({ onPress, isVisible = true }: FABProps) {
  const { fabConfig, activeTab } = useTabBar();
  
  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  // Track previous tab for rotation animation
  const prevTabRef = React.useRef(activeTab);
  
  // Rotate icon when tab changes
  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      rotation.value = withSpring(rotation.value + 180, {
        damping: 15,
        stiffness: 150,
      });
      prevTabRef.current = activeTab;
    }
  }, [activeTab]);
  
  // Visibility animation
  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withSpring(100, { damping: 20, stiffness: 200 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [isVisible]);
  
  // Press handlers
  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };
  
  const handlePress = () => {
    // Success pulse animation
    scale.value = withSequence(
      withSpring(1.15, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Execute the FAB action
    if (onPress) {
      onPress();
    } else {
      fabConfig.action();
    }
  };
  
  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));
  
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
    ],
  }));
  
  const IconComponent = fabConfig.icon;
  
  return (
    <AnimatedTouchableOpacity
      style={[styles.container, containerStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
      accessibilityLabel={fabConfig.label}
      accessibilityRole="button"
    >
      {/* Glow effect */}
      <View style={[styles.glow, { shadowColor: fabConfig.color }]} />
      
      {/* Gradient background */}
      <LinearGradient
        colors={[fabConfig.color, adjustColor(fabConfig.color, -20)]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={iconStyle}>
          <IconComponent size={28} color="#ffffff" strokeWidth={2.5} />
        </Animated.View>
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Adjusts a hex color's brightness
 * @param color Hex color string
 * @param amount Amount to adjust (-255 to 255)
 */
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    borderRadius: 32,
    position: 'absolute',
    bottom: 8, // Elevated above tab bar
    alignSelf: 'center',
    zIndex: 10,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});
