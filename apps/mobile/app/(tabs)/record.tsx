/**
 * Record Screen - Enhanced with new hooks, transcription display, and waveform
 */
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useRecorder, useTranscription } from '../../src/hooks';
import { saveRecording } from '../../src/lib/storage';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
    await recorder.start();
  };
  
  const handleStop = async () => {
    try {
      const { uri, duration } = await recorder.stop();
      
      // Transcribe the recording
      setIsSaving(true);
      const result = await transcription.transcribeAudio(uri);
      
      // Save to storage
      const saved = await saveRecording(
        'quick-record',
        uri,
        duration,
        result.text
      );
      
      setSavedUri(saved.audioUri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to save recording:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Permission denied state
  if (recorder.hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-dark-background items-center justify-center p-6">
        <Text className="text-4xl mb-4">🎤</Text>
        <Text className="text-xl font-bold text-white text-center mb-2">
          Microphone Access Required
        </Text>
        <Text className="text-dark-text-secondary text-center mb-6">
          LifeContext needs microphone access to record your voice.
        </Text>
        <Pressable
          onPress={recorder.requestPermission}
          className="bg-brand-500 px-6 py-3 rounded-xl active:opacity-80"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }
  
  const isRecording = recorder.status === 'recording';
  const isPaused = recorder.status === 'paused';
  const isActive = isRecording || isPaused;
  
  return (
    <SafeAreaView className="flex-1 bg-dark-background" edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="flex-1">
        <View className="flex-1 items-center justify-center p-6">
          {/* Recording Status */}
          <View className="items-center mb-8">
            {isActive && (
              <View className="flex-row items-center mb-4">
                <View
                  className={`w-3 h-3 rounded-full mr-2 ${
                    isRecording ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                />
                <Text className="text-dark-text-secondary uppercase tracking-wider text-sm">
                  {isRecording ? 'Recording' : 'Paused'}
                </Text>
              </View>
            )}
            
            {/* Timer */}
            <Text className="text-6xl font-mono text-white font-bold">
              {formatDuration(recorder.duration)}
            </Text>
            
            {/* Volume indicator */}
            {isRecording && (
              <View className="mt-4 w-48 h-2 bg-dark-border rounded-full overflow-hidden">
                <View 
                  className={`h-full ${
                    recorder.volume < 0.1 ? 'bg-red-500' : 
                    recorder.volume < 0.3 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, recorder.volume * 200)}%` }}
                />
              </View>
            )}
            
            {recorder.status === 'idle' && !isSaving && !savedUri && (
              <Text className="text-dark-text-secondary mt-4 text-center">
                Tap the button to start recording
              </Text>
            )}
          </View>
          
          {/* Saving/Transcribing indicator */}
          {isSaving && (
            <View className="mb-8 items-center">
              <ActivityIndicator size="large" color="#0ea5e9" />
              <Text className="text-brand-400 mt-2">
                {transcription.isTranscribing ? 'Transcribing...' : 'Saving...'}
              </Text>
            </View>
          )}
          
          {/* Saved confirmation */}
          {savedUri && !isSaving && (
            <View className="mb-8 bg-green-900/20 border border-green-700 rounded-xl p-4 w-full">
              <Text className="text-green-400 font-semibold text-center mb-2">
                ✅ Recording Saved!
              </Text>
              {transcription.transcript && (
                <Text className="text-dark-text-secondary text-sm text-center">
                  "{transcription.transcript.slice(0, 100)}..."
                </Text>
              )}
            </View>
          )}
          
          {/* Controls */}
          <View className="flex-row items-center gap-6">
            {recorder.status === 'idle' && !isSaving ? (
              <Pressable
                onPress={handleStart}
                className="w-24 h-24 bg-red-500 rounded-full items-center justify-center active:scale-95"
              >
                <View className="w-8 h-8 bg-white rounded-full" />
              </Pressable>
            ) : isActive ? (
              <>
                {isRecording ? (
                  <Pressable
                    onPress={recorder.pause}
                    className="w-16 h-16 bg-yellow-500 rounded-full items-center justify-center active:scale-95"
                  >
                    <Text className="text-2xl">⏸️</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={recorder.resume}
                    className="w-16 h-16 bg-green-500 rounded-full items-center justify-center active:scale-95"
                  >
                    <Text className="text-2xl">▶️</Text>
                  </Pressable>
                )}
                
                <Pressable
                  onPress={handleStop}
                  className="w-20 h-20 bg-red-500 rounded-full items-center justify-center active:scale-95"
                >
                  <View className="w-8 h-8 bg-white rounded-md" />
                </Pressable>
              </>
            ) : null}
          </View>
          
          {/* New Recording button after save */}
          {savedUri && !isSaving && (
            <Pressable
              onPress={() => {
                setSavedUri(null);
                transcription.clearTranscript();
              }}
              className="mt-6 border border-brand-400 px-6 py-3 rounded-xl"
            >
              <Text className="text-brand-400 font-semibold">New Recording</Text>
            </Pressable>
          )}
          
          {/* Tip */}
          {recorder.status === 'idle' && !isSaving && !savedUri && (
            <View className="absolute bottom-8 left-6 right-6">
              <View className="bg-dark-surface rounded-xl p-4 border border-dark-border">
                <Text className="text-dark-text-secondary text-center text-sm">
                  💡 Tip: Speak naturally and take your time. Your recordings are
                  encrypted and stored locally.
                </Text>
                {!transcription.hasWhisperKey && (
                  <Text className="text-amber-400 text-center text-xs mt-2">
                    ⚠️ Add OpenAI API key in Settings for AI transcription
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
