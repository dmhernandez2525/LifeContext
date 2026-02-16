import { View, Text, ScrollView } from 'react-native';
import { Mic, BookOpen, Brain, Sparkles, Target } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { QuickActionCard } from './QuickActionCard';

interface QuickActionsSectionProps {
  router: ReturnType<typeof useRouter>;
  baseDelay: number;
}

export function QuickActionsSection({ router, baseDelay }: QuickActionsSectionProps) {
  return (
    <View className="mb-6">
      <View className="px-6 flex-row justify-between items-center mb-4">
        <Text
          className="text-lg font-bold text-white"
          style={{ fontFamily: 'Inter_700Bold' }}
        >
          Quick Actions
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        <QuickActionCard
          icon={Mic}
          title="Record"
          subtitle="Capture thoughts"
          color="#3b82f6"
          onPress={() => router.push('/recording')}
          delay={baseDelay}
        />
        <QuickActionCard
          icon={BookOpen}
          title="Journal"
          subtitle="Daily reflection"
          color="#10b981"
          onPress={() => router.push('/(tabs)/journal')}
          delay={baseDelay + 50}
        />
        <QuickActionCard
          icon={Brain}
          title="Brain Dump"
          subtitle="Unload ideas"
          color="#a855f7"
          onPress={() => router.push('/brain-dump')}
          delay={baseDelay + 100}
        />
        <QuickActionCard
          icon={Sparkles}
          title="AI Insights"
          subtitle="Get analysis"
          color="#0ea5e9"
          onPress={() => router.push('/(tabs)/insights')}
          delay={baseDelay + 150}
        />
        <QuickActionCard
          icon={Target}
          title="Life Plan"
          subtitle="Goals & vision"
          color="#f472b6"
          onPress={() => router.push('/life-planning')}
          delay={baseDelay + 200}
        />
      </ScrollView>
    </View>
  );
}
