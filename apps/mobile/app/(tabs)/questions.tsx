/**
 * Questions Screen - Main screen for viewing question categories
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { HelpCircle, Plus, TrendingUp } from 'lucide-react-native';
import { Card } from '../../src/components/ui';
import { CategoriesGrid } from '../../src/components/questions/CategoriesGrid';
import * as questions from '../../src/lib/questions';

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function QuestionsScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<questions.QuestionCategory[]>([]);
  const [progressMap, setProgressMap] = useState<Map<string, questions.CategoryProgress>>(new Map());
  const [overallProgress, setOverallProgress] = useState({ total: 0, answered: 0, percentage: 0 });

  const loadData = useCallback(() => {
    const cats = questions.getCategories();
    setCategories(cats);

    const progress = questions.getAllCategoryProgress();
    const map = new Map<string, questions.CategoryProgress>();
    progress.forEach(p => map.set(p.categoryId, p));
    setProgressMap(map);

    setOverallProgress(questions.getOverallProgress());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddQuestion = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Open create question bottom sheet
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
              Life Questions
            </Text>
            <Text className="text-slate-400 text-sm mt-1" style={{ fontFamily: 'Inter_400Regular' }}>
              Build your personal context
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleAddQuestion}
            className="w-10 h-10 bg-primary-500/20 rounded-full items-center justify-center"
          >
            <Plus size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Overall Progress Card */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify().damping(15)}
          className="px-6 mb-6"
        >
          <Card variant="glass" className="border-primary-500/20">
            <View className="flex-row items-center">
              <View className="w-14 h-14 rounded-2xl bg-primary-500/20 items-center justify-center">
                <TrendingUp size={28} color="#3b82f6" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
                  {overallProgress.percentage}% Complete
                </Text>
                <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
                  {overallProgress.answered} of {overallProgress.total} questions answered
                </Text>
              </View>
            </View>
            
            {/* Progress Bar */}
            <View className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
              <View 
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${overallProgress.percentage}%` }}
              />
            </View>
          </Card>
        </Animated.View>

        {/* Section Header */}
        <View className="px-6 mb-4 flex-row items-center">
          <HelpCircle size={18} color="#94a3b8" />
          <Text className="text-slate-400 text-sm ml-2" style={{ fontFamily: 'Inter_600SemiBold' }}>
            CATEGORIES
          </Text>
        </View>

        {/* Categories Grid */}
        <CategoriesGrid 
          categories={categories} 
          progressMap={progressMap}
        />

        {/* Suggested Question */}
        <Animated.View
          entering={FadeInDown.delay(500).springify().damping(15)}
          className="px-6 mt-8"
        >
          <Text className="text-slate-400 text-sm mb-3" style={{ fontFamily: 'Inter_600SemiBold' }}>
            SUGGESTED QUESTION
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/recording')}
          >
            <Card variant="glass" className="border-amber-500/20 bg-amber-500/5">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-xl bg-amber-500/20 items-center justify-center">
                  <HelpCircle size={24} color="#f59e0b" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-white font-medium" style={{ fontFamily: 'Inter_600SemiBold' }}>
                    How would you describe yourself in three words?
                  </Text>
                  <Text className="text-slate-400 text-sm mt-1" style={{ fontFamily: 'Inter_400Regular' }}>
                    Tap to record your answer
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
