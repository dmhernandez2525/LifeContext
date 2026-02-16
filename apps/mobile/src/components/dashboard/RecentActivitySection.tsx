import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, Play } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card } from '../ui';
import { RecentActivityItem } from './RecentActivityItem';
import type { RecentItem } from './dashboardTypes';

interface RecentActivitySectionProps {
  items: RecentItem[];
  router: ReturnType<typeof useRouter>;
  baseDelay: number;
}

export function RecentActivitySection({
  items,
  router,
  baseDelay,
}: RecentActivitySectionProps) {
  return (
    <View className="px-6 mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text
          className="text-lg font-bold text-white"
          style={{ fontFamily: 'Inter_700Bold' }}
        >
          Recent Activity
        </Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.push('/(tabs)/timeline')}
        >
          <Text
            className="text-blue-400 text-sm mr-1"
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            View All
          </Text>
          <ChevronRight size={16} color="#60a5fa" />
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <Card variant="glass" className="border-white/5 items-center py-8">
          <View className="w-16 h-16 rounded-full bg-slate-800 items-center justify-center mb-4">
            <Play size={28} color="#94a3b8" />
          </View>
          <Text
            className="text-white font-semibold text-center"
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            No activity yet
          </Text>
          <Text
            className="text-slate-400 text-sm text-center mt-1"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            Start recording to build your context
          </Text>
        </Card>
      ) : (
        <Card variant="glass" className="border-white/5 py-1">
          {items.map((item, index) => (
            <RecentActivityItem
              key={item.id}
              item={item}
              delay={baseDelay + index * 50}
            />
          ))}
        </Card>
      )}
    </View>
  );
}
