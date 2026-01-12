import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  volume?: number;
  barCount?: number;
}

export function AudioVisualizer({
  isActive,
  volume = 0.5,
  barCount = 40,
}: AudioVisualizerProps) {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <View className="flex-row items-center justify-center h-32 gap-1">
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
  const height = useSharedValue(4);

  // Calculate delay based on index for wave effect
  const delay = (index * 30) % 800;

  // Base height variation (taller in middle, shorter on edges)
  const centerDistance = Math.abs(index - totalBars / 2) / (totalBars / 2);
  const baseHeight = 4 + (1 - centerDistance) * 60;
  const maxHeight = baseHeight * (0.5 + volume * 1.5);

  useEffect(() => {
    if (isActive) {
      height.value = withRepeat(
        withSequence(
          withTiming(maxHeight, {
            duration: 400 + Math.random() * 200,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(baseHeight * 0.3, {
            duration: 400 + Math.random() * 200,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      );
    } else {
      height.value = withTiming(4, { duration: 300 });
    }
  }, [isActive, volume]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  // Color based on position
  const getBarColor = () => {
    const ratio = index / totalBars;
    if (ratio < 0.33) return 'bg-blue-500';
    if (ratio < 0.66) return 'bg-purple-500';
    return 'bg-pink-500';
  };

  return (
    <Animated.View
      className={`w-1 rounded-full ${getBarColor()}`}
      style={[
        animatedStyle,
        {
          minHeight: 4,
          maxHeight: maxHeight,
        }
      ]}
    />
  );
}
