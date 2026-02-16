import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import type { LucideIcon } from 'lucide-react-native';
import { SafeHaptics as Haptics } from '../../lib/haptics';
import { Card } from '../ui';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
  delay?: number;
}

export function QuickActionCard({
  icon: Icon,
  title,
  subtitle,
  color,
  onPress,
  delay = 0,
}: QuickActionCardProps) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Animated.View entering={FadeInRight.delay(delay).springify().damping(15)}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8} className="mr-3">
        <Card variant="glass" className="w-40 border-white/5">
          <View
            className="w-10 h-10 rounded-xl items-center justify-center mb-3"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={20} color={color} />
          </View>
          <Text
            className="text-white font-semibold text-sm"
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            {title}
          </Text>
          <Text
            className="text-slate-400 text-xs mt-0.5"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            {subtitle}
          </Text>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}
