/**
 * Swipeable row component for list items.
 * Reveals action buttons (delete, archive) on swipe.
 */
import { type ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Trash2, Archive } from 'lucide-react-native';
import { hapticDestructive, hapticLight } from '../../lib/hapticPatterns';

interface SwipeAction {
  label: string;
  color: string;
  icon: 'delete' | 'archive';
  onPress: () => void;
}

interface SwipeableRowProps {
  children: ReactNode;
  rightActions?: SwipeAction[];
  swipeThreshold?: number;
}

const ACTION_WIDTH = 72;
const SPRING_CONFIG = { damping: 20, stiffness: 200 };

const iconMap = {
  delete: Trash2,
  archive: Archive,
} as const;

export function SwipeableRow({
  children,
  rightActions = [],
  swipeThreshold = 0.4,
}: SwipeableRowProps) {
  const translateX = useSharedValue(0);
  const maxSwipe = rightActions.length * ACTION_WIDTH;

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      const nextX = Math.max(-maxSwipe, Math.min(0, e.translationX));
      translateX.value = nextX;
    })
    .onEnd((e) => {
      const shouldOpen = Math.abs(e.translationX) > maxSwipe * swipeThreshold;
      translateX.value = withSpring(shouldOpen ? -maxSwipe : 0, SPRING_CONFIG);
      if (shouldOpen) {
        runOnJS(hapticLight)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleAction = (action: SwipeAction) => {
    translateX.value = withSpring(0, SPRING_CONFIG);
    if (action.icon === 'delete') {
      hapticDestructive();
    } else {
      hapticLight();
    }
    action.onPress();
  };

  if (rightActions.length === 0) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.actionsContainer, { width: maxSwipe }]}>
        {rightActions.map((action) => {
          const Icon = iconMap[action.icon];
          return (
            <TouchableOpacity
              key={action.label}
              style={[styles.action, { backgroundColor: action.color }]}
              onPress={() => handleAction(action)}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <Icon size={20} color="#ffffff" />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    backgroundColor: '#0f172a',
  },
  actionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  action: {
    width: ACTION_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: '#ffffff',
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'Inter_600SemiBold',
  },
});
