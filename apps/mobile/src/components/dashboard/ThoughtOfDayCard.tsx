import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Quote } from 'lucide-react-native';

const quotes = [
  {
    text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
    author: 'Chinese Proverb',
  },
  {
    text: 'Your life is your story. Write well. Edit often.',
    author: 'Susan Statham',
  },
  {
    text: 'In the middle of difficulty lies opportunity.',
    author: 'Albert Einstein',
  },
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
  {
    text: 'What we think, we become.',
    author: 'Buddha',
  },
  {
    text: 'The unexamined life is not worth living.',
    author: 'Socrates',
  },
  {
    text: 'Every moment is a fresh beginning.',
    author: 'T.S. Eliot',
  },
];

function getTodayQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return quotes[dayOfYear % quotes.length];
}

interface ThoughtOfDayCardProps {
  delay?: number;
}

export function ThoughtOfDayCard({ delay = 0 }: ThoughtOfDayCardProps) {
  const quote = getTodayQuote();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(15)}
      className="px-6 mb-6"
    >
      <View className="bg-indigo-900/40 rounded-2xl p-5 border border-indigo-500/20">
        <View className="flex-row items-center mb-3">
          <View className="w-8 h-8 bg-indigo-500/20 rounded-full items-center justify-center mr-3">
            <Quote size={16} color="#818cf8" />
          </View>
          <Text
            className="text-indigo-300 text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: 'Inter_700Bold' }}
          >
            Thought of the Day
          </Text>
        </View>
        <Text
          className="text-white/90 text-base leading-6"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          "{quote.text}"
        </Text>
        <Text
          className="text-indigo-400 text-xs mt-2"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          {quote.author}
        </Text>
      </View>
    </Animated.View>
  );
}
