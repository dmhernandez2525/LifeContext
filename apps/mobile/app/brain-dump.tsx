/**
 * Brain Dump Screen - Speak freely with AI synthesis
 */
import { View, Text, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useRecorder, useTranscription, useSynthesis, SynthesisResult } from '../src/hooks';
import { saveBrainDump } from '../src/lib/storage';

interface BulletPoint {
  id: string;
  text: string;
}

type Step = 'bullets' | 'recording' | 'transcribing' | 'synthesizing' | 'complete';

export default function BrainDumpScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('bullets');
  const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
    { id: '3', text: '' },
  ]);
  const [synthesis, setSynthesis] = useState<SynthesisResult | null>(null);
  
  const recorder = useRecorder();
  const transcription = useTranscription();
  const { synthesize, hasApiKey, isLoading: isSynthesizing } = useSynthesis();
  
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
    setStep('recording');
    await recorder.start();
  };
  
  const handleFinishRecording = async () => {
    try {
      const { uri, duration } = await recorder.stop();
      
      // Transcribe
      setStep('transcribing');
      const result = await transcription.transcribeAudio(uri);
      const transcript = result.text;
      
      // Synthesize
      setStep('synthesizing');
      const synthesisResult = await synthesize(
        filledBullets.map(b => b.text),
        transcript
      );
      
      setSynthesis(synthesisResult);
      
      // Save to storage
      await saveBrainDump({
        title: filledBullets[0]?.text.substring(0, 50),
        bulletPoints: filledBullets.map(b => b.text),
        audioUri: uri,
        transcription: transcript,
        synthesis: synthesisResult,
        duration,
      });
      
      setStep('complete');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Brain dump failed:', error);
      setStep('complete');
    }
  };
  
  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };
  
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
            {!hasApiKey && (
              <Text className="text-amber-300 text-xs mt-2">
                ⚠️ Demo mode - add API key in Settings for real AI synthesis
              </Text>
            )}
          </View>
          
          {/* Bullet Points */}
          <Text className="text-white font-semibold mb-3">
            What do you want to talk about?
          </Text>
          {bulletPoints.map((bp, index) => (
            <View key={bp.id} className="flex-row items-center mb-3">
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
          
          {/* Timer */}
          <Text className="text-4xl font-mono text-white font-bold mb-2">
            {formatDuration(recorder.duration)}
          </Text>
          
          {/* Volume indicator */}
          <View className="w-48 h-2 bg-dark-border rounded-full overflow-hidden mb-4">
            <View 
              className={`h-full ${
                recorder.volume < 0.1 ? 'bg-red-500' : 
                recorder.volume < 0.3 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, recorder.volume * 200)}%` }}
            />
          </View>
          
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
      
      {step === 'transcribing' && (
        <View className="flex-1 items-center justify-center p-6">
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text className="text-white text-xl font-semibold mt-4 mb-2">
            Transcribing...
          </Text>
          <Text className="text-dark-text-secondary text-center">
            Converting your speech to text
          </Text>
        </View>
      )}
      
      {step === 'synthesizing' && (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-6xl mb-4">✨</Text>
          <Text className="text-white text-xl font-semibold mb-2">
            Synthesizing...
          </Text>
          <Text className="text-dark-text-secondary text-center">
            AI is organizing your thoughts
          </Text>
        </View>
      )}
      
      {step === 'complete' && (
        <ScrollView className="flex-1 p-6">
          <View className="bg-green-900/30 rounded-xl p-4 border border-green-800 mb-6">
            <Text className="text-green-200 text-center">
              ✓ Brain dump saved successfully!
            </Text>
          </View>
          
          {/* Transcript */}
          {transcription.transcript && (
            <View className="bg-dark-surface rounded-xl p-4 border border-dark-border mb-4">
              <Text className="text-dark-text-secondary text-sm mb-2">
                What you said:
              </Text>
              <Text className="text-white text-sm leading-5">
                {transcription.transcript}
              </Text>
            </View>
          )}
          
          {/* Organized Content */}
          {synthesis && (
            <>
              <View className="bg-dark-surface rounded-xl p-4 border border-dark-border mb-4">
                <Text className="text-white font-semibold mb-2">
                  ✨ Organized Thoughts
                </Text>
                <Text className="text-dark-text-secondary text-sm leading-5">
                  {synthesis.organizedContent}
                </Text>
              </View>
              
              {/* Insights */}
              {synthesis.insights.length > 0 && (
                <View className="bg-purple-900/20 rounded-xl p-4 border border-purple-800 mb-4">
                  <Text className="text-purple-200 font-semibold mb-2">
                    💡 Key Insights
                  </Text>
                  {synthesis.insights.map((insight, i) => (
                    <Text key={i} className="text-purple-100 text-sm mb-1">
                      • {insight}
                    </Text>
                  ))}
                </View>
              )}
              
              {/* Questions */}
              {synthesis.questions.length > 0 && (
                <View className="bg-blue-900/20 rounded-xl p-4 border border-blue-800 mb-4">
                  <Text className="text-blue-200 font-semibold mb-2">
                    ❓ To Explore
                  </Text>
                  {synthesis.questions.map((q, i) => (
                    <Text key={i} className="text-blue-100 text-sm mb-1">
                      {i + 1}. {q}
                    </Text>
                  ))}
                </View>
              )}
            </>
          )}
          
          <Pressable
            onPress={handleClose}
            className="bg-brand-500 py-4 rounded-xl active:opacity-80 mt-4"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Done
            </Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
