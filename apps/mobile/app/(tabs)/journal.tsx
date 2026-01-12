import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

type Mood = 'great' | 'good' | 'okay' | 'low' | 'bad';

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'low', emoji: '😔', label: 'Low' },
  { value: 'bad', emoji: '😢', label: 'Bad' },
];

export default function JournalScreen() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleMoodSelect = (selectedMood: Mood) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMood(selectedMood);
  };

  const handleSave = async () => {
    if (!content.trim() && !mood) return;

    setIsSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // TODO: Save journal entry to storage
    await new Promise((r) => setTimeout(r, 500));

    setContent('');
    setMood(null);
    setIsSaving(false);
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView className="flex-1 bg-dark-background" edges={['top']}>
      <ScrollView className="flex-1 p-4" keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-white">Journal</Text>
          <Text className="text-dark-text-secondary mt-1">{today}</Text>
        </View>

        {/* Mood Selector */}
        <View className="bg-dark-surface rounded-2xl p-5 border border-dark-border mb-4">
          <Text className="text-white font-semibold mb-4">How are you feeling?</Text>
          <View className="flex-row justify-between">
            {MOODS.map((m) => (
              <Pressable
                key={m.value}
                onPress={() => handleMoodSelect(m.value)}
                className={`items-center p-3 rounded-xl ${
                  mood === m.value
                    ? 'bg-brand-500/20 border border-brand-500'
                    : 'active:bg-dark-border'
                }`}
              >
                <Text className="text-3xl mb-1">{m.emoji}</Text>
                <Text
                  className={`text-xs ${
                    mood === m.value ? 'text-brand-400' : 'text-dark-text-secondary'
                  }`}
                >
                  {m.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Journal Entry */}
        <View className="bg-dark-surface rounded-2xl p-5 border border-dark-border mb-4">
          <Text className="text-white font-semibold mb-3">What's on your mind?</Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Write your thoughts..."
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            className="text-white text-base leading-6 min-h-[200px]"
          />
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={(!content.trim() && !mood) || isSaving}
          className={`py-4 rounded-xl ${
            content.trim() || mood
              ? 'bg-brand-500 active:opacity-80'
              : 'bg-dark-border opacity-50'
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isSaving ? 'Saving...' : 'Save Entry'}
          </Text>
        </Pressable>

        {/* Recent Entries Placeholder */}
        <View className="mt-8 mb-4">
          <Text className="text-dark-text-secondary text-sm uppercase tracking-wide mb-4">
            Recent Entries
          </Text>
          <View className="bg-dark-surface rounded-xl p-4 border border-dark-border">
            <Text className="text-dark-text-secondary text-center py-4">
              Your journal entries will appear here
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
