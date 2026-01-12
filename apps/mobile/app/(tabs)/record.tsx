/**
 * Record Screen - Enhanced with audio visualizer and live transcript
 */
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Mic, Square, Pause, Play, Check, AlertCircle } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
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
function PulsingRecordButton({ isRecording, onPress }: { isRecording: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [isRecording]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="w-24 h-24 bg-red-500 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#ef4444',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {isRecording ? (
          <Square size={32} color="#ffffff" fill="#ffffff" />
        ) : (
          <View className="w-12 h-12 bg-white rounded-full" />
        )}
      </TouchableOpacity>
    </Animated.View>
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
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleStop = async () => {
    try {
      const { uri, duration } = await recorder.stop();

      // Transcribe the recording
      setIsSaving(true);
      const result = await transcription.transcribeAudio(uri);

      // Save to storage
      const saved = await saveRecording('quick-record', uri, duration, result.text);

      setSavedUri(saved.audioUri);
      if (Haptics) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Failed to save recording:', error);
      if (Haptics) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Permission denied state
  if (recorder.hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-dark-background items-center justify-center p-6">
        <View className="bg-dark-surface rounded-2xl p-8 items-center border border-dark-border">
          <View className="w-16 h-16 bg-red-500/20 rounded-full items-center justify-center mb-4">
            <Mic size={32} color="#ef4444" />
          </View>
          <Text className="text-xl font-bold text-white text-center mb-2">
            Microphone Access Required
          </Text>
          <Text className="text-dark-text-secondary text-center mb-6">
            LifeContext needs microphone access to record your voice.
          </Text>
          <Button onPress={recorder.requestPermission} variant="primary" size="lg">
            Grant Permission
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const isRecording = recorder.status === 'recording';
  const isPaused = recorder.status === 'paused';
  const isActive = isRecording || isPaused;

  return (
    <SafeAreaView className="flex-1 bg-dark-background" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 py-8">
          {/* Status Badge */}
          {isActive && (
            <View className="flex-row items-center justify-center mb-6">
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  isRecording ? 'bg-red-500' : 'bg-yellow-500'
                }`}
              />
              <Text className="text-dark-text-secondary uppercase tracking-wider text-xs font-semibold">
                {isRecording ? 'Recording' : 'Paused'}
              </Text>
            </View>
          )}

          {/* Timer */}
          <View className="items-center mb-8">
            <Text className="text-7xl font-mono text-white font-bold tracking-wider">
              {formatDuration(recorder.duration)}
            </Text>
          </View>

          {/* Audio Visualizer */}
          {isRecording && (
            <View className="mb-8">
              <AudioVisualizer isActive={isRecording} volume={recorder.volume} barCount={35} />
            </View>
          )}

          {/* Live Transcript */}
          {isRecording && transcription.transcript && (
            <Card variant="default" className="mb-6 max-h-32">
              <View className="flex-row items-start mb-2">
                <View className="w-6 h-6 bg-purple-500/20 rounded-full items-center justify-center mr-2">
                  <Text className="text-purple-400 text-xs font-bold">AI</Text>
                </View>
                <Text className="flex-1 text-white text-sm font-medium">Live Transcript</Text>
              </View>
              <ScrollView className="max-h-20" showsVerticalScrollIndicator={false}>
                <Text className="text-dark-text-secondary text-sm leading-6">
                  {transcription.transcript}
                </Text>
              </ScrollView>
            </Card>
          )}

          {/* Saving/Transcribing indicator */}
          {isSaving && (
            <Card variant="elevated" className="mb-6">
              <View className="items-center py-4">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-primary-400 mt-3 font-medium">
                  {transcription.isTranscribing ? 'Transcribing...' : 'Saving...'}
                </Text>
                <Text className="text-dark-text-secondary text-xs mt-1">
                  This may take a moment
                </Text>
              </View>
            </Card>
          )}

          {/* Saved confirmation */}
          {savedUri && !isSaving && (
            <Card variant="default" className="mb-6 border-green-500/50 bg-green-900/10">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center mr-3">
                  <Check size={18} color="#ffffff" />
                </View>
                <Text className="text-green-400 font-semibold text-lg">Recording Saved!</Text>
              </View>
              {transcription.transcript && (
                <Text className="text-dark-text-secondary text-sm leading-6" numberOfLines={3}>
                  "{transcription.transcript}"
                </Text>
              )}
            </Card>
          )}

          {/* Controls */}
          <View className="flex-1 items-center justify-center">
            {recorder.status === 'idle' && !isSaving ? (
              <View className="items-center">
                <PulsingRecordButton isRecording={false} onPress={handleStart} />
                <Text className="text-dark-text-secondary mt-4 text-center">
                  Tap to start recording
                </Text>
              </View>
            ) : isActive ? (
              <View className="items-center">
                <View className="flex-row items-center gap-6 mb-6">
                  {isRecording ? (
                    <TouchableOpacity
                      onPress={recorder.pause}
                      className="w-16 h-16 bg-yellow-500 rounded-full items-center justify-center active:scale-95"
                    >
                      <Pause size={24} color="#ffffff" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={recorder.resume}
                      className="w-16 h-16 bg-green-500 rounded-full items-center justify-center active:scale-95"
                    >
                      <Play size={24} color="#ffffff" fill="#ffffff" />
                    </TouchableOpacity>
                  )}

                  <PulsingRecordButton isRecording={isRecording} onPress={handleStop} />
                </View>
                <Text className="text-dark-text-secondary text-center text-sm">
                  {isRecording ? 'Tap square to stop' : 'Tap play to resume'}
                </Text>
              </View>
            ) : null}
          </View>

          {/* New Recording button after save */}
          {savedUri && !isSaving && (
            <Button
              onPress={() => {
                setSavedUri(null);
                transcription.clearTranscript();
              }}
              variant="primary"
              size="lg"
              className="mb-4"
            >
              New Recording
            </Button>
          )}

          {/* Info Card */}
          {recorder.status === 'idle' && !isSaving && !savedUri && (
            <Card variant="default" className="mt-auto">
              <View className="flex-row">
                <View className="mr-3">
                  <Text className="text-2xl">💡</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-dark-text-primary text-sm font-medium mb-1">
                    Recording Tip
                  </Text>
                  <Text className="text-dark-text-secondary text-xs leading-5">
                    Speak naturally and take your time. Your recordings are encrypted and stored
                    locally on your device.
                  </Text>
                </View>
              </View>

              {!transcription.hasWhisperKey && (
                <View className="flex-row mt-3 pt-3 border-t border-dark-border">
                  <AlertCircle size={16} color="#f59e0b" className="mr-2" />
                  <Text className="flex-1 text-amber-400 text-xs">
                    Add OpenAI API key in Settings for AI transcription
                  </Text>
                </View>
              )}
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
