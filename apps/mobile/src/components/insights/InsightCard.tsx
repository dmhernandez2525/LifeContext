import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TrendingUp, Brain, AlertTriangle, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export type InsightType = 'trend' | 'pattern' | 'warning';

interface InsightCardData {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  actionLabel?: string;
}

interface InsightCardProps {
  insight: InsightCardData;
  index: number;
  onAction?: () => void;
}

const getInsightStyle = (type: InsightType) => {
  switch (type) {
    case 'trend':
      return {
        icon: TrendingUp,
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        iconColor: '#3b82f6',
        titleColor: 'text-blue-400',
      };
    case 'pattern':
      return {
        icon: Brain,
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
        iconColor: '#a855f7',
        titleColor: 'text-purple-400',
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20',
        iconColor: '#f59e0b',
        titleColor: 'text-amber-400',
      };
    default:
      return {
        icon: Brain,
        bgColor: 'bg-slate-800',
        borderColor: 'border-slate-700',
        iconColor: '#64748b',
        titleColor: 'text-slate-300',
      };
  }
};

export function InsightCard({ insight, index, onAction }: InsightCardProps) {
  const style = getInsightStyle(insight.type);
  const Icon = style.icon;

  return (
    <Animated.View entering={FadeInUp.delay(index * 100)}>
      <TouchableOpacity
        onPress={onAction}
        activeOpacity={0.8}
        className={`${style.bgColor} border ${style.borderColor} rounded-2xl p-4 mb-3`}
      >
        <View className="flex-row items-start">
          <View className={`w-10 h-10 rounded-xl ${style.bgColor} items-center justify-center mr-3`}>
            <Icon size={20} color={style.iconColor} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className={`font-bold text-sm uppercase tracking-wide ${style.titleColor}`}>
                {insight.type}
              </Text>
            </View>
            <Text className="text-white font-semibold text-base mb-1">
              {insight.title}
            </Text>
            <Text className="text-slate-400 text-sm leading-5">
              {insight.description}
            </Text>
            {insight.actionLabel && (
              <View className="flex-row items-center mt-3">
                <Text className={`text-xs font-bold ${style.titleColor}`}>
                  {insight.actionLabel}
                </Text>
                <ChevronRight size={14} color={style.iconColor} />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Demo insights for display when no real data
export const DEMO_INSIGHTS: InsightCardData[] = [
  {
    id: '1',
    type: 'trend',
    title: 'Productivity Peak on Mondays',
    description: 'Your journal entries show consistently higher energy levels at the start of the week.',
    actionLabel: 'View Details',
  },
  {
    id: '2',
    type: 'pattern',
    title: 'Recurring Theme: Personal Growth',
    description: 'You\'ve mentioned "learning" and "improvement" in 12 entries this month.',
    actionLabel: 'Explore Theme',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Sleep Quality Concern',
    description: 'Evening journal entries indicate increased stress. Consider reviewing your bedtime routine.',
    actionLabel: 'Take Action',
  },
];
