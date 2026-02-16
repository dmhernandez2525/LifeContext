import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Flame } from 'lucide-react-native';
import { Card } from '../ui';
import type { StreakDay } from './dashboardTypes';

function getHeatColor(entryCount: number): string {
  if (entryCount === 0) return 'rgba(255,255,255,0.05)';
  if (entryCount === 1) return 'rgba(59,130,246,0.3)';
  if (entryCount === 2) return 'rgba(59,130,246,0.5)';
  return 'rgba(59,130,246,0.8)';
}

function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'narrow' });
}

function getMoodDot(mood: number | null): string {
  if (mood == null) return '';
  if (mood >= 4) return '🟢';
  if (mood >= 3) return '🟡';
  return '🔴';
}

interface StreakHeatmapProps {
  streakDays: number;
  heatmapData: StreakDay[];
  delay?: number;
}

export function StreakHeatmap({
  streakDays,
  heatmapData,
  delay = 0,
}: StreakHeatmapProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(15)}
      className="px-6 mb-6"
    >
      <Card variant="glass" className="border-white/5">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-orange-500/20 rounded-full items-center justify-center mr-2">
              <Flame size={16} color="#f97316" />
            </View>
            <Text
              className="text-white font-bold text-sm"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              Streak
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text
              className="text-orange-400 font-bold text-lg mr-1"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              {streakDays}
            </Text>
            <Text
              className="text-slate-400 text-xs"
              style={{ fontFamily: 'Inter_400Regular' }}
            >
              {streakDays === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          {heatmapData.map((day) => (
            <View key={day.date} className="items-center flex-1">
              <Text
                className="text-slate-500 text-[10px] mb-1"
                style={{ fontFamily: 'Inter_400Regular' }}
              >
                {getDayLabel(day.date)}
              </Text>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: getHeatColor(day.entryCount),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {day.entryCount > 0 && (
                  <Text className="text-white text-xs font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
                    {day.entryCount}
                  </Text>
                )}
              </View>
              <Text className="text-[10px] mt-0.5">
                {getMoodDot(day.mood)}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </Animated.View>
  );
}
