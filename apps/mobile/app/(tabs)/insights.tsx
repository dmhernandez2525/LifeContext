import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEmotionalTrends, useLifeChapters } from '@lcc/core';

export default function InsightsScreen() {
  const { averageMood, moodTrend, insights, isLoading: trendsLoading } = useEmotionalTrends();
  const { currentChapter, chapters, isLoading: chaptersLoading } = useLifeChapters();

  const getMoodEmoji = (score: number) => {
    if (score >= 4.5) return '😄';
    if (score >= 3.5) return '🙂';
    if (score >= 2.5) return '😐';
    if (score >= 1.5) return '😔';
    return '😢';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      default:
        return '➡️';
    }
  };

  const isLoading = trendsLoading || chaptersLoading;

  return (
    <SafeAreaView className="flex-1 bg-dark-background" edges={['top']}>
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-white">Insights</Text>
          <Text className="text-dark-text-secondary mt-1">
            Patterns and trends from your journey
          </Text>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-dark-text-secondary">Loading insights...</Text>
          </View>
        ) : (
          <>
            {/* Mood Overview */}
            <View className="bg-dark-surface rounded-2xl p-5 border border-dark-border mb-4">
              <Text className="text-dark-text-secondary text-sm uppercase tracking-wide mb-4">
                Emotional Overview
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="items-center">
                  <Text className="text-4xl">{getMoodEmoji(averageMood)}</Text>
                  <Text className="text-dark-text-secondary text-xs mt-2">
                    Avg Mood
                  </Text>
                  <Text className="text-white font-semibold">
                    {averageMood.toFixed(1)}/5
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-4xl">{getTrendIcon(moodTrend)}</Text>
                  <Text className="text-dark-text-secondary text-xs mt-2">
                    Trend
                  </Text>
                  <Text className="text-white font-semibold capitalize">
                    {moodTrend}
                  </Text>
                </View>
              </View>
            </View>

            {/* Current Chapter */}
            {currentChapter && (
              <View className="bg-dark-surface rounded-2xl p-5 border border-dark-border mb-4">
                <View className="flex-row items-center mb-3">
                  <Text className="text-xl mr-2">📖</Text>
                  <Text className="text-white font-semibold">Current Chapter</Text>
                </View>
                <Text className="text-brand-400 text-lg font-medium mb-2">
                  {currentChapter.title}
                </Text>
                <Text className="text-dark-text-secondary text-sm">
                  {currentChapter.recordingCount} recordings •{' '}
                  {currentChapter.journalCount} journal entries
                </Text>
                {currentChapter.dominantThemes.length > 0 && (
                  <View className="flex-row flex-wrap mt-3 gap-2">
                    {currentChapter.dominantThemes.slice(0, 3).map((theme, i) => (
                      <View
                        key={i}
                        className="bg-dark-border px-3 py-1 rounded-full"
                      >
                        <Text className="text-dark-text-secondary text-xs">
                          {theme}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* AI Insights */}
            {insights.length > 0 && (
              <View className="mb-4">
                <Text className="text-dark-text-secondary text-sm uppercase tracking-wide mb-3">
                  AI Insights
                </Text>
                {insights.map((insight) => (
                  <View
                    key={insight.id}
                    className="bg-dark-surface rounded-xl p-4 border border-dark-border mb-3"
                  >
                    <View className="flex-row items-center mb-2">
                      <Text className="mr-2">
                        {insight.type === 'warning'
                          ? '⚠️'
                          : insight.type === 'trend'
                            ? '📊'
                            : insight.type === 'correlation'
                              ? '🔗'
                              : '💡'}
                      </Text>
                      <Text className="text-white font-semibold flex-1">
                        {insight.title}
                      </Text>
                    </View>
                    <Text className="text-dark-text-secondary text-sm leading-5">
                      {insight.description}
                    </Text>
                    {insight.actionable && (
                      <Text className="text-brand-400 text-sm mt-2">
                        💡 {insight.actionable}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Life Chapters Timeline */}
            {chapters.length > 0 && (
              <View className="mb-4">
                <Text className="text-dark-text-secondary text-sm uppercase tracking-wide mb-3">
                  Life Timeline
                </Text>
                {chapters.slice(0, 5).map((chapter) => (
                  <View
                    key={chapter.id}
                    className="flex-row items-start mb-4"
                  >
                    <View className="w-3 h-3 bg-brand-500 rounded-full mt-1.5 mr-4" />
                    <View className="flex-1">
                      <Text className="text-white font-medium">
                        {chapter.title}
                      </Text>
                      <Text className="text-dark-text-secondary text-xs mt-1">
                        {chapter.startDate.toLocaleDateString()} •{' '}
                        {chapter.recordingCount + chapter.journalCount} entries
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Empty State */}
            {insights.length === 0 && chapters.length === 0 && (
              <View className="bg-dark-surface rounded-2xl p-8 border border-dark-border items-center">
                <Text className="text-4xl mb-4">🔍</Text>
                <Text className="text-white font-semibold text-lg text-center mb-2">
                  No Insights Yet
                </Text>
                <Text className="text-dark-text-secondary text-center">
                  Start recording brain dumps and journal entries to unlock
                  personalized insights about your life patterns.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
