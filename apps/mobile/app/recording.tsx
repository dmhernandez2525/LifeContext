import { View, Text, Pressable } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioRecorder } from '../src/hooks/useAudioRecorder';
import { useRecordingStore } from '../src/stores/recording-store';

export default function RecordingScreen() {
  const router = useRouter();
  const { 
    startRecording, 
    stopRecording, 
    pauseRecording, 
    resumeRecording, 
    status, 
    duration,
    formatDuration
  } = useAudioRecorder();
  
  const addRecording = useRecordingStore((state: any) => state.addRecording);

  useEffect(() => {
    // Auto-start
    let started = false;
    const init = async () => {
      const success = await startRecording();
      if (!success) router.back();
      started = true;
    };
    init();

    return () => {
      // If we unmount and are still recording, stop and save? nothing, hook handles stop
    };
  }, []);

  const handleStop = async () => {
    const uri = await stopRecording();
    if (uri) {
      addRecording({
        id: Date.now().toString(),
        uri,
        duration,
        createdAt: Date.now(),
        title: `Recording ${new Date().toLocaleTimeString()}`,
        tags: ['quick-record'],
        syncStatus: 'pending'
      });
      // Navigate to list or dashboard
      console.log('Saved to', uri);
      router.back();
    }
  };

  const handleCancel = async () => {
    await stopRecording(); // Just stop, don't save (or save and delete?)
    // Actually hook stop returns URI but we just ignore it
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={handleCancel} className="p-2">
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
        <View className="w-full h-24 bg-dark-surface rounded-xl mb-8 items-center justify-center border border-dark-border">
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
            onPress={handleStop}
            className="w-24 h-24 bg-red-500 rounded-full items-center justify-center active:scale-95 border-4 border-red-900"
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
