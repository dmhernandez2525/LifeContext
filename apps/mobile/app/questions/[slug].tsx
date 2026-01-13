/**
 * Category Detail Screen - Shows questions in a specific category
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Platform, FlatList, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { 
  ChevronLeft, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Mic,
  User,
  Heart,
  Users,
  Briefcase,
  Image,
  Target,
  Activity,
  Star,
  LucideIcon,
} from 'lucide-react-native';
import { Card } from '../../src/components/ui';
import * as questions from '../../src/lib/questions';
import { Type, X } from 'lucide-react-native';

// ============================================================
// ICON MAP
// ============================================================

const ICON_MAP: Record<string, LucideIcon> = {
  user: User,
  heart: Heart,
  users: Users,
  briefcase: Briefcase,
  image: Image,
  target: Target,
  activity: Activity,
  star: Star,
};

// ============================================================
// QUESTION ITEM
// ============================================================

interface QuestionItemProps {
  question: questions.Question;
  isAnswered: boolean;
  color: string;
  index: number;
  onPress: () => void;
  onLongPress?: () => void;
}

function QuestionItem({ question, isAnswered, color, index, onPress, onLongPress }: QuestionItemProps) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const handleLongPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onLongPress?.();
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify().damping(15)}
    >
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Status Icon */}
        <View style={{ marginRight: 12, marginTop: 2 }}>
          {isAnswered ? (
            <CheckCircle2 size={20} color={color} />
          ) : (
            <Circle size={20} color="#475569" />
          )}
        </View>

        {/* Question Text */}
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Inter_400Regular',
              color: isAnswered ? '#94a3b8' : '#f8fafc',
              lineHeight: 22,
              textDecorationLine: isAnswered ? 'line-through' : 'none',
            }}
          >
            {question.text}
          </Text>
          {question.isStarter && (
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'Inter_400Regular',
                color: '#64748b',
                marginTop: 4,
              }}
            >
              Starter question
            </Text>
          )}
        </View>

        {/* Record Button */}
        {!isAnswered && (
          <TouchableOpacity
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: `${color}20`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handlePress}
          >
            <Mic size={16} color={color} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function CategoryDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [category, setCategory] = useState<questions.QuestionCategory | null>(null);
  const [categoryQuestions, setCategoryQuestions] = useState<questions.Question[]>([]);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState({ total: 0, answered: 0, percentage: 0 });
  const [selectedQuestion, setSelectedQuestion] = useState<questions.Question | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);

  const loadData = useCallback(() => {
    if (!slug) return;
    
    const cat = questions.getCategoryBySlug(slug);
    if (cat) {
      setCategory(cat);
      const qs = questions.getQuestionsByCategory(cat.id);
      setCategoryQuestions(qs);
      
      const answered = questions.getAnsweredQuestionIds();
      setAnsweredIds(answered);
      
      setProgress(questions.getCategoryProgress(cat.id));
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleQuestionPress = (question: questions.Question) => {
    setSelectedQuestion(question);
    setShowChoiceModal(true);
  };

  const handleVoiceAnswer = () => {
    setShowChoiceModal(false);
    if (selectedQuestion) {
      router.push({
        pathname: '/recording',
        params: { questionId: selectedQuestion.id, questionText: selectedQuestion.text },
      });
    }
  };

  const handleTextAnswerChoice = () => {
    setShowChoiceModal(false);
    setShowTextModal(true);
  };

  const handleSaveTextAnswer = () => {
    if (!answerText.trim()) {
      Alert.alert('Required', 'Please enter your answer.');
      return;
    }
    if (selectedQuestion) {
      questions.markQuestionAnswered(selectedQuestion.id);
      loadData();
      setShowTextModal(false);
      setAnswerText('');
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleMarkAsAnswered = (question: questions.Question) => {
    Alert.alert(
      'Mark as Answered',
      `Mark "${question.text.slice(0, 50)}..." as answered externally?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Done', 
          onPress: () => {
            questions.markQuestionAnswered(question.id);
            loadData();
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  };

  const handleAddQuestion = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Open add question bottom sheet
  };

  if (!category) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center">
        <Text className="text-slate-400">Loading...</Text>
      </SafeAreaView>
    );
  }

  const IconComponent = ICON_MAP[category.icon] || User;

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: category.name,
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#f8fafc',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
              <ChevronLeft size={24} color="#f8fafc" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleAddQuestion}>
              <Plus size={24} color="#3b82f6" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <SafeAreaView className="flex-1 bg-slate-950" edges={['bottom']}>
        {/* Header Card */}
        <Animated.View
          entering={FadeInDown.delay(100).springify().damping(15)}
          className="px-6 py-4"
        >
          <Card variant="glass" className="border-white/5">
            <View className="flex-row items-center">
              <View 
                className="w-14 h-14 rounded-2xl items-center justify-center"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <IconComponent size={28} color={category.color} />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
                  {category.name}
                </Text>
                <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
                  {category.description}
                </Text>
              </View>
            </View>
            
            {/* Progress */}
            <View className="mt-4 flex-row items-center">
              <View className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden mr-3">
                <View 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${progress.percentage}%`,
                    backgroundColor: category.color,
                  }}
                />
              </View>
              <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_600SemiBold' }}>
                {progress.answered}/{progress.total}
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Questions List */}
        <FlatList
          data={categoryQuestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <QuestionItem
              question={item}
              isAnswered={answeredIds.has(item.id)}
              color={category.color}
              index={index}
              onPress={() => handleQuestionPress(item)}
              onLongPress={() => handleMarkAsAnswered(item)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="px-6 py-12 items-center">
              <Text className="text-slate-400 text-center" style={{ fontFamily: 'Inter_400Regular' }}>
                No questions in this category yet.
              </Text>
              <TouchableOpacity
                onPress={handleAddQuestion}
                className="mt-4 px-4 py-2 bg-primary-500/20 rounded-full"
              >
                <Text className="text-primary-400" style={{ fontFamily: 'Inter_600SemiBold' }}>
                  Add a question
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      </SafeAreaView>

      {/* Choice Modal - Voice or Text */}
      <Modal visible={showChoiceModal} transparent animationType="fade" onRequestClose={() => setShowChoiceModal(false)}>
        <View className="flex-1 bg-black/80 justify-center items-center px-6">
          <View className="bg-slate-900 rounded-2xl p-6 w-full max-w-sm border border-white/10">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-bold text-lg">Answer Method</Text>
              <TouchableOpacity onPress={() => setShowChoiceModal(false)}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Text className="text-slate-400 text-sm mb-6">{selectedQuestion?.text}</Text>
            
            <TouchableOpacity 
              onPress={handleVoiceAnswer}
              className="flex-row items-center bg-blue-600/20 border border-blue-500/30 rounded-xl p-4 mb-3"
            >
              <View className="w-10 h-10 bg-blue-500/20 rounded-full items-center justify-center mr-3">
                <Mic size={20} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">Voice Recording</Text>
                <Text className="text-slate-400 text-xs">Speak naturally, we'll transcribe</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleTextAnswerChoice}
              className="flex-row items-center bg-purple-600/20 border border-purple-500/30 rounded-xl p-4"
            >
              <View className="w-10 h-10 bg-purple-500/20 rounded-full items-center justify-center mr-3">
                <Type size={20} color="#a855f7" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">Text Answer</Text>
                <Text className="text-slate-400 text-xs">Type your response</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Text Answer Modal */}
      <Modal visible={showTextModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowTextModal(false)}>
        <View className="flex-1 bg-slate-950 p-6">
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={() => setShowTextModal(false)}>
              <Text className="text-slate-400 font-medium">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-white font-bold text-lg">Answer</Text>
            <TouchableOpacity onPress={handleSaveTextAnswer}>
              <Text className="text-blue-400 font-bold">Save</Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-slate-900/50 rounded-xl p-4 mb-6 border border-white/5">
            <Text className="text-white font-medium text-base">{selectedQuestion?.text}</Text>
          </View>
          
          <TextInput
            value={answerText}
            onChangeText={setAnswerText}
            placeholder="Type your answer here..."
            placeholderTextColor="#64748b"
            multiline
            autoFocus
            className="bg-slate-900 text-white text-base p-4 rounded-xl border border-white/10 min-h-[200px]"
            textAlignVertical="top"
          />
        </View>
      </Modal>
    </>
  );
}

