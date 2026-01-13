import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  BookOpen,
  Mic,
  Columns,
  Settings,
  Brain,
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
  braindump: { icon: Brain, activeColor: '#0ea5e9' },
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
        { paddingBottom: Math.max(insets.bottom, 12) }
      ]}
      className="absolute bottom-0 left-0 right-0 pointer-events-box-none"
    >
      <View 
        className="mx-6 mb-2 overflow-hidden rounded-[32px] border border-white/10 shadow-2xl shadow-black/40"
      >
        <BlurView
          intensity={65}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
        <View className="flex-row items-center justify-around px-2 py-3 bg-slate-900/40">
          {state.routes.map((route: { key: string; name: string; params?: object }, index: number) => {
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
                onPress={() => handleTabPress(route, isFocused)}
                className={`items-center justify-center ${
                  isRecordButton
                    ? 'bg-primary-500 rounded-full w-14 h-14 -mt-8 shadow-xl shadow-primary-500/50 border-4 border-slate-950/20'
                    : 'flex-1 py-1'
                }`}
              >
                <Animated.View
                  style={[
                    useAnimatedStyle(() => ({
                      transform: [
                        {
                          scale: withSpring(
                            isFocused ? 1.15 : 1,
                            { damping: 15, stiffness: 200 }
                          )
                        },
                      ],
                    })),
                  ]}
                >
                  <Icon
                    size={isRecordButton ? 28 : 22}
                    color={
                      isRecordButton
                        ? '#ffffff'
                        : isFocused
                          ? tabConfig.activeColor
                          : '#94a3b8'
                    }
                    strokeWidth={isFocused || isRecordButton ? 2.5 : 2}
                  />
                </Animated.View>

                {/* Active indicator dot */}
                {isFocused && !isRecordButton && (
                  <Animated.View
                    entering={FadeIn.duration(200)}
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
