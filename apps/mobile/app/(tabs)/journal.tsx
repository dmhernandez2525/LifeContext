/**
 * Journal Screen - Day One aesthetic with mood tracking
 * Enhanced with polished UI matching web design
 */
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Calendar, Tag, Heart } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { saveJournalEntry, getJournalEntries, StoredJournalEntry } from '../../src/lib/storage';
import { Card, Button, Badge } from '../../src/components/ui';

type Mood = 1 | 2 | 3 | 4 | 5;

const MOODS: { value: Mood; emoji: string; label: string; color: string }[] = [
  { value: 5, emoji: '😄', label: 'Great', color: '#10b981' },
  { value: 4, emoji: '🙂', label: 'Good', color: '#3b82f6' },
  { value: 3, emoji: '😐', label: 'Okay', color: '#f59e0b' },
  { value: 2, emoji: '😔', label: 'Low', color: '#f97316' },
  { value: 1, emoji: '😢', label: 'Bad', color: '#ef4444' },
];

export default function JournalScreen() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
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
    if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMood(mood === selectedMood ? null : selectedMood);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTags(tags.filter((t) => t !== tag));
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

      if (Haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Reset form
      setContent('');
      setMood(null);
      setTags([]);

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
    year: 'numeric',
  });

  const getMoodEmoji = (moodValue?: number) => {
    const moodItem = MOODS.find((m) => m.value === moodValue);
    return moodItem?.emoji || '📝';
  };

  const getMoodColor = (moodValue?: number) => {
    const moodItem = MOODS.find((m) => m.value === moodValue);
    return moodItem?.color || '#64748b';
  };

  const formatEntryDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const selectedMoodColor = mood ? getMoodColor(mood) : null;

  return (
    <SafeAreaView className="flex-1 bg-dark-background" edges={['bottom']}>
      <ScrollView className="flex-1 px-6" keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View className="py-6">
          <View className="flex-row items-center mb-2">
            <Calendar size={20} color="#64748b" />
            <Text className="text-dark-text-secondary ml-2">{today}</Text>
          </View>
          <Text className="text-3xl font-bold text-white">New Entry</Text>
        </View>

        {/* Mood Selector */}
        <Card variant="default" className="mb-4">
          <View className="flex-row items-center mb-4">
            <Heart size={18} color="#a855f7" />
            <Text className="text-white font-semibold ml-2">How are you feeling?</Text>
          </View>
          <View className="flex-row justify-between">
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.value}
                onPress={() => handleMoodSelect(m.value)}
                activeOpacity={0.7}
                className={`items-center p-3 rounded-xl flex-1 mx-1 ${
                  mood === m.value ? 'bg-purple-600/20 border-2 border-purple-500' : 'bg-dark-border/30'
                }`}
              >
                <Text className="text-3xl mb-1">{m.emoji}</Text>
                <Text
                  className={`text-xs font-medium ${
                    mood === m.value ? 'text-purple-400' : 'text-dark-text-secondary'
                  }`}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Journal Entry */}
        <Card variant="default" className="mb-4">
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="What's on your mind..."
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={12}
            textAlignVertical="top"
            className="text-white text-base leading-7 min-h-[250px]"
            style={{ fontFamily: 'System' }}
          />
          <View className="mt-2 pt-3 border-t border-dark-border">
            <Text className="text-dark-text-secondary text-xs">
              {content.length > 0 ? `${content.split(/\s+/).length} words` : 'Start writing...'}
            </Text>
          </View>
        </Card>

        {/* Tags */}
        <Card variant="default" className="mb-4">
          <View className="flex-row items-center mb-3">
            <Tag size={16} color="#f59e0b" />
            <Text className="text-white font-semibold text-sm ml-2">Tags</Text>
          </View>

          {/* Tag List */}
          {tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => handleRemoveTag(tag)}
                  activeOpacity={0.7}
                >
                  <Badge variant="yellow" size="md">
                    {tag} ×
                  </Badge>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Tag Input */}
          <View className="flex-row items-center">
            <TextInput
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add a tag..."
              placeholderTextColor="#64748b"
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
              className="flex-1 bg-dark-background border border-dark-border rounded-lg px-3 py-2 text-white text-sm mr-2"
            />
            <TouchableOpacity
              onPress={handleAddTag}
              disabled={!tagInput.trim()}
              className={`px-4 py-2 rounded-lg ${
                tagInput.trim() ? 'bg-yellow-600' : 'bg-dark-border opacity-50'
              }`}
            >
              <Text className="text-white text-sm font-medium">Add</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Save Button */}
        <Button
          onPress={handleSave}
          disabled={(!content.trim() && !mood) || isSaving}
          variant="primary"
          size="lg"
          loading={isSaving}
          className="mb-6"
          style={selectedMoodColor ? { backgroundColor: selectedMoodColor } : {}}
        >
          {isSaving ? 'Saving...' : 'Save Entry'}
        </Button>

        {/* Recent Entries */}
        <View className="mb-8">
          <Text className="text-dark-text-secondary text-sm uppercase tracking-wider mb-4 font-semibold">
            Recent Entries ({entries.length})
          </Text>

          {entries.length === 0 ? (
            <Card variant="default">
              <View className="py-8 items-center">
                <Text className="text-5xl mb-3">📖</Text>
                <Text className="text-dark-text-secondary text-center">
                  Your journal entries will appear here
                </Text>
              </View>
            </Card>
          ) : (
            entries.slice(0, 10).map((entry, index) => (
              <Animated.View key={entry.id} entering={FadeInDown.delay(index * 50)}>
                <Card
                  variant="default"
                  className="mb-3"
                  style={{
                    borderLeftWidth: 4,
                    borderLeftColor: getMoodColor(entry.mood),
                  }}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <Text className="text-2xl mr-2">{getMoodEmoji(entry.mood)}</Text>
                      <View>
                        <Text className="text-dark-text-primary text-sm font-medium">
                          {formatEntryDate(entry.createdAt)}
                        </Text>
                        <Text className="text-dark-text-secondary text-xs">
                          {formatTime(entry.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {entry.content && (
                    <Text className="text-white text-sm leading-6" numberOfLines={3}>
                      {entry.content}
                    </Text>
                  )}
                </Card>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
