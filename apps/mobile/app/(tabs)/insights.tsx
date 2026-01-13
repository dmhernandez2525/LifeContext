/**
 * Insights Screen - Premium AI-powered pattern analysis
 */
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Brain, Sparkles, TrendingUp, AlertCircle, Lightbulb, Target } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useAnalysis, AnalysisPattern } from '../../src/hooks';
import { getRecordings, getJournalEntries, getBrainDumps } from '../../src/lib/storage';
import { Card, Button } from '../../src/components/ui';

export default function InsightsScreen() {
  const { isLoading, patterns, error, hasApiKey, analyze } = useAnalysis();
  const [stats, setStats] = useState({ recordings: 0, journals: 0, brainDumps: 0 });
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Load stats on mount
  useEffect(() => {
    const recordings = getRecordings();
    const journals = getJournalEntries();
    const brainDumps = getBrainDumps();

    setStats({
      recordings: recordings.length,
      journals: journals.length,
      brainDumps: brainDumps.length,
    });
  }, []);

  const handleAnalyze = async () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setHasAnalyzed(true);
    await analyze();
  };

  const totalEntries = stats.recordings + stats.journals + stats.brainDumps;

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] mb-1" style={{ fontFamily: 'Inter_700Bold' }}>
            Pattern Analysis
          </Text>
          <Text className="text-3xl font-bold text-white lowercase" style={{ fontFamily: 'Inter_700Bold' }}>
            insights.ai
          </Text>
        </View>

        {/* Stats Overview - Rocket Money Style */}
        <View className="px-6 mb-8 flex-row gap-4">
          <Card variant="glass" className="flex-1 py-4 items-center border-white/5">
            <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
              {stats.recordings}
            </Text>
            <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter" style={{ fontFamily: 'Inter_700Bold' }}>
              Recordings
            </Text>
          </Card>
          <Card variant="glass" className="flex-1 py-4 items-center border-white/5">
            <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
              {stats.journals}
            </Text>
            <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter" style={{ fontFamily: 'Inter_700Bold' }}>
              Journals
            </Text>
          </Card>
          <Card variant="glass" className="flex-1 py-4 items-center border-white/5">
            <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
              {stats.brainDumps}
            </Text>
            <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter" style={{ fontFamily: 'Inter_700Bold' }}>
              Syntheses
            </Text>
          </Card>
        </View>

        <View className="px-6 pb-20">
          {/* API Key Warning */}
          {!hasApiKey && (
            <Animated.View entering={FadeInDown}>
              <Card variant="glass" className="mb-6 border-amber-500/20 bg-amber-500/5">
                <View className="flex-row items-start">
                  <View className="w-10 h-10 bg-amber-500/10 rounded-full items-center justify-center mr-4">
                    <AlertCircle size={20} color="#f59e0b" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-amber-400 font-bold mb-1" style={{ fontFamily: 'Inter_700Bold' }}>
                      Demo Mode Active
                    </Text>
                    <Text className="text-amber-200/70 text-xs leading-4" style={{ fontFamily: 'Inter_400Regular' }}>
                      Add your Claude API key in Settings to unlock real AI-powered pattern analysis across your life context.
                    </Text>
                  </View>
                </View>
              </Card>
            </Animated.View>
          )}

          {/* Analyze Button */}
          {!hasAnalyzed && !isLoading && (
            <Animated.View entering={FadeInDown.delay(100)}>
              <Button
                onPress={handleAnalyze}
                disabled={totalEntries === 0}
                variant={totalEntries > 0 ? 'primary' : 'secondary'}
                size="lg"
                className="w-full mb-6"
              >
                <View className="flex-row items-center">
                  <Sparkles size={20} color="#ffffff" className="mr-2" />
                  <Text className="text-white font-bold text-base" style={{ fontFamily: 'Inter_700Bold' }}>
                    {totalEntries > 0 ? 'Analyze My Patterns' : 'No Data Yet'}
                  </Text>
                </View>
              </Button>
            </Animated.View>
          )}

          {/* Loading */}
          {isLoading && (
            <Animated.View entering={FadeInDown} className="items-center py-20">
              <View className="w-24 h-24 bg-primary-500/10 rounded-full items-center justify-center mb-6">
                <ActivityIndicator size="large" color="#0ea5e9" />
              </View>
              <Text className="text-white text-xl font-bold mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
                Analyzing Context...
              </Text>
              <Text className="text-slate-400 text-sm text-center max-w-xs" style={{ fontFamily: 'Inter_400Regular' }}>
                Scanning your recordings, journals, and brain dumps for patterns and insights.
              </Text>
            </Animated.View>
          )}

          {/* Error */}
          {error && (
            <Animated.View entering={FadeInDown}>
              <Card variant="glass" className="mb-6 border-red-500/20 bg-red-500/5">
                <View className="flex-row items-start">
                  <View className="w-10 h-10 bg-red-500/10 rounded-full items-center justify-center mr-4">
                    <AlertCircle size={20} color="#ef4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-red-400 font-bold mb-1" style={{ fontFamily: 'Inter_700Bold' }}>
                      Analysis Failed
                    </Text>
                    <Text className="text-red-200/70 text-xs leading-4" style={{ fontFamily: 'Inter_400Regular' }}>
                      {error}
                    </Text>
                  </View>
                </View>
              </Card>
            </Animated.View>
          )}

          {/* Patterns */}
          {patterns.length > 0 && (
            <View>
              <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4" style={{ fontFamily: 'Inter_700Bold' }}>
                Discovered Patterns
              </Text>
              {patterns.map((pattern, index) => (
                <PatternCard key={index} pattern={pattern} index={index} />
              ))}
            </View>
          )}

          {/* Empty State - No Patterns Found */}
          {hasAnalyzed && !isLoading && patterns.length === 0 && (
            <Animated.View entering={FadeInDown}>
              <Card variant="glass" className="items-center py-12 border-white/5">
                <View className="w-20 h-20 bg-slate-900 rounded-full items-center justify-center mb-6">
                  <TrendingUp size={40} color="#94a3b8" />
                </View>
                <Text className="text-white font-bold text-xl mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
                  No Patterns Yet
                </Text>
                <Text className="text-slate-400 text-sm text-center max-w-xs leading-5" style={{ fontFamily: 'Inter_400Regular' }}>
                  Keep capturing your thoughts. Patterns emerge as you build your life context archive.
                </Text>
              </Card>
            </Animated.View>
          )}

          {/* Initial Empty State */}
          {!hasAnalyzed && !isLoading && totalEntries === 0 && (
            <Animated.View entering={FadeInDown}>
              <Card variant="glass" className="items-center py-12 border-white/5">
                <View className="w-20 h-20 bg-slate-900 rounded-full items-center justify-center mb-6">
                  <Brain size={40} color="#94a3b8" />
                </View>
                <Text className="text-white font-bold text-xl mb-2 text-center" style={{ fontFamily: 'Inter_700Bold' }}>
                  Build Your Context First
                </Text>
                <Text className="text-slate-400 text-sm text-center max-w-xs leading-5" style={{ fontFamily: 'Inter_400Regular' }}>
                  Start recording thoughts, journaling daily, or creating brain dumps. We'll analyze patterns as your archive grows.
                </Text>
              </Card>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Pattern Card Component
function PatternCard({ pattern, index }: { pattern: AnalysisPattern; index: number }) {
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'health': return '❤️';
      case 'career': return '💼';
      case 'relationships': return '👥';
      case 'personal-growth': return '🌱';
      case 'productivity': return '⚡';
      default: return '💡';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#10b981';
    if (confidence >= 0.6) return '#f59e0b';
    return '#f97316';
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      layout={Layout.springify()}
    >
      <TouchableOpacity activeOpacity={0.9} className="mb-4">
        <Card variant="glass" className="border-white/5">
          {/* Header */}
          <View className="flex-row items-start mb-3">
            <View className="w-12 h-12 bg-white/5 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">{getCategoryEmoji(pattern.category)}</Text>
            </View>
            <View className="flex-1 mr-2">
              <Text className="text-white font-bold text-base mb-1" style={{ fontFamily: 'Inter_700Bold' }}>
                {pattern.pattern}
              </Text>
              <View className="flex-row items-center">
                <View
                  className="px-2 py-0.5 rounded-md mr-2"
                  style={{ backgroundColor: `${getConfidenceColor(pattern.confidence)}20` }}
                >
                  <Text
                    className="text-[10px] font-bold uppercase"
                    style={{
                      fontFamily: 'Inter_700Bold',
                      color: getConfidenceColor(pattern.confidence)
                    }}
                  >
                    {Math.round(pattern.confidence * 100)}% Confident
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text className="text-slate-300 text-sm leading-6 mb-4" style={{ fontFamily: 'Inter_400Regular' }}>
            {pattern.description}
          </Text>

          {/* Recommendation */}
          <View className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3">
            <View className="flex-row items-start">
              <Lightbulb size={14} color="#0ea5e9" className="mr-2 mt-0.5" />
              <Text className="text-primary-400 text-xs flex-1 leading-5" style={{ fontFamily: 'Inter_400Regular' }}>
                {pattern.recommendation}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}
