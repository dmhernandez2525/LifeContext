import { View, Text, Pressable } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { formatDuration } from '@lcc/core';

export default function RecordingScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'recording' | 'paused'>('idle');
  const [duration, setDuration] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startRecording();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        router.back();
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setStatus('recording');

      intervalRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.error('Failed to start recording:', error);
      router.back();
    }
  };

  const pauseRecording = async () => {
    if (recordingRef.current && status === 'recording') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await recordingRef.current.pauseAsync();
      setStatus('paused');
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const resumeRecording = async () => {
    if (recordingRef.current && status === 'paused') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await recordingRef.current.startAsync();
      setStatus('recording');
      intervalRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    }
  };

  const stopRecording = async () => {
    if (recordingRef.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (intervalRef.current) clearInterval(intervalRef.current);

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      console.log('Recording saved to:', uri);

      recordingRef.current = null;

      // TODO: Save recording and navigate to transcription
      router.back();
    }
  };

  const cancelRecording = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (recordingRef.current) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
    }
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={cancelRecording} className="p-2">
          <Text className="text-red-400 text-lg">Cancel</Text>
        </Pressable>
        <View className="flex-row items-center">
          <View
            className={`w-3 h-3 rounded-full mr-2 ${
              status === 'recording' ? 'bg-red-500' : 'bg-yellow-500'
            }`}
          />
          <Text className="text-white font-medium uppercase tracking-wide text-sm">
            {status === 'recording' ? 'Recording' : 'Paused'}
          </Text>
        </View>
        <View className="w-16" />
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center p-6">
        {/* Timer */}
        <Text className="text-7xl font-mono text-white font-bold mb-8">
          {formatDuration(duration)}
        </Text>

        {/* Waveform Placeholder */}
        <View className="w-full h-24 bg-dark-surface rounded-xl mb-8 items-center justify-center">
          <Text className="text-dark-text-secondary">
            {status === 'recording' ? '🎵 Recording audio...' : '⏸️ Paused'}
          </Text>
        </View>

        {/* Controls */}
        <View className="flex-row items-center gap-6">
          {status === 'recording' ? (
            <Pressable
              onPress={pauseRecording}
              className="w-16 h-16 bg-yellow-500 rounded-full items-center justify-center active:scale-95"
            >
              <Text className="text-2xl">⏸️</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={resumeRecording}
              className="w-16 h-16 bg-green-500 rounded-full items-center justify-center active:scale-95"
            >
              <Text className="text-2xl">▶️</Text>
            </Pressable>
          )}

          <Pressable
            onPress={stopRecording}
            className="w-24 h-24 bg-red-500 rounded-full items-center justify-center active:scale-95"
          >
            <View className="w-10 h-10 bg-white rounded-md" />
          </Pressable>
        </View>

        {/* Tip */}
        <View className="absolute bottom-8 left-6 right-6">
          <Text className="text-dark-text-secondary text-center text-sm">
            💡 Your recording is encrypted and stored locally on your device.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
