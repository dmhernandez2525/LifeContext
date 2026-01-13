/**
 * EnergySlider - Premium slider component for energy level selection
 */
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Battery, BatteryLow, BatteryFull, BatteryMedium } from 'lucide-react-native';

// ============================================================
// TYPES
// ============================================================

interface EnergySliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

// ============================================================
// HELPER
// ============================================================

function getEnergyColor(value: number): string {
  if (value >= 75) return '#10b981'; // Green
  if (value >= 50) return '#f59e0b'; // Amber
  if (value >= 25) return '#f97316'; // Orange
  return '#ef4444'; // Red
}

function getEnergyIcon(value: number) {
  if (value >= 75) return BatteryFull;
  if (value >= 40) return BatteryMedium;
  return BatteryLow;
}

function getEnergyLabel(value: number): string {
  if (value >= 80) return 'Energized';
  if (value >= 60) return 'Good';
  if (value >= 40) return 'Moderate';
  if (value >= 20) return 'Tired';
  return 'Exhausted';
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function EnergySlider({ value, onChange, disabled = false }: EnergySliderProps) {
  const [sliderWidth, setSliderWidth] = useState(0);
  const translateX = useSharedValue(0);
  
  const color = getEnergyColor(value);
  const IconComponent = getEnergyIcon(value);
  const label = getEnergyLabel(value);

  const updateValue = useCallback((newValue: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newValue)));
    onChange(clamped);
    
    if (Platform.OS !== 'web' && clamped % 10 === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [onChange]);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((event) => {
      const percentage = Math.max(0, Math.min(100, (event.x / sliderWidth) * 100));
      runOnJS(updateValue)(percentage);
    });

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onEnd((event) => {
      const percentage = Math.max(0, Math.min(100, (event.x / sliderWidth) * 100));
      runOnJS(updateValue)(percentage);
    });

  const gesture = Gesture.Exclusive(panGesture, tapGesture);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${value}%`,
    backgroundColor: color,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    left: `${value}%`,
    backgroundColor: color,
    transform: [{ scale: withSpring(1) }],
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <IconComponent size={18} color={color} />
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
        <Text style={[styles.value, { color }]}>{value}%</Text>
      </View>

      {/* Slider */}
      <GestureDetector gesture={gesture}>
        <View 
          style={styles.track}
          onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View style={[styles.fill, fillStyle]} />
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </View>
      </GestureDetector>

      {/* Labels */}
      <View style={styles.labels}>
        <Text style={styles.minLabel}>Low</Text>
        <Text style={styles.maxLabel}>High</Text>
      </View>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  value: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  track: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'visible',
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -12,
    borderWidth: 3,
    borderColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  minLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#64748b',
  },
  maxLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#64748b',
  },
});
