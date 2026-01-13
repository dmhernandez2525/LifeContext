/**
 * Journal Screen - Premium Rocket Money inspired aesthetic
 */
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Platform, Modal } from 'react-native';

import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Calendar, Tag, Heart, Plus, ChevronRight, Clock, MessageSquare } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';
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
  const [isSaving, setIsSaving] = useState(false);
  const [entries, setEntries] = useState<StoredJournalEntry[]>([]);
  const [showEditor, setShowEditor] = useState(false);

  // Load entries on mount
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = useCallback(() => {
    const allEntries = getJournalEntries();
    // Sort by date, newest first
    allEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setEntries(allEntries);
  }, []);

  const handleMoodSelect = (selectedMood: Mood) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMood(mood === selectedMood ? null : selectedMood);
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

      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Reset form
      setContent('');
      setMood(null);
      setShowEditor(false);

      // Reload entries
      loadEntries();
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      Alert.alert('Error', 'Failed to secure your journal entry locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
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
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6 flex-row justify-between items-end">
          <View>
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1" style={{ fontFamily: 'Inter_700Bold' }}>
              {today}
            </Text>
            <Text className="text-3xl font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
              Journal
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => {
              setShowEditor(true);
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            className="w-12 h-12 bg-primary-500 rounded-2xl items-center justify-center shadow-lg shadow-primary-500/30"
          >
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Stats Summary (Rocket Money style) */}
        <View className="px-6 mb-8 flex-row gap-4">
          <Card variant="glass" className="flex-1 py-4 items-center">
            <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
              {entries.length}
            </Text>
            <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter" style={{ fontFamily: 'Inter_700Bold' }}>
              Total Entries
            </Text>
          </Card>
          <Card variant="glass" className="flex-1 py-4 items-center">
            <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
              {entries.filter(e => new Date(e.createdAt).getMonth() === new Date().getMonth()).length}
            </Text>
            <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter" style={{ fontFamily: 'Inter_700Bold' }}>
              This Month
            </Text>
          </Card>
        </View>

        {/* Recent Entries List */}
        <View className="px-6 pb-20">
          <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4" style={{ fontFamily: 'Inter_700Bold' }}>
            History
          </Text>

          {entries.length === 0 ? (
            <View className="items-center py-20 opacity-30">
              <MessageSquare size={64} color="#94a3b8" strokeWidth={1} />
              <Text className="text-white font-bold mt-4" style={{ fontFamily: 'Inter_700Bold' }}>No entries yet</Text>
              <Text className="text-slate-400 text-xs mt-1" style={{ fontFamily: 'Inter_400Regular' }}>Capture your first thought today.</Text>
            </View>
          ) : (
            entries.map((entry, index) => (
              <Animated.View 
                key={entry.id} 
                entering={FadeInDown.delay(index * 50)}
                layout={Layout.springify()}
              >
                <TouchableOpacity activeOpacity={0.9} className="mb-4">
                  <Card 
                    variant="glass" 
                    className="flex-row items-center border-white/5"
                    style={{ 
                      borderLeftWidth: 3, 
                      borderLeftColor: getMoodColor(entry.mood) 
                    }}
                  >
                    <View className="w-10 h-10 rounded-full bg-white/5 items-center justify-center mr-4">
                      <Text className="text-xl">{getMoodEmoji(entry.mood)}</Text>
                    </View>
                    <View className="flex-1 mr-2">
                      <Text className="text-white text-sm font-semibold mb-1" numberOfLines={1} style={{ fontFamily: 'Inter_600SemiBold' }}>
                        {entry.content || 'Untitled Entry'}
                      </Text>
                      <View className="flex-row items-center opacity-60">
                        <Clock size={10} color="#94a3b8" />
                        <Text className="text-slate-400 text-[10px] ml-1" style={{ fontFamily: 'Inter_400Regular' }}>
                          {formatEntryDate(entry.createdAt)} · {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={16} color="#475569" />
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modern Editor Modal */}
      <Modal visible={showEditor} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowEditor(false)}>
        <View className="flex-1 bg-slate-950">
          <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/5">
            <TouchableOpacity onPress={() => setShowEditor(false)}>
              <Text className="text-slate-400 text-base" style={{ fontFamily: 'Inter_400Regular' }}>Cancel</Text>
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Inter_700Bold' }}>Daily Context</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text className="text-primary-400 text-base font-bold" style={{ fontFamily: 'Inter_700Bold' }}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6 py-8" keyboardShouldPersistTaps="handled">
            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4" style={{ fontFamily: 'Inter_700Bold' }}>
              How are you feeling?
            </Text>
            <View className="flex-row justify-between mb-8">
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={m.value}
                  onPress={() => handleMoodSelect(m.value)}
                  className={`items-center px-2 py-3 rounded-2xl flex-1 mx-1 border ${
                    mood === m.value ? 'bg-primary-500/20 border-primary-500' : 'bg-white/5 border-white/5'
                  }`}
                >
                  <Text className="text-2xl mb-1">{m.emoji}</Text>
                  <Text className={`text-[10px] font-bold uppercase ${mood === m.value ? 'text-primary-400' : 'text-slate-500'}`} style={{ fontFamily: 'Inter_700Bold' }}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4" style={{ fontFamily: 'Inter_700Bold' }}>
              Your Thoughts
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Start describing your day..."
              placeholderTextColor="#475569"
              multiline
              autoFocus
              className="text-white text-lg leading-7 min-h-[300px]"
              style={{ fontFamily: 'Inter_400Regular' }}
              textAlignVertical="top"
            />
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

