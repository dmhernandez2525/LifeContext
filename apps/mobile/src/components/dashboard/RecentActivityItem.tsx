import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Mic, BookOpen, Brain } from 'lucide-react-native';
import type { RecentItem } from './dashboardTypes';
import { formatRelativeDate } from './dashboardHelpers';

const typeConfig = {
  recording: { icon: Mic, color: '#3b82f6' },
  journal: { icon: BookOpen, color: '#10b981' },
  'brain-dump': { icon: Brain, color: '#a855f7' },
} as const;

interface RecentActivityItemProps {
  item: RecentItem;
  delay?: number;
}

export function RecentActivityItem({ item, delay = 0 }: RecentActivityItemProps) {
  const config = typeConfig[item.type];
  const Icon = config.icon;
  const { color } = config;

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify().damping(15)}>
      <TouchableOpacity activeOpacity={0.7}>
        <View className="flex-row items-center py-3 border-b border-white/5">
          <View
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={18} color={color} />
          </View>
          <View className="flex-1 ml-3">
            <Text
              className="text-white text-sm font-medium"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              {item.title}
            </Text>
            <Text
              className="text-slate-400 text-xs mt-0.5"
              numberOfLines={1}
              style={{ fontFamily: 'Inter_400Regular' }}
            >
              {item.subtitle}
            </Text>
          </View>
          <Text
            className="text-slate-500 text-xs"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            {formatRelativeDate(item.date)}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
