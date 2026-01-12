import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAppStore, useProgress } from '@lcc/core';

export default function HomeScreen() {
  const router = useRouter();
  const { isInitialized, totalRecordingTime } = useAppStore();
  const { overallProgress } = useProgress();

  const handleBrainDump = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/brain-dump');
  };

  const handleQuickRecord = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/recording');
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  if (!isInitialized) {
    return (
      <SafeAreaView className="flex-1 bg-dark-background">
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-4xl mb-4">🌟</Text>
          <Text className="text-2xl font-bold text-white text-center mb-2">
            Welcome to LifeContext
          </Text>
          <Text className="text-dark-text-secondary text-center mb-8">
            Your private space to capture life's moments, thoughts, and memories.
          </Text>
          <Pressable
            onPress={() => router.push('/onboarding')}
            className="bg-brand-500 px-8 py-4 rounded-2xl active:opacity-80"
          >
            <Text className="text-white font-semibold text-lg">Get Started</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-background" edges={['top']}>
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-white">Hello</Text>
          <Text className="text-dark-text-secondary mt-1">
            What's on your mind today?
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="flex-row gap-3 mb-6">
          <Pressable
            onPress={handleBrainDump}
            className="flex-1 bg-gradient-to-br from-purple-600 to-purple-800 p-5 rounded-2xl active:opacity-90"
            style={{ backgroundColor: '#7c3aed' }}
          >
            <Text className="text-3xl mb-2">🧠</Text>
            <Text className="text-white font-semibold text-lg">Brain Dump</Text>
            <Text className="text-purple-200 text-sm mt-1">
              Speak your thoughts freely
            </Text>
          </Pressable>

          <Pressable
            onPress={handleQuickRecord}
            className="flex-1 bg-dark-surface p-5 rounded-2xl border border-dark-border active:opacity-90"
          >
            <Text className="text-3xl mb-2">🎙️</Text>
            <Text className="text-white font-semibold text-lg">Quick Record</Text>
            <Text className="text-dark-text-secondary text-sm mt-1">
              Capture a moment
            </Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View className="bg-dark-surface rounded-2xl p-5 border border-dark-border mb-6">
          <Text className="text-dark-text-secondary text-sm uppercase tracking-wide mb-4">
            Your Progress
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-white">
                {formatTime(totalRecordingTime)}
              </Text>
              <Text className="text-dark-text-secondary text-xs mt-1">
                Total Recorded
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-brand-400">
                {overallProgress.percentage}%
              </Text>
              <Text className="text-dark-text-secondary text-xs mt-1">
                Life Context
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-400">
                {overallProgress.answeredQuestions}
              </Text>
              <Text className="text-dark-text-secondary text-xs mt-1">
                Questions
              </Text>
            </View>
          </View>
        </View>

        {/* Prompt Card */}
        <View className="bg-dark-surface rounded-2xl p-5 border border-dark-border">
          <View className="flex-row items-center mb-3">
            <Text className="text-xl mr-2">💭</Text>
            <Text className="text-white font-semibold">Today's Prompt</Text>
          </View>
          <Text className="text-dark-text-primary leading-6">
            What's something you're grateful for that happened recently?
          </Text>
          <Pressable
            onPress={handleQuickRecord}
            className="mt-4 bg-dark-border py-3 rounded-xl active:opacity-80"
          >
            <Text className="text-brand-400 text-center font-medium">
              Answer with Voice
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
