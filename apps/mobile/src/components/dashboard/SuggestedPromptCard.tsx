import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MessageCircle, ChevronRight } from 'lucide-react-native';
import { Card } from '../ui';

const prompts = [
  "What's on your mind right now?",
  'What made you smile today?',
  'What are you grateful for?',
  "What's something you learned recently?",
  'Describe your ideal day.',
  "What's a challenge you're facing?",
  "What's something you're looking forward to?",
];

function getTodayPrompt(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return prompts[dayOfYear % prompts.length];
}

interface SuggestedPromptCardProps {
  onPress: () => void;
  delay?: number;
}

export function SuggestedPromptCard({ onPress, delay = 0 }: SuggestedPromptCardProps) {
  const prompt = getTodayPrompt();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(15)}
      className="px-6 mt-2 mb-6"
    >
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <Card variant="glass" className="border-blue-500/30 bg-blue-500/5">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-blue-500/20 items-center justify-center">
              <MessageCircle size={24} color="#3b82f6" />
            </View>
            <View className="flex-1 ml-4">
              <Text
                className="text-white font-semibold"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Suggested Question
              </Text>
              <Text
                className="text-slate-400 text-sm mt-0.5"
                style={{ fontFamily: 'Inter_400Regular' }}
              >
                "{prompt}"
              </Text>
            </View>
            <ChevronRight size={20} color="#60a5fa" />
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}
