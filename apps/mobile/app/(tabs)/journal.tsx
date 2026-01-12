/**
 * Journal Screen - Text journal entries with mood tracking
 */
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { saveJournalEntry, getJournalEntries, StoredJournalEntry } from '../../src/lib/storage';

type Mood = 1 | 2 | 3 | 4 | 5;

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 5, emoji: '😄', label: 'Great' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 2, emoji: '😔', label: 'Low' },
  { value: 1, emoji: '😢', label: 'Bad' },
];

export default function JournalScreen() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [entries, setEntries] = useState<StoredJournalEntry[]>([]);
  
  // Load entries on mount
  useEffect(() => {
    loadEntries();
  }, []);
  
  const loadEntries = () => {
    const allEntries = getJournalEntries();
    // Sort by date, newest first
    allEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setEntries(allEntries);
  };
  
  const handleMoodSelect = (selectedMood: Mood) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMood(selectedMood);
  };
  
  const handleSave = async () => {
    if (!content.trim() && !mood) return;
    
    setIsSaving(true);
    
    try {
      await saveJournalEntry({
        type: 'text',
        content: content.trim(),
        mood: mood || undefined,
        date: new Date().toISOString(),
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Reset form
      setContent('');
      setMood(null);
      
      // Reload entries
      loadEntries();
    } catch (error) {
      Alert.alert('Error', 'Failed to save journal entry.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  
  const getMoodEmoji = (moodValue?: number) => {
    const moodItem = MOODS.find(m => m.value === moodValue);
    return moodItem?.emoji || '📝';
  };
  
  const formatEntryDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
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
        
        {/* Recent Entries */}
        <View className="mt-8 mb-4">
          <Text className="text-dark-text-secondary text-sm uppercase tracking-wide mb-4">
            Recent Entries ({entries.length})
          </Text>
          
          {entries.length === 0 ? (
            <View className="bg-dark-surface rounded-xl p-4 border border-dark-border">
              <Text className="text-dark-text-secondary text-center py-4">
                Your journal entries will appear here
              </Text>
            </View>
          ) : (
            entries.slice(0, 5).map((entry) => (
              <View
                key={entry.id}
                className="bg-dark-surface rounded-xl p-4 border border-dark-border mb-3"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Text className="text-xl mr-2">{getMoodEmoji(entry.mood)}</Text>
                    <Text className="text-dark-text-secondary text-xs">
                      {formatEntryDate(entry.createdAt)}
                    </Text>
                  </View>
                </View>
                <Text className="text-white text-sm leading-5" numberOfLines={3}>
                  {entry.content || '(Mood only)'}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
