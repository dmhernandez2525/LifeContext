/**
 * Dashboard Screen (Home)
 *
 * Modular dashboard with customizable card layout, pull-to-refresh,
 * daily summary, streak heatmap, life score, and deep linking.
 */
import { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeHaptics as Haptics } from '../../src/lib/haptics';
import { Clock, BookOpen, CheckCircle2 } from 'lucide-react-native';
import {
  ProgressRing,
  StatCard,
  DailySummaryCard,
  StreakHeatmap,
  LifeScoreWidget,
  ThoughtOfDayCard,
  SuggestedPromptCard,
  QuickActionsSection,
  RecentActivitySection,
  useDashboardData,
} from '../../src/components/dashboard';
import { useDashboardStore, getVisibleCards } from '../../src/store/useDashboardStore';
import { formatRecordingTime } from '../../src/components/dashboard/dashboardHelpers';
import type { DashboardCardId } from '../../src/components/dashboard/dashboardTypes';

export default function DashboardScreen() {
  const router = useRouter();
  const { cards, isRefreshing, setRefreshing } = useDashboardStore();
  const visibleCards = getVisibleCards(cards);
  const {
    stats,
    recentItems,
    streakData,
    lifeScoreDimensions,
    overallProgress,
    loadData,
  } = useDashboardData();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    loadData();
    setTimeout(() => setRefreshing(false), 600);
  }, [loadData, setRefreshing]);

  const cardRenderers: Record<DashboardCardId, (delay: number) => React.ReactNode> = {
    'daily-summary': (delay) => (
      <DailySummaryCard
        key="daily-summary"
        mood={stats.todayMood}
        energy={stats.todayEnergy}
        entryCount={stats.todayEntryCount}
        delay={delay}
      />
    ),
    'progress-ring': (delay) => (
      <View key="progress-ring" className="items-center mb-6">
        <ProgressRing progress={overallProgress} size={140} delay={delay} />
      </View>
    ),
    stats: (delay) => (
      <View key="stats" className="flex-row px-6 gap-3 mb-6">
        <StatCard
          icon={Clock}
          value={formatRecordingTime(stats.totalRecordingTime)}
          label="Recording Time"
          color="#3b82f6"
          delay={delay}
        />
        <StatCard
          icon={BookOpen}
          value={stats.journalCount.toString()}
          label="Journal Entries"
          color="#10b981"
          delay={delay + 50}
        />
        <StatCard
          icon={CheckCircle2}
          value={`${stats.tasksCompleted}/${stats.taskCount}`}
          label="Tasks Done"
          color="#f59e0b"
          delay={delay + 100}
        />
      </View>
    ),
    streak: (delay) => (
      <StreakHeatmap
        key="streak"
        streakDays={stats.streakDays}
        heatmapData={streakData}
        delay={delay}
      />
    ),
    'life-score': (delay) => (
      <LifeScoreWidget
        key="life-score"
        dimensions={lifeScoreDimensions}
        delay={delay}
      />
    ),
    'thought-of-day': (delay) => (
      <ThoughtOfDayCard key="thought-of-day" delay={delay} />
    ),
    'quick-actions': (delay) => (
      <QuickActionsSection key="quick-actions" router={router} baseDelay={delay} />
    ),
    'recent-activity': (delay) => (
      <RecentActivitySection
        key="recent-activity"
        items={recentItems}
        router={router}
        baseDelay={delay}
      />
    ),
    'suggested-prompt': (delay) => (
      <SuggestedPromptCard
        key="suggested-prompt"
        onPress={() => router.push('/recording')}
        delay={delay}
      />
    ),
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
      >
        <View className="px-6 pt-4 pb-6">
          <Text
            className="text-slate-400 text-sm"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            Welcome back
          </Text>
          <Text
            className="text-2xl font-bold text-white mt-1"
            style={{ fontFamily: 'Inter_700Bold' }}
          >
            Your Life Context
          </Text>
        </View>

        {visibleCards.map((card, index) => {
          const render = cardRenderers[card.id];
          return render(100 + index * 80);
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
