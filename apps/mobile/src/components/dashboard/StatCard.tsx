import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { LucideIcon } from 'lucide-react-native';
import { Card } from '../ui';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
  delay?: number;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay = 0,
}: StatCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(15)}
      className="flex-1"
    >
      <Card variant="glass" className="border-white/5">
        <View className="flex-row items-center mb-2">
          <View
            className="w-8 h-8 rounded-lg items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={16} color={color} />
          </View>
        </View>
        <Text
          className="text-xl font-bold text-white"
          style={{ fontFamily: 'Inter_700Bold' }}
        >
          {value}
        </Text>
        <Text
          className="text-xs text-slate-400 mt-0.5"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          {label}
        </Text>
      </Card>
    </Animated.View>
  );
}
