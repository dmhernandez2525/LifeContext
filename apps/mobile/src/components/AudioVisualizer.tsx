import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import { useEffect, useMemo } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  volume?: number;
  barCount?: number;
}

export function AudioVisualizer({
  isActive,
  volume = 0.5,
  barCount = 31,
}: AudioVisualizerProps) {
  const bars = useMemo(() => Array.from({ length: barCount }, (_, i) => i), [barCount]);

  return (
    <View className="flex-row items-center justify-center h-24 gap-[3px]">
      {bars.map((index) => (
        <WaveformBar
          key={index}
          index={index}
          isActive={isActive}
          volume={volume}
          totalBars={barCount}
        />
      ))}
    </View>
  );
}

interface WaveformBarProps {
  index: number;
  isActive: boolean;
  volume: number;
  totalBars: number;
}

function WaveformBar({ index, isActive, volume, totalBars }: WaveformBarProps) {
  const height = useSharedValue(6);

  // Gaussian-like curve for base height (taller in middle)
  const x = index / (totalBars - 1);
  const baseHeight = 6 + 60 * Math.exp(-Math.pow(x - 0.5, 2) / 0.08);
  
  // Real-time height based on volume
  const targetHeight = Math.max(6, baseHeight * (0.2 + volume * 1.5));

  useEffect(() => {
    if (isActive) {
      // Add some frequency-like jitter
      const jitter = 0.8 + Math.random() * 0.4;
      height.value = withSpring(targetHeight * jitter, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      height.value = withTiming(6, { duration: 500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    }
  }, [isActive, volume, targetHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  // Premium gradient coloring
  const getBarColor = () => {
    const ratio = index / totalBars;
    if (ratio < 0.2) return '#0ea5e9'; // primary-500 (sky)
    if (ratio < 0.5) return '#3b82f6'; // blue-500
    if (ratio < 0.8) return '#8b5cf6'; // purple-500
    return '#ec4899'; // pink-500
  };

  return (
    <Animated.View
      className="w-[3px] rounded-full"
      style={[
        animatedStyle,
        {
          backgroundColor: getBarColor(),
          opacity: isActive ? 1 : 0.3,
        }
      ]}
    />
  );
}

