/**
 * Journal Detail Screen - View and edit journal entry
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { 
  ChevronLeft, 
  Edit3, 
  Trash2, 
  Calendar,
  Clock,
  Battery,
  Sparkles,
  Check,
  X,
} from 'lucide-react-native';
import { Card } from '../../src/components/ui';
import * as storage from '../../src/lib/storage';

// ============================================================
// TYPES
// ============================================================

type Mood = 1 | 2 | 3 | 4 | 5;

interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
  mood?: Mood;
  energyLevel?: number;
  mediaType?: 'text' | 'voice' | 'photo' | 'video';
  tags?: string[];
  synthesis?: {
    summary?: string;
    insights?: string[];
    sentiment?: string;
  };
}

// ============================================================
// CONSTANTS
// ============================================================

const MOODS: { value: Mood; emoji: string; label: string; color: string }[] = [
  { value: 5, emoji: '😄', label: 'Great', color: '#10b981' },
  { value: 4, emoji: '🙂', label: 'Good', color: '#3b82f6' },
  { value: 3, emoji: '😐', label: 'Okay', color: '#f59e0b' },
  { value: 2, emoji: '😔', label: 'Low', color: '#f97316' },
  { value: 1, emoji: '😢', label: 'Bad', color: '#ef4444' },
];

// ============================================================
// HELPERS
// ============================================================

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getMoodInfo(mood?: number) {
  if (!mood) return null;
  return MOODS.find(m => m.value === mood);
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    if (id) {
      const entries = storage.getJournalEntries();
      const found = entries.find((e) => e.id === id);
      if (found) {
        setEntry(found as JournalEntry);
        setEditedContent(found.content || '');
      }
    }
  }, [id]);

  const handleDelete = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            if (id) {
              await storage.deleteJournalEntry(id);
              router.back();
            }
          }
        },
      ]
    );
  }, [id, router]);

  const handleSave = useCallback(async () => {
    if (!entry) return;
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    await storage.saveJournalEntry({
      ...entry,
      content: editedContent,
      type: (entry.mediaType === 'voice' ? 'audio' : entry.mediaType) || 'text',
      date: entry.createdAt,
    });
    
    setEntry({ ...entry, content: editedContent });
    setIsEditing(false);
  }, [entry, editedContent]);

  const handleCancelEdit = useCallback(() => {
    setEditedContent(entry?.content || '');
    setIsEditing(false);
  }, [entry]);

  if (!entry) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center">
        <Text className="text-slate-400">Loading...</Text>
      </SafeAreaView>
    );
  }

  const moodInfo = getMoodInfo(entry.mood);

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Journal Entry',
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#f8fafc',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
              <ChevronLeft size={24} color="#f8fafc" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {isEditing ? (
                <>
                  <TouchableOpacity onPress={handleCancelEdit}>
                    <X size={20} color="#ef4444" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSave}>
                    <Check size={20} color="#10b981" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
                    <Edit3 size={20} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDelete}>
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ),
        }}
      />
      
      <SafeAreaView className="flex-1 bg-slate-950" edges={['bottom']}>
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Date & Time */}
          <Animated.View entering={FadeInDown.delay(100).springify().damping(15)}>
            <View className="flex-row items-center gap-4 mb-6">
              <View className="flex-row items-center">
                <Calendar size={14} color="#94a3b8" />
                <Text className="text-slate-400 text-sm ml-2" style={{ fontFamily: 'Inter_400Regular' }}>
                  {formatDate(entry.createdAt)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={14} color="#94a3b8" />
                <Text className="text-slate-400 text-sm ml-2" style={{ fontFamily: 'Inter_400Regular' }}>
                  {formatTime(entry.createdAt)}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Mood & Energy */}
          <Animated.View entering={FadeInDown.delay(150).springify().damping(15)} className="mb-6">
            <View className="flex-row gap-3">
              {moodInfo && (
                <Card variant="glass" className="flex-1 border-white/5">
                  <Text className="text-4xl text-center mb-2">{moodInfo.emoji}</Text>
                  <Text 
                    className="text-center text-sm"
                    style={{ fontFamily: 'Inter_600SemiBold', color: moodInfo.color }}
                  >
                    {moodInfo.label}
                  </Text>
                </Card>
              )}
              
              {entry.energyLevel !== undefined && (
                <Card variant="glass" className="flex-1 border-white/5">
                  <View className="flex-row items-center justify-center mb-2">
                    <Battery size={28} color="#f59e0b" />
                  </View>
                  <Text className="text-center text-sm text-amber-400" style={{ fontFamily: 'Inter_600SemiBold' }}>
                    {entry.energyLevel}% Energy
                  </Text>
                </Card>
              )}
            </View>
          </Animated.View>

          {/* Content */}
          <Animated.View entering={FadeInDown.delay(200).springify().damping(15)}>
            <Card variant="glass" className="border-white/5 mb-6">
              {isEditing ? (
                <TextInput
                  value={editedContent}
                  onChangeText={setEditedContent}
                  multiline
                  className="text-white text-base min-h-[200px]"
                  style={{ fontFamily: 'Inter_400Regular', lineHeight: 24, textAlignVertical: 'top' }}
                  autoFocus
                />
              ) : (
                <Text className="text-white text-base leading-7" style={{ fontFamily: 'Inter_400Regular' }}>
                  {entry.content || 'No content'}
                </Text>
              )}
            </Card>
          </Animated.View>

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <Animated.View entering={FadeInDown.delay(250).springify().damping(15)} className="mb-6">
              <View className="flex-row flex-wrap gap-2">
                {entry.tags.map((tag, i) => (
                  <View key={i} className="px-3 py-1 bg-primary-500/20 rounded-full">
                    <Text className="text-primary-400 text-sm" style={{ fontFamily: 'Inter_600SemiBold' }}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* AI Summary */}
          {entry.synthesis?.summary && (
            <Animated.View entering={FadeInDown.delay(300).springify().damping(15)}>
              <View className="flex-row items-center mb-3">
                <Sparkles size={16} color="#0ea5e9" />
                <Text className="text-slate-400 text-sm ml-2" style={{ fontFamily: 'Inter_600SemiBold' }}>
                  AI INSIGHTS
                </Text>
              </View>
              
              <Card variant="glass" className="border-sky-500/20 bg-sky-500/5">
                <Text className="text-white text-base leading-6" style={{ fontFamily: 'Inter_400Regular' }}>
                  {entry.synthesis.summary}
                </Text>
                
                {entry.synthesis.insights && entry.synthesis.insights.length > 0 && (
                  <View className="mt-4 space-y-2">
                    {entry.synthesis.insights.map((insight, i) => (
                      <View key={i} className="flex-row items-start">
                        <Text className="text-sky-400 mr-2">•</Text>
                        <Text className="text-slate-300 text-sm flex-1" style={{ fontFamily: 'Inter_400Regular' }}>
                          {insight}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
