/**
 * Brain Dump Screen - Premium Rocket Money inspired aesthetic
 * Stage-based flow: Topics -> Dump -> Synthesis
 */
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Brain, Sparkles, Plus, RotateCcw, Hash, CheckCircle2, Lightbulb, HelpCircle } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, Layout } from 'react-native-reanimated';
import { saveBrainDump, StoredBrainDump } from '../../src/lib/storage';
import { Card, Button, Badge } from '../../src/components/ui';

type Stage = 'topics' | 'dump' | 'processing' | 'synthesis';

export default function BrainDumpScreen() {
  const [stage, setStage] = useState<Stage>('topics');
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [content, setContent] = useState('');
  const [synthesis, setSynthesis] = useState<StoredBrainDump['synthesis'] | null>(null);

  const handleAddTopic = () => {
    const trimmed = topicInput.trim();
    if (trimmed && !topics.includes(trimmed)) {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTopics([...topics, trimmed]);
      setTopicInput('');
    }
  };

  const handleStartDump = () => {
    if (topics.length === 0) {
      Alert.alert('Topics Required', 'Add at least one anchor topic to guide your thoughts.');
      return;
    }
    setStage('dump');
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleProcess = async () => {
    if (!content.trim()) return;

    setStage('processing');
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Mock AI Processing (Matching storage types)
    setTimeout(async () => {
      const mockSynthesisResult: NonNullable<StoredBrainDump['synthesis']> = {
        organizedContent: "Regarding " + topics.join(', ') + ":\n\n" + content.split('.').map(s => s.trim()).filter(Boolean).join('\n\n• '),
        insights: [
          "Connection identified between your initial thoughts and " + topics[0],
          "Potential growth area in " + (topics[1] || "current focus")
        ],
        questions: [
          "How does this align with your long-term vision?",
          "What is the single most important next step for " + topics[0] + "?"
        ],
        contradictions: []
      };

      try {
        await saveBrainDump({
          bulletPoints: topics,
          transcription: content,
          synthesis: mockSynthesisResult
        });
        setSynthesis(mockSynthesisResult);
        setStage('synthesis');
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        Alert.alert('Error', 'Failed to secure your brain dump locally.');
        setStage('dump');
      }
    }, 3000);
  };

  const handleReset = () => {
    setStage('topics');
    setTopics([]);
    setContent('');
    setSynthesis(null);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <View className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="mb-8 flex-row justify-between items-center">
          <View>
            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] mb-1" style={{ fontFamily: 'Inter_700Bold' }}>
              Strategic Output
            </Text>
            <Text className="text-3xl font-bold text-white lowercase" style={{ fontFamily: 'Inter_700Bold' }}>
              brain.dump
            </Text>
          </View>
          <View className="bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
            <Text className="text-primary-400 text-[10px] font-bold uppercase" style={{ fontFamily: 'Inter_700Bold' }}>
              {stage}
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Topics Stage */}
          {stage === 'topics' && (
            <Animated.View entering={FadeInDown} exiting={FadeOut}>
              <Text className="text-white text-xl font-bold mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
                Anchor your thoughts.
              </Text>
              <Text className="text-slate-400 text-sm mb-8 leading-5" style={{ fontFamily: 'Inter_400Regular' }}>
                What areas are on your mind? We'll use these as pillars for the synthesis.
              </Text>

              <Card variant="glass" className="mb-6 p-1">
                <View className="flex-row items-center px-4 py-2">
                  <Hash size={18} color="#475569" strokeWidth={3} />
                  <TextInput
                    value={topicInput}
                    onChangeText={setTopicInput}
                    placeholder="E.g., Career, Health, Project X"
                    placeholderTextColor="#475569"
                    onSubmitEditing={handleAddTopic}
                    className="flex-1 text-white text-base ml-3 py-2"
                    style={{ fontFamily: 'Inter_400Regular' }}
                  />
                  <TouchableOpacity onPress={handleAddTopic} className="bg-white/5 p-2 rounded-xl">
                    <Plus size={20} color="#0ea5e9" />
                  </TouchableOpacity>
                </View>
              </Card>

              <View className="flex-row flex-wrap gap-2 mb-10">
                {topics.map((t, i) => (
                  <Animated.View key={t} entering={FadeIn.delay(i * 100)}>
                    <Badge variant="primary" size="md">
                      {t}
                    </Badge>
                  </Animated.View>
                ))}
              </View>

              <Button
                onPress={handleStartDump}
                variant="primary"
                size="lg"
                className="w-full"
                disabled={topics.length === 0}
              >
                Proceed to Synthesis
              </Button>
            </Animated.View>
          )}

          {/* Dump Stage */}
          {stage === 'dump' && (
            <Animated.View entering={FadeInDown} exiting={FadeOut}>
              <View className="flex-row items-center mb-6">
                <Brain size={24} color="#0ea5e9" className="mr-3" />
                <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
                  Unload everything.
                </Text>
              </View>

              <Card variant="glass" className="mb-8 min-h-[300px] border-white/5">
                <TextInput
                  value={content}
                  onChangeText={setContent}
                  placeholder="Stream of consciousness... don't filter. We'll organize it for you."
                  placeholderTextColor="#475569"
                  multiline
                  autoFocus
                  className="text-white text-lg leading-7 flex-1"
                  style={{ fontFamily: 'Inter_400Regular' }}
                  textAlignVertical="top"
                />
              </Card>

              <View className="flex-row gap-4">
                <TouchableOpacity 
                  onPress={() => setStage('topics')}
                  className="flex-1 bg-slate-900 h-14 rounded-2xl items-center justify-center border border-white/5"
                >
                  <Text className="text-slate-400 font-bold" style={{ fontFamily: 'Inter_700Bold' }}>Edit Pillars</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleProcess}
                  disabled={!content.trim()}
                  className={`flex-[2] h-14 rounded-2xl items-center justify-center shadow-xl ${
                    content.trim() ? 'bg-primary-500 shadow-primary-500/30' : 'bg-slate-800 opacity-50'
                  }`}
                >
                  <View className="flex-row items-center">
                    <Sparkles size={18} color="#ffffff" className="mr-2" />
                    <Text className="text-white font-bold" style={{ fontFamily: 'Inter_700Bold' }}>Synthesize</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Processing Stage */}
          {stage === 'processing' && (
            <Animated.View entering={FadeIn} className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#0ea5e9" />
              <Text className="text-white text-2xl font-bold mt-8 mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
                Thinking...
              </Text>
              <Text className="text-slate-500 text-center max-w-xs leading-5" style={{ fontFamily: 'Inter_400Regular' }}>
                Organizing your thoughts into strategic themes and actionable insights.
              </Text>
            </Animated.View>
          )}

          {/* Synthesis Stage */}
          {stage === 'synthesis' && synthesis && (
            <Animated.View entering={FadeInDown} layout={Layout.springify()}>
              <View className="flex-row items-center mb-6">
                <CheckCircle2 size={24} color="#10b981" className="mr-3" />
                <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
                  Synthesis Complete
                </Text>
              </View>

              <Card variant="glass" className="mb-6 border-white/5">
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3" style={{ fontFamily: 'Inter_700Bold' }}>
                  Organized Outputs
                </Text>
                <Text className="text-slate-300 text-sm leading-7" style={{ fontFamily: 'Inter_400Regular' }}>
                  • {synthesis.organizedContent}
                </Text>
              </Card>

              <View className="flex-row gap-4 mb-8">
                <Card variant="glass" className="flex-1 border-white/5 p-4">
                   <View className="flex-row items-center mb-2">
                     <Lightbulb size={12} color="#f59e0b" className="mr-1" />
                     <Text className="text-amber-500 text-[10px] font-bold uppercase" style={{ fontFamily: 'Inter_700Bold' }}>Insights</Text>
                   </View>
                   {synthesis.insights.map((item, i) => (
                     <Text key={i} className="text-white text-[11px] mb-2 leading-4" style={{ fontFamily: 'Inter_400Regular' }}>• {item}</Text>
                   ))}
                </Card>
                <Card variant="glass" className="flex-1 border-white/5 p-4">
                   <View className="flex-row items-center mb-2">
                     <HelpCircle size={12} color="#8b5cf6" className="mr-1" />
                     <Text className="text-purple-500 text-[10px] font-bold uppercase" style={{ fontFamily: 'Inter_700Bold' }}>Questions</Text>
                   </View>
                   {synthesis.questions.map((item, i) => (
                     <Text key={i} className="text-white text-[11px] mb-2 leading-4" style={{ fontFamily: 'Inter_400Regular' }}>• {item}</Text>
                   ))}
                </Card>
              </View>

              <Button
                onPress={handleReset}
                variant="primary"
                size="lg"
                className="w-full"
              >
                <View className="flex-row items-center">
                  <RotateCcw size={18} color="#ffffff" className="mr-2" />
                  <Text className="text-white font-bold" style={{ fontFamily: 'Inter_700Bold' }}>New Brain Dump</Text>
                </View>
              </Button>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

