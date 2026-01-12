import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  BookOpen,
  Mic,
  Columns,
  Settings,
} from 'lucide-react-native';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface TabItem {
  icon: typeof Home;
  activeColor: string;
  scale?: number;
}

const TAB_ICONS: Record<string, TabItem> = {
  index: { icon: Home, activeColor: '#3b82f6' },
  journal: { icon: BookOpen, activeColor: '#10b981' },
  record: { icon: Mic, activeColor: '#a855f7', scale: 1.3 },
  kanban: { icon: Columns, activeColor: '#f59e0b' },
  settings: { icon: Settings, activeColor: '#64748b' },
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const handleTabPress = (route: { key: string; name: string; params?: object }, isFocused: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 16) }
      ]}
      className="absolute bottom-0 left-0 right-0"
    >
      <View className="mx-4 mb-2 overflow-hidden rounded-3xl">
        <BlurView
          intensity={80}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
        <View className="flex-row items-center justify-around px-6 py-4">
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const tabConfig = TAB_ICONS[route.name];

            if (!tabConfig) return null;

            const Icon = tabConfig.icon;
            const scale = tabConfig.scale || 1;
            const isRecordButton = route.name === 'record';

            return (
              <AnimatedTouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={() => handleTabPress(route, isFocused)}
                className={`items-center justify-center ${
                  isRecordButton
                    ? 'bg-accent-purple rounded-full p-4 -mt-4 shadow-lg shadow-accent-purple/50'
                    : 'py-2'
                }`}
                style={[
                  isRecordButton && {
                    shadowColor: tabConfig.activeColor,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }
                ]}
              >
                <Animated.View
                  style={[
                    useAnimatedStyle(() => ({
                      transform: [
                        {
                          scale: withSpring(
                            isFocused ? scale * 1.1 : scale,
                            { damping: 12 }
                          )
                        },
                      ],
                    })),
                  ]}
                >
                  <Icon
                    size={isRecordButton ? 28 : 24}
                    color={
                      isFocused || isRecordButton
                        ? tabConfig.activeColor
                        : '#64748b'
                    }
                    strokeWidth={isFocused ? 2.5 : 2}
                  />
                </Animated.View>

                {/* Active indicator dot */}
                {isFocused && !isRecordButton && (
                  <View
                    className="mt-1 h-1 w-1 rounded-full"
                    style={{ backgroundColor: tabConfig.activeColor }}
                  />
                )}
              </AnimatedTouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
