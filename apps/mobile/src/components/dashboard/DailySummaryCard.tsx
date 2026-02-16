import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Sun, Battery, FileText } from 'lucide-react-native';
import { Card } from '../ui';

const moodLabels: Record<number, string> = {
  1: 'Rough',
  2: 'Low',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

const moodEmojis: Record<number, string> = {
  1: '😞',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
};

interface DailySummaryCardProps {
  mood: number | null;
  energy: number | null;
  entryCount: number;
  delay?: number;
}

export function DailySummaryCard({
  mood,
  energy,
  entryCount,
  delay = 0,
}: DailySummaryCardProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(15)}
      className="px-6 mb-6"
    >
      <Card variant="glass" className="border-white/5">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-amber-500/20 rounded-full items-center justify-center mr-2">
              <Sun size={16} color="#f59e0b" />
            </View>
            <Text
              className="text-white font-bold text-sm"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              Today
            </Text>
          </View>
          <Text
            className="text-slate-400 text-xs"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            {today}
          </Text>
        </View>

        <View className="flex-row justify-between mt-2">
          <View className="flex-1 items-center">
            <Text className="text-2xl mb-1">
              {mood != null ? moodEmojis[Math.round(mood)] ?? '😐' : '—'}
            </Text>
            <Text
              className="text-slate-400 text-xs"
              style={{ fontFamily: 'Inter_400Regular' }}
            >
              {mood != null ? moodLabels[Math.round(mood)] ?? 'Okay' : 'No mood'}
            </Text>
          </View>

          <View className="w-px bg-white/10 mx-3" />

          <View className="flex-1 items-center">
            <View className="flex-row items-center mb-1">
              <Battery size={18} color={energy != null ? '#10b981' : '#64748b'} />
            </View>
            <Text
              className="text-slate-400 text-xs"
              style={{ fontFamily: 'Inter_400Regular' }}
            >
              {energy != null ? `${energy}/5 energy` : 'No data'}
            </Text>
          </View>

          <View className="w-px bg-white/10 mx-3" />

          <View className="flex-1 items-center">
            <View className="flex-row items-center mb-1">
              <FileText size={18} color={entryCount > 0 ? '#3b82f6' : '#64748b'} />
            </View>
            <Text
              className="text-slate-400 text-xs"
              style={{ fontFamily: 'Inter_400Regular' }}
            >
              {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}
