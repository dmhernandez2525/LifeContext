import { View, Text, Pressable, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { formatDuration } from '@lcc/core';

type RecordingStatus = 'idle' | 'recording' | 'paused';

export default function RecordScreen() {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkPermission();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  const checkPermission = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    setPermissionGranted(granted);
  };

  const startRecording = async () => {
    if (!permissionGranted) {
      await checkPermission();
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setStatus('recording');
      setDuration(0);

      intervalRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
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
      setStatus('idle');
      setDuration(0);

      // TODO: Save recording to storage and process
    }
  };

  if (permissionGranted === false) {
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
          onPress={checkPermission}
          className="bg-brand-500 px-6 py-3 rounded-xl active:opacity-80"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-background" edges={['top']}>
      <View className="flex-1 items-center justify-center p-6">
        {/* Recording Status */}
        <View className="items-center mb-12">
          {status !== 'idle' && (
            <View className="flex-row items-center mb-4">
              <View
                className={`w-3 h-3 rounded-full mr-2 ${
                  status === 'recording' ? 'bg-red-500' : 'bg-yellow-500'
                }`}
              />
              <Text className="text-dark-text-secondary uppercase tracking-wider text-sm">
                {status === 'recording' ? 'Recording' : 'Paused'}
              </Text>
            </View>
          )}

          <Text className="text-6xl font-mono text-white font-bold">
            {formatDuration(duration)}
          </Text>

          {status === 'idle' && (
            <Text className="text-dark-text-secondary mt-4 text-center">
              Tap the button to start recording
            </Text>
          )}
        </View>

        {/* Controls */}
        <View className="flex-row items-center gap-6">
          {status === 'idle' ? (
            <Pressable
              onPress={startRecording}
              className="w-24 h-24 bg-red-500 rounded-full items-center justify-center active:scale-95"
              style={{ transform: [{ scale: 1 }] }}
            >
              <View className="w-8 h-8 bg-white rounded-full" />
            </Pressable>
          ) : (
            <>
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
                className="w-20 h-20 bg-red-500 rounded-full items-center justify-center active:scale-95"
              >
                <View className="w-8 h-8 bg-white rounded-md" />
              </Pressable>
            </>
          )}
        </View>

        {/* Tip */}
        {status === 'idle' && (
          <View className="absolute bottom-8 left-6 right-6">
            <View className="bg-dark-surface rounded-xl p-4 border border-dark-border">
              <Text className="text-dark-text-secondary text-center text-sm">
                💡 Tip: Speak naturally and take your time. Your recordings are
                encrypted and stored locally.
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
