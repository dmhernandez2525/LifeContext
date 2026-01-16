/**
 * Record Screen - Enhanced with audio visualizer and live transcript
 */
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform, Alert } from 'react-native';

import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Mic, Square, Pause, Play, Check, AlertCircle, Trash2 } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  withSpring,
} from 'react-native-reanimated';
import { useRecorder, useTranscription } from '../../src/hooks';
import { saveRecording } from '../../src/lib/storage';
import { AudioVisualizer } from '../../src/components/AudioVisualizer';
import { Card, Button } from '../../src/components/ui';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Pulsing record button animation
function PulsingRecordButton({ isRecording, isActive, onPress }: { isRecording: boolean; isActive: boolean; onPress: () => void }) {
  const pulseScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);
  const ringScale = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 1200, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
          withTiming(1, { duration: 1200, easing: Easing.bezier(0.4, 0, 0.2, 1) })
        ),
        -1,
        true
      );
      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 1200 }),
          withTiming(0, { duration: 1200 })
        ),
        -1,
        false
      );
      ringScale.value = withRepeat(
        withTiming(1.6, { duration: 2400, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    } else {
      pulseScale.value = withSpring(1);
      ringOpacity.value = withTiming(0);
      ringScale.value = withTiming(1);
    }
  }, [isRecording]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View className="items-center justify-center">
      {/* Animated outer ring */}
      {isRecording && (
        <Animated.View 
          className="absolute w-24 h-24 rounded-full border-2 border-red-500"
          style={animatedRingStyle}
        />
      )}
      
      <Animated.View style={animatedButtonStyle}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          className={`w-24 h-24 rounded-full items-center justify-center shadow-2xl ${
            isRecording ? 'bg-red-500' : 'bg-primary-500'
          }`}
          style={{
            shadowColor: isRecording ? '#ef4444' : '#0ea5e9',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 15,
            elevation: 10,
          }}
        >
          {isRecording ? (
            <Square size={32} color="#ffffff" fill="#ffffff" />
          ) : (
            <Mic size={36} color="#ffffff" strokeWidth={2.5} />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function RecordScreen() {
  const recorder = useRecorder();
  const transcription = useTranscription();
  const [isSaving, setIsSaving] = useState(false);
  const [savedUri, setSavedUri] = useState<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recorder.status === 'recording' || recorder.status === 'paused') {
        recorder.cancel();
      }
    };
  }, []);

  const handleStart = async () => {
    setSavedUri(null);
    transcription.clearTranscript();
    await recorder.start();
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePause = async () => {
    await recorder.pause();
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleResume = async () => {
    await recorder.resume();
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStop = async () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    try {
      const { uri, duration } = await recorder.stop();

      setIsSaving(true);
      const result = await transcription.transcribeAudio(uri);

      // Save to storage
      await saveRecording('quick-record', uri, duration, result.text);

      setSavedUri(uri);
    } catch {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    Alert.alert(
      'Discard Recording',
      'Are you sure you want to discard this recording?',
      [
        { text: 'Keep', style: 'cancel' },
        { 
          text: 'Discard', 
          style: 'destructive', 
          onPress: async () => {
            await recorder.cancel();
            transcription.clearTranscript();
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          } 
        },
      ]
    );
  };

  const isRecording = recorder.status === 'recording';
  const isPaused = recorder.status === 'paused';
  const isActive = isRecording || isPaused;

  if (recorder.hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center p-6">
        <Card variant="glass" className="p-8 items-center max-w-xs">
          <View className="w-16 h-16 bg-red-500/20 rounded-full items-center justify-center mb-6">
            <Mic size={32} color="#ef4444" />
          </View>
          <Text className="text-xl font-bold text-white text-center mb-3" style={{ fontFamily: 'Inter_700Bold' }}>
            Microphone Required
          </Text>
          <Text className="text-slate-400 text-center mb-8 leading-5" style={{ fontFamily: 'Inter_400Regular' }}>
            To archive your life context, we need permission to use the microphone.
          </Text>
          <Button onPress={recorder.requestPermission} variant="primary" className="w-full">
            Grant Access
          </Button>
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <View className="flex-1 px-6 pt-12 pb-8 justify-between">
        {/* Top Section: Status & Feedback */}
        <View>
          <View className="items-center mb-4">
            <View className={`px-4 py-1.5 rounded-full flex-row items-center border ${
              isRecording ? 'bg-red-500/10 border-red-500/20' : isActive ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/5'
            }`}>
              <Animated.View 
                entering={FadeIn}
                className={`w-2 h-2 rounded-full mr-2 ${isRecording ? 'bg-red-500' : isActive ? 'bg-amber-500' : 'bg-slate-500'}`}
              />
              <Text className="text-white text-[10px] uppercase font-bold tracking-widest" style={{ fontFamily: 'Inter_700Bold' }}>
                {isRecording ? 'AI Processing Active' : isActive ? 'Recording Paused' : 'Ready to Record'}
              </Text>
            </View>
          </View>

          <View className="items-center mt-4">
            <Text 
              className="text-7xl font-bold text-white tracking-tighter"
              style={{ fontFamily: 'Inter_700Bold' }}
            >
              {formatDuration(recorder.duration)}
            </Text>
          </View>
        </View>

        {/* Middle Section: Visualization & Transcript */}
        <View className="flex-1 justify-center py-8">
          {isActive ? (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <View className="mb-12">
                <AudioVisualizer isActive={isRecording} volume={recorder.volume} barCount={41} />
              </View>

              {transcription.transcript ? (
                <Card variant="glass" className="bg-white/5 border-white/10 max-h-48">
                  <View className="flex-row items-center mb-3">
                    <View className="bg-primary-500/20 px-2 py-0.5 rounded-md mr-2">
                      <Text className="text-primary-400 text-[10px] font-bold">LIVE AI</Text>
                    </View>
                    <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: 'Inter_700Bold' }}>
                      Transcribing
                    </Text>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-white/80 text-base leading-7" style={{ fontFamily: 'Inter_400Regular' }}>
                      {transcription.transcript}...
                    </Text>
                  </ScrollView>
                </Card>
              ) : (
                <View className="items-center">
                  <Text className="text-slate-600 text-sm italic" style={{ fontFamily: 'Inter_400Regular' }}>
                    Listening for voice context...
                  </Text>
                </View>
              )}
            </Animated.View>
          ) : (
             <View className="items-center px-12 opacity-30">
               <View className="w-24 h-24 bg-slate-900 rounded-full items-center justify-center mb-8">
                 <Mic size={48} color="#94a3b8" />
               </View>
               <Text className="text-white text-xl font-bold text-center mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
                 Your Life, Archived.
               </Text>
               <Text className="text-slate-400 text-sm text-center" style={{ fontFamily: 'Inter_400Regular' }}>
                 Start speaking to capture your thoughts, memories, and context in real-time.
               </Text>
             </View>
          )}

          {isSaving && (
            <Animated.View 
              entering={FadeIn} 
              className="absolute inset-x-0 items-center justify-center z-50 bg-slate-950/80 rounded-3xl p-6"
            >
              <ActivityIndicator size="large" color="#0ea5e9" />
              <Text className="text-white font-bold mt-4" style={{ fontFamily: 'Inter_700Bold' }}>
                {transcription.isTranscribing ? 'Analyzing Content...' : 'Securing Data...'}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Bottom Section: Controls */}
        <View>
          {isActive ? (
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={handleCancel}
                className="w-16 h-16 bg-slate-900 rounded-full items-center justify-center border border-white/5"
              >
                <Trash2 size={24} color="#ef4444" />
              </TouchableOpacity>

              <PulsingRecordButton isRecording={isRecording} isActive={isActive} onPress={handleStop} />

              {isRecording ? (
                <TouchableOpacity
                  onPress={handlePause}
                  className="w-16 h-16 bg-slate-900 rounded-full items-center justify-center border border-white/5"
                >
                  <Pause size={24} color="#f59e0b" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleResume}
                  className="w-16 h-16 bg-slate-900 rounded-full items-center justify-center border border-white/5"
                >
                  <Play size={24} color="#10b981" fill="#10b981" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="items-center">
              <PulsingRecordButton isRecording={false} isActive={false} onPress={handleStart} />
              <Text className="text-slate-500 mt-6 font-medium uppercase tracking-widest text-[10px]" style={{ fontFamily: 'Inter_700Bold' }}>
                Tap to Start Recording
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

