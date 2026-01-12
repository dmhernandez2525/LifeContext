import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAudioRecorder } from '../src/hooks/useAudioRecorder';
import { useRecordingStore } from '../src/stores/recording-store';

interface BulletPoint {
  id: string;
  text: string;
}

type Step = 'bullets' | 'recording' | 'synthesizing' | 'complete';

export default function BrainDumpScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('bullets');
  const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
    { id: '3', text: '' },
  ]);

  const { startRecording, stopRecording, duration } = useAudioRecorder();
  const addRecording = useRecordingStore((state: any) => state.addRecording);

  const addBulletPoint = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBulletPoints([
      ...bulletPoints,
      { id: Date.now().toString(), text: '' },
    ]);
  };

  const updateBulletPoint = (id: string, text: string) => {
    setBulletPoints(
      bulletPoints.map((bp) => (bp.id === id ? { ...bp, text } : bp))
    );
  };

  const removeBulletPoint = (id: string) => {
    if (bulletPoints.length > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setBulletPoints(bulletPoints.filter((bp) => bp.id !== id));
    }
  };

  const filledBullets = bulletPoints.filter((bp) => bp.text.trim().length > 0);
  const canStart = filledBullets.length >= 1;

  const handleStartRecording = async () => {
    const success = await startRecording();
    if (success) {
      setStep('recording');
    }
  };

  const handleFinishRecording = async () => {
    const uri = await stopRecording();
    if (uri) {
        addRecording({
            id: Date.now().toString(),
            uri,
            duration,
            createdAt: Date.now(),
            title: `Brain Dump: ${filledBullets[0]?.text.substring(0, 20)}...`,
            tags: ['brain-dump'],
            transcription: filledBullets.map(b => b.text).join('\n'), // Placeholder
            syncStatus: 'pending'
        });
        setStep('synthesizing');
        setTimeout(() => setStep('complete'), 2000);
    } else {
        // Failed
        router.back();
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-dark-border">
        <Pressable onPress={handleClose} className="p-2">
          <Text className="text-brand-400 text-lg">Cancel</Text>
        </Pressable>
        <View className="flex-row items-center">
          <Text className="text-2xl mr-2">🧠</Text>
          <Text className="text-white font-semibold text-lg">Brain Dump</Text>
        </View>
        <View className="w-16" />
      </View>

      {step === 'bullets' && (
        <ScrollView className="flex-1 p-4" keyboardShouldPersistTaps="handled">
          {/* Instructions */}
          <View className="bg-purple-900/30 rounded-xl p-4 border border-purple-800 mb-6">
            <Text className="text-purple-200 text-sm leading-5">
              💡 <Text className="font-semibold">How it works:</Text> Jot down
              quick anchor topics, then speak freely about them. AI will
              organize your thoughts and ask clarifying questions.
            </Text>
          </View>

          {/* Bullet Points */}
          <Text className="text-white font-semibold mb-3">
            What do you want to talk about?
          </Text>
          {bulletPoints.map((bp, index) => (
            <View
              key={bp.id}
              className="flex-row items-center mb-3"
            >
              <Text className="text-dark-text-secondary w-6">{index + 1}.</Text>
              <TextInput
                value={bp.text}
                onChangeText={(text) => updateBulletPoint(bp.id, text)}
                placeholder="Add a topic..."
                placeholderTextColor="#64748b"
                className="flex-1 bg-dark-surface text-white px-4 py-3 rounded-xl border border-dark-border"
              />
              {bulletPoints.length > 1 && (
                <Pressable
                  onPress={() => removeBulletPoint(bp.id)}
                  className="ml-2 p-2"
                >
                  <Text className="text-red-400">✕</Text>
                </Pressable>
              )}
            </View>
          ))}

          <Pressable onPress={addBulletPoint} className="py-2">
            <Text className="text-brand-400">+ Add another topic</Text>
          </Pressable>

          {/* Start Button */}
          <Pressable
            onPress={handleStartRecording}
            disabled={!canStart}
            className={`mt-8 py-4 rounded-xl flex-row items-center justify-center ${
              canStart
                ? 'bg-purple-600 active:opacity-80'
                : 'bg-dark-border opacity-50'
            }`}
          >
            <Text className="text-2xl mr-2">🎙️</Text>
            <Text className="text-white font-semibold text-lg">
              Start Recording
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {step === 'recording' && (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-6xl mb-4">🧠</Text>
          <Text className="text-white text-xl font-semibold mb-2">
            Recording...
          </Text>
          <Text className="text-dark-text-secondary text-center mb-8">
            Speak freely about your topics. Take your time.
          </Text>

          {/* Anchor Points Reminder */}
          <View className="bg-dark-surface rounded-xl p-4 border border-dark-border mb-8 w-full">
            <Text className="text-dark-text-secondary text-sm mb-2">
              Your topics:
            </Text>
            {filledBullets.map((bp, i) => (
              <Text key={bp.id} className="text-white">
                {i + 1}. {bp.text}
              </Text>
            ))}
          </View>

          <Pressable
            onPress={handleFinishRecording}
            className="w-20 h-20 bg-red-500 rounded-full items-center justify-center active:scale-95"
          >
            <View className="w-8 h-8 bg-white rounded-md" />
          </Pressable>
          <Text className="text-dark-text-secondary mt-4">Tap to stop</Text>
        </View>
      )}

      {step === 'synthesizing' && (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-6xl mb-4 animate-pulse">✨</Text>
          <Text className="text-white text-xl font-semibold mb-2">
            Synthesizing...
          </Text>
          <Text className="text-dark-text-secondary text-center">
            AI is organizing your thoughts
          </Text>
        </View>
      )}

      {step === 'complete' && (
        <View className="flex-1 p-6">
          <View className="bg-green-900/30 rounded-xl p-4 border border-green-800 mb-6">
            <Text className="text-green-200 text-center">
              ✓ Brain dump saved successfully!
            </Text>
          </View>

          <View className="bg-dark-surface rounded-xl p-4 border border-dark-border mb-6">
            <Text className="text-white font-semibold mb-2">
              Organized Thoughts
            </Text>
            <Text className="text-dark-text-secondary">
              Your thoughts have been organized and saved. View them in the
              Insights tab.
            </Text>
          </View>

          <Pressable
            onPress={handleClose}
            className="bg-brand-500 py-4 rounded-xl active:opacity-80"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Done
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
