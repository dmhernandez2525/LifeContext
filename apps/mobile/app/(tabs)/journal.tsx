/**
 * Journal Screen - Premium Rocket Money inspired aesthetic
 */
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Platform, Modal } from 'react-native';

import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Calendar, Tag, Heart, Plus, ChevronRight, Clock, MessageSquare, Video, Mic, Type, Check } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';
import { saveJournalEntry, getJournalEntries, StoredJournalEntry } from '../../src/lib/storage';
import { Card, Button, Badge } from '../../src/components/ui';
import { VideoRecorder } from '../../src/components/journal/VideoRecorder';
import { useTabBar } from '../../src/context/TabBarContext';

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
  const [mediaType, setMediaType] = useState<'text' | 'video'>('text');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [entries, setEntries] = useState<StoredJournalEntry[]>([]);
  const [showEditor, setShowEditor] = useState(false);

  const { fabActionTrigger } = useTabBar();

  // Load entries on mount
  useEffect(() => {
    loadEntries();
  }, []);

  // Listen for FAB press
  useEffect(() => {
    if (fabActionTrigger > 0) {
      setShowEditor(true);
    }
  }, [fabActionTrigger]);

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
    if (mediaType === 'text' && !content.trim() && !mood) return;
    if (mediaType === 'video' && !videoUri && !mood) return;

    setIsSaving(true);
    try {
      await saveJournalEntry({
        type: mediaType === 'video' ? 'video' : 'text',
        content: content.trim(),
        mood: mood || undefined,
        mediaUri: videoUri || undefined,
        date: new Date().toISOString(),
      });

      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Reset form
      setContent('');
      setMood(null);
      setMediaType('text');
      setVideoUri(null);
      setShowEditor(false);

      // Reload entries
      loadEntries();
    } catch {
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
                      {entry.type === 'video' ? <Video size={20} color="#fff"/> : (
                        <Text className="text-xl">{getMoodEmoji(entry.mood)}</Text>
                      )}
                    </View>
                    <View className="flex-1 mr-2">
                       <Text className="text-white text-sm font-semibold mb-1" numberOfLines={1} style={{ fontFamily: 'Inter_600SemiBold' }}>
                        {entry.type === 'video' ? 'Video Entry' : (entry.content || 'Untitled Entry')}
                      </Text>
                      <View className="flex-row items-center opacity-60">
                         {entry.type === 'video' ? <Video size={10} color="#94a3b8" /> : <Clock size={10} color="#94a3b8" />}
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
         {mediaType === 'video' && !videoUri ? (
             <VideoRecorder 
                onSave={(uri) => {
                    setVideoUri(uri);
                    // videoUri set, now we can go back to implicit "editor" view state but with video set
                }}
                onCancel={() => setMediaType('text')}
             />
         ) : (
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

                {/* Media Type Toggle */}
                <View className="flex-row bg-slate-900 p-1 rounded-xl mb-6 mx-auto w-full max-w-sm">
                    <TouchableOpacity 
                        onPress={() => setMediaType('text')}
                        className={`flex-1 flex-row items-center justify-center py-2 rounded-lg space-x-2 ${mediaType==='text' ? 'bg-slate-800 shadow-sm' : ''}`}
                    >
                        <Type size={16} color={mediaType==='text' ? '#fff' : '#64748b'} />
                        <Text className={`font-bold text-xs ${mediaType==='text' ? 'text-white' : 'text-slate-500'}`}>Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                         onPress={() => {
                            setMediaType('video');
                            setVideoUri(null); // Reset to trigger recorder
                         }}
                        className={`flex-1 flex-row items-center justify-center py-2 rounded-lg space-x-2 ${mediaType==='video' ? 'bg-slate-800 shadow-sm' : ''}`}
                    >
                        <Video size={16} color={mediaType==='video' ? '#fff' : '#64748b'} />
                        <Text className={`font-bold text-xs ${mediaType==='video' ? 'text-white' : 'text-slate-500'}`}>Video</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4" style={{ fontFamily: 'Inter_700Bold' }}>
                    {mediaType === 'video' ? 'Video Entry' : 'Your Thoughts'}
                </Text>
                
                {mediaType === 'text' ? (
                     <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder="Start describing your day..."
                        placeholderTextColor="#475569"
                        multiline
                        className="text-white text-lg leading-7 min-h-[300px]"
                        style={{ fontFamily: 'Inter_400Regular' }}
                        textAlignVertical="top"
                        />
                ) : (
                    <View className="items-center justify-center h-64 bg-slate-900 rounded-2xl border border-white/10 border-dashed">
                        {videoUri ? (
                             <View className="items-center">
                                 <View className="w-16 h-16 bg-primary-500 rounded-full items-center justify-center mb-4">
                                     <Check size={32} color="#fff" />
                                 </View>
                                 <Text className="text-white font-bold mb-2">Video Recorded!</Text>
                                 <TouchableOpacity onPress={() => setVideoUri(null)}>
                                     <Text className="text-primary-400 text-xs">Retake Video</Text>
                                 </TouchableOpacity>
                             </View>
                        ) : (
                            <TouchableOpacity onPress={() => setVideoUri(null)} className="items-center">
                                <Video size={48} color="#475569" />
                                <Text className="text-slate-500 mt-4">Tap 'Video' above to start camera</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

            </ScrollView>
            </View>
         )}
      </Modal>
    </SafeAreaView>
  );
}

