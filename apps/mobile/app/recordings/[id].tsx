/**
 * Recording Detail Screen - View recording with playback and transcript
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw,
  FastForward,
  Rewind,
  Mic,
  Clock,
  FileText,
  Sparkles,
  Trash2,
} from 'lucide-react-native';
import { Card } from '../../src/components/ui';
import * as storage from '../../src/lib/storage';

// ============================================================
// TYPES
// ============================================================

interface RecordingData {
  id: string;
  uri: string;
  duration: number;
  createdAt: string;
  transcriptionText?: string;
  transcriptionStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  synthesis?: {
    summary?: string;
    tags?: string[];
    sentiment?: string;
  };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function RecordingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recording, setRecording] = useState<RecordingData | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load recording data
  useEffect(() => {
    if (id) {
      const recordings = storage.getRecordings();
      const found = recordings.find((r: any) => r.id === id);
      if (found) {
        setRecording(found as RecordingData);
        setDuration(found.duration || 0);
      }
    }
  }, [id]);

  // Load audio
  useEffect(() => {
    if (recording?.uri) {
      loadAudio();
    }
    return () => {
      sound?.unloadAsync();
    };
  }, [recording?.uri]);

  const loadAudio = async () => {
    if (!recording?.uri) return;
    
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recording.uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (err) {
      console.error('Failed to load audio:', err);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const handlePlayPause = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!sound) return;
    
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  }, [sound, isPlaying]);

  const handleSeek = useCallback(async (delta: number) => {
    if (!sound) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const newPosition = Math.max(0, Math.min(duration, position + delta));
    await sound.setPositionAsync(newPosition * 1000);
  }, [sound, position, duration]);

  const handleRestart = useCallback(async () => {
    if (!sound) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    await sound.setPositionAsync(0);
    await sound.playAsync();
  }, [sound]);

  const handleDelete = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    
    if (id) {
      await storage.deleteRecording(id);
      router.back();
    }
  }, [id, router]);

  if (!recording) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator color="#3b82f6" size="large" />
      </SafeAreaView>
    );
  }

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Recording',
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#f8fafc',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
              <ChevronLeft size={24} color="#f8fafc" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete}>
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <SafeAreaView className="flex-1 bg-slate-950" edges={['bottom']}>
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Recording Info */}
          <Animated.View entering={FadeInDown.delay(100).springify().damping(15)}>
            <Card variant="glass" className="border-white/5 mb-6">
              <View className="flex-row items-center mb-4">
                <View className="w-14 h-14 rounded-2xl bg-blue-500/20 items-center justify-center">
                  <Mic size={28} color="#3b82f6" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
                    Voice Recording
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Clock size={12} color="#94a3b8" />
                    <Text className="text-slate-400 text-sm ml-1" style={{ fontFamily: 'Inter_400Regular' }}>
                      {formatDuration(duration)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text className="text-slate-500 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
                {formatDate(recording.createdAt)}
              </Text>
            </Card>
          </Animated.View>

          {/* Player */}
          <Animated.View entering={FadeInDown.delay(200).springify().damping(15)}>
            <Card variant="glass" className="border-primary-500/20 bg-primary-500/5 mb-6">
              {/* Progress Bar */}
              <View className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <View 
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </View>

              {/* Time Display */}
              <View className="flex-row justify-between mb-6">
                <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
                  {formatDuration(position)}
                </Text>
                <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
                  {formatDuration(duration)}
                </Text>
              </View>

              {/* Controls */}
              <View className="flex-row items-center justify-center gap-6">
                <TouchableOpacity
                  className="w-12 h-12 bg-white/10 rounded-full items-center justify-center"
                  onPress={() => handleSeek(-15)}
                >
                  <Rewind size={20} color="#f8fafc" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-16 h-16 bg-primary-500 rounded-full items-center justify-center"
                  onPress={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause size={28} color="#ffffff" />
                  ) : (
                    <Play size={28} color="#ffffff" style={{ marginLeft: 4 }} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-12 h-12 bg-white/10 rounded-full items-center justify-center"
                  onPress={() => handleSeek(15)}
                >
                  <FastForward size={20} color="#f8fafc" />
                </TouchableOpacity>
              </View>

              {/* Restart */}
              <TouchableOpacity 
                className="flex-row items-center justify-center mt-4"
                onPress={handleRestart}
              >
                <RotateCcw size={14} color="#94a3b8" />
                <Text className="text-slate-400 text-sm ml-2" style={{ fontFamily: 'Inter_400Regular' }}>
                  Restart
                </Text>
              </TouchableOpacity>
            </Card>
          </Animated.View>

          {/* Transcript */}
          <Animated.View entering={FadeInDown.delay(300).springify().damping(15)}>
            <View className="flex-row items-center mb-3">
              <FileText size={16} color="#94a3b8" />
              <Text className="text-slate-400 text-sm ml-2" style={{ fontFamily: 'Inter_600SemiBold' }}>
                TRANSCRIPT
              </Text>
            </View>
            
            <Card variant="glass" className="border-white/5">
              {recording.transcriptionStatus === 'pending' ? (
                <View className="items-center py-6">
                  <ActivityIndicator color="#3b82f6" size="small" />
                  <Text className="text-slate-400 text-sm mt-3" style={{ fontFamily: 'Inter_400Regular' }}>
                    Transcription pending...
                  </Text>
                </View>
              ) : recording.transcriptionStatus === 'processing' ? (
                <View className="items-center py-6">
                  <ActivityIndicator color="#3b82f6" size="small" />
                  <Text className="text-slate-400 text-sm mt-3" style={{ fontFamily: 'Inter_400Regular' }}>
                    Transcribing audio...
                  </Text>
                </View>
              ) : recording.transcriptionText ? (
                <Text className="text-white text-base leading-6" style={{ fontFamily: 'Inter_400Regular' }}>
                  {recording.transcriptionText}
                </Text>
              ) : (
                <Text className="text-slate-400 text-sm text-center py-4" style={{ fontFamily: 'Inter_400Regular' }}>
                  No transcript available
                </Text>
              )}
            </Card>
          </Animated.View>

          {/* AI Summary */}
          {recording.synthesis?.summary && (
            <Animated.View entering={FadeInDown.delay(400).springify().damping(15)} className="mt-6">
              <View className="flex-row items-center mb-3">
                <Sparkles size={16} color="#0ea5e9" />
                <Text className="text-slate-400 text-sm ml-2" style={{ fontFamily: 'Inter_600SemiBold' }}>
                  AI SUMMARY
                </Text>
              </View>
              
              <Card variant="glass" className="border-sky-500/20 bg-sky-500/5">
                <Text className="text-white text-base leading-6" style={{ fontFamily: 'Inter_400Regular' }}>
                  {recording.synthesis.summary}
                </Text>
                
                {recording.synthesis.tags && recording.synthesis.tags.length > 0 && (
                  <View className="flex-row flex-wrap gap-2 mt-4">
                    {recording.synthesis.tags.map((tag, i) => (
                      <View key={i} className="px-3 py-1 bg-sky-500/20 rounded-full">
                        <Text className="text-sky-400 text-xs" style={{ fontFamily: 'Inter_600SemiBold' }}>
                          {tag}
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
