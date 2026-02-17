import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Award } from 'lucide-react-native';
import { Card } from '../ui';
import type { LifeScoreDimension } from './dashboardTypes';

interface LifeScoreWidgetProps {
  dimensions: LifeScoreDimension[];
  delay?: number;
}

function getOverallScore(dimensions: LifeScoreDimension[]): number {
  if (dimensions.length === 0) return 0;
  const total = dimensions.reduce((sum, d) => sum + d.score, 0);
  return Math.round(total / dimensions.length);
}

function ScoreBar({ dimension }: { dimension: LifeScoreDimension }) {
  return (
    <View className="flex-row items-center mb-2.5">
      <Text
        className="text-slate-400 text-xs w-20"
        style={{ fontFamily: 'Inter_400Regular' }}
        numberOfLines={1}
      >
        {dimension.label}
      </Text>
      <View className="flex-1 h-2 bg-white/5 rounded-full mx-2 overflow-hidden">
        <View
          style={{
            width: `${Math.min(dimension.score, 100)}%`,
            height: '100%',
            backgroundColor: dimension.color,
            borderRadius: 4,
          }}
        />
      </View>
      <Text
        className="text-white text-xs w-8 text-right"
        style={{ fontFamily: 'Inter_600SemiBold' }}
      >
        {dimension.score}
      </Text>
    </View>
  );
}

export function LifeScoreWidget({ dimensions, delay = 0 }: LifeScoreWidgetProps) {
  const overall = getOverallScore(dimensions);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(15)}
      className="px-6 mb-6"
    >
      <Card variant="glass" className="border-white/5">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-emerald-500/20 rounded-full items-center justify-center mr-2">
              <Award size={16} color="#10b981" />
            </View>
            <Text
              className="text-white font-bold text-sm"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              Life Score
            </Text>
          </View>
          <View className="bg-emerald-500/20 px-3 py-1 rounded-full">
            <Text
              className="text-emerald-400 font-bold text-sm"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              {overall}/100
            </Text>
          </View>
        </View>

        {dimensions.map((dim) => (
          <ScoreBar key={dim.label} dimension={dim} />
        ))}
      </Card>
    </Animated.View>
  );
}
