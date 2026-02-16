import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface ProgressRingProps {
  progress: number;
  size?: number;
  delay?: number;
}

export function ProgressRing({ progress, size = 120, delay = 100 }: ProgressRingProps) {
  const animatedProgress = useSharedValue(0);
  const strokeWidth = 8;

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 1000 });
  }, [progress, animatedProgress]);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(15)}
      style={{ alignItems: 'center' }}
    >
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            position: 'absolute',
            width: size - strokeWidth,
            height: size - strokeWidth,
            borderRadius: (size - strokeWidth) / 2,
            borderWidth: strokeWidth,
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        />

        <View
          style={{
            position: 'absolute',
            width: size - strokeWidth,
            height: size - strokeWidth,
            borderRadius: (size - strokeWidth) / 2,
            borderWidth: strokeWidth,
            borderColor: '#3b82f6',
            borderTopColor: progress > 25 ? '#3b82f6' : 'transparent',
            borderRightColor: progress > 50 ? '#3b82f6' : 'transparent',
            borderBottomColor: progress > 75 ? '#3b82f6' : 'transparent',
            borderLeftColor: progress > 0 ? '#3b82f6' : 'transparent',
            transform: [{ rotate: '-90deg' }],
          }}
        />

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 28, color: '#ffffff' }}>
            {Math.round(progress)}%
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#94a3b8' }}>
            Context Built
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
