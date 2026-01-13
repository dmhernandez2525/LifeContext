/**
 * Brain Dump Screen - Speak freely with AI synthesis
 * Enhanced with polished UI and animations
 */
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { X, Plus, Trash2, Brain, Sparkles, Check, MessageCircle, ArrowRight, Mic as MicIcon, StopCircle } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { useRecorder, useTranscription, useSynthesis, SynthesisResult } from '../src/hooks';
import { saveBrainDump } from '../src/lib/storage';
import { AudioVisualizer } from '../src/components/AudioVisualizer';
import { Card, Button, Badge } from '../src/components/ui';
import { Modal } from 'react-native';
import { DeepDiveSheet } from '../src/components/life-planning/DeepDiveSheet';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

interface BulletPoint {
  id: string;
  text: string;
}

type Step = 'bullets' | 'recording' | 'transcribing' | 'synthesizing' | 'complete';

// Pulsing thinking animation
function ThinkingAnimation() {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="mb-6">
      <View className="w-24 h-24 bg-purple-600/20 rounded-full items-center justify-center">
        <Sparkles size={48} color="#a855f7" />
      </View>
    </Animated.View>
  );
}

export default function BrainDumpScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('bullets');
  const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
    { id: '3', text: '' },
  ]);
  const [synthesis, setSynthesis] = useState<SynthesisResult | null>(null);
  
  // Refinement State
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [refinementAnswer, setRefinementAnswer] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [refinementTranscript, setRefinementTranscript] = useState('');
  
  // Actionable Insights State
  const [activeContext, setActiveContext] = useState<string | null>(null);
  const { dismiss } = useBottomSheetModal(); // For deep dive sheet handling if needed
  
  const recorder = useRecorder();
  // We might need a second recorder instance or reuse the existing one if it resets properly. 
  // useRecorder hook usually manages one instance. I should check if I can reuse it. 
  // Assuming reuse is fine if stopped. 
  
  const transcription = useTranscription();
  const { synthesize, hasApiKey, isLoading: isSynthesizing } = useSynthesis();

  const addBulletPoint = () => {
    if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBulletPoints([...bulletPoints, { id: Date.now().toString(), text: '' }]);
  };

  const updateBulletPoint = (id: string, text: string) => {
    setBulletPoints(bulletPoints.map((bp) => (bp.id === id ? { ...bp, text } : bp)));
  };

  const removeBulletPoint = (id: string) => {
    if (bulletPoints.length > 1) {
      if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        filledBullets.map((b) => b.text),
        transcript
      );

      setSynthesis(synthesisResult);

      // Save to storage
      await saveBrainDump({
        title: filledBullets[0]?.text.substring(0, 50),
        bulletPoints: filledBullets.map((b) => b.text),
        audioUri: uri,
        transcription: transcript,
        synthesis: synthesisResult,
        duration,
      });

      setStep('complete');
      if (Haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Brain dump failed:', error);
      setStep('complete');
    }
  };

  const handleRefinementStart = async () => {
     try {
         setIsRefining(true);
         await recorder.start();
     } catch(e) { console.error(e); }
  };

  const handleRefinementStop = async () => {
      try {
          const { uri } = await recorder.stop();
          setIsRefining(false);
          // Transcribe answer
          // Note: straightforward implementation using the same transcription hook
          // We might want to show a spinner here
          const result = await transcription.transcribeAudio(uri);
          setRefinementAnswer(result.text);
      } catch(e) { console.error(e); }
  };

  const submitRefinement = async () => {
      if (!activeQuestion || !refinementAnswer) return;
      
      const newContext = `\n\n[Clarification on "${activeQuestion}"]: ${refinementAnswer}`;
      const updatedTranscript = (transcription.transcript || '') + newContext;
      
      // Update local transcript immediately
      transcription.transcript = updatedTranscript; // Assuming we can mutate or simpler: just pass updated string to synthesize
      
      setActiveQuestion(null);
      setRefinementAnswer('');
      setStep('synthesizing'); // Go back to thinking state
      
      try {
          const newSynthesis = await synthesize(
              filledBullets.map(b => b.text),
              updatedTranscript
          );
          setSynthesis(newSynthesis);
          
          // Re-save (updating existing would be better but for now overwrite/new is okay, or we just rely on the final save if we haven't left)
          // Actually we already saved once. We should update.
          // For MVP, we'll just save a new version or overwrite if we had an ID. 
          // `saveBrainDump` generates a new ID every time. 
          // Let's just re-save for safety on "Done".
          
          setStep('complete');
      } catch (e) {
          console.error("Refinement failed", e);
          setStep('complete'); // Fallback
      }
  };

  const handleClose = () => {
    if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        <TouchableOpacity onPress={handleClose} className="p-2">
          <X size={24} color="#f8fafc" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Brain size={24} color="#a855f7" strokeWidth={2} />
          <Text className="text-white font-semibold text-lg ml-2">Brain Dump</Text>
        </View>
        <View className="w-10" />
      </View>

      {step === 'bullets' && (
        <ScrollView className="flex-1 p-6" keyboardShouldPersistTaps="handled">
          {/* Instructions */}
          <Card variant="default" className="mb-6 bg-purple-900/20 border-purple-600/50">
            <View className="flex-row items-start">
              <Text className="text-2xl mr-3">💡</Text>
              <View className="flex-1">
                <Text className="text-purple-200 text-sm font-semibold mb-1">How it works</Text>
                <Text className="text-purple-200/80 text-xs leading-5">
                  Jot down quick anchor topics, then speak freely about them. AI will organize your
                  thoughts and ask clarifying questions.
                </Text>
                {!hasApiKey && (
                  <View className="mt-2 pt-2 border-t border-purple-600/30">
                    <Text className="text-amber-300 text-xs">
                      ⚠️ Add API key in Settings for real AI synthesis
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Card>

          {/* Bullet Points */}
          <Text className="text-white font-semibold text-lg mb-4">
            What do you want to talk about?
          </Text>

          {bulletPoints.map((bp, index) => (
            <Animated.View key={bp.id} entering={FadeInDown.delay(index * 100)}>
              <View className="flex-row items-center mb-3">
                <View className="w-7 h-7 bg-purple-600/20 rounded-full items-center justify-center mr-2">
                  <Text className="text-purple-400 text-sm font-semibold">{index + 1}</Text>
                </View>
                <TextInput
                  value={bp.text}
                  onChangeText={(text) => updateBulletPoint(bp.id, text)}
                  placeholder="Add a topic..."
                  placeholderTextColor="#64748b"
                  className="flex-1 bg-dark-surface text-white px-4 py-3 rounded-xl border border-dark-border"
                />
                {bulletPoints.length > 1 && (
                  <TouchableOpacity onPress={() => removeBulletPoint(bp.id)} className="ml-2 p-2">
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          ))}

          <TouchableOpacity
            onPress={addBulletPoint}
            className="flex-row items-center py-3 mb-6"
          >
            <Plus size={18} color="#a855f7" />
            <Text className="text-purple-400 ml-2 font-medium">Add another topic</Text>
          </TouchableOpacity>

          {/* Start Button */}
          <Button
            onPress={handleStartRecording}
            disabled={!canStart}
            variant="primary"
            size="lg"
            className={`bg-purple-600 ${!canStart && 'opacity-50'}`}
          >
            <View className="flex-row items-center">
              <Brain size={20} color="#ffffff" />
              <Text className="text-white font-semibold text-lg ml-2">Start Recording</Text>
            </View>
          </Button>

          {!canStart && (
            <Text className="text-dark-text-secondary text-center text-sm mt-2">
              Add at least one topic to begin
            </Text>
          )}
        </ScrollView>
      )}

      {step === 'recording' && (
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 py-8">
            {/* Status */}
            <View className="flex-row items-center justify-center mb-6">
              <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
              <Text className="text-dark-text-secondary uppercase tracking-wider text-xs font-semibold">
                Recording
              </Text>
            </View>

            {/* Timer */}
            <View className="items-center mb-8">
              <Text className="text-7xl font-mono text-white font-bold tracking-wider">
                {formatDuration(recorder.duration)}
              </Text>
            </View>

            {/* Audio Visualizer */}
            <View className="mb-8">
              <AudioVisualizer isActive volume={recorder.volume} barCount={35} />
            </View>

            {/* Anchor Points Reminder */}
            <Card variant="default" className="mb-8">
              <Text className="text-dark-text-secondary text-sm mb-3">Your topics:</Text>
              {filledBullets.map((bp, i) => (
                <View key={bp.id} className="flex-row items-center mb-2">
                  <View className="w-5 h-5 bg-purple-600/20 rounded-full items-center justify-center mr-2">
                    <Text className="text-purple-400 text-xs font-semibold">{i + 1}</Text>
                  </View>
                  <Text className="text-white flex-1">{bp.text}</Text>
                </View>
              ))}
            </Card>

            {/* Stop Button */}
            <View className="items-center">
              <TouchableOpacity
                onPress={handleFinishRecording}
                className="w-24 h-24 bg-red-500 rounded-full items-center justify-center shadow-lg active:scale-95"
                style={{
                  shadowColor: '#ef4444',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <View className="w-10 h-10 bg-white rounded-md" />
              </TouchableOpacity>
              <Text className="text-dark-text-secondary mt-4">Tap to stop</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {step === 'transcribing' && (
        <View className="flex-1 items-center justify-center p-6">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-white text-xl font-semibold mt-6 mb-2">Transcribing...</Text>
          <Text className="text-dark-text-secondary text-center">
            Converting your speech to text
          </Text>
        </View>
      )}

      {step === 'synthesizing' && (
        <View className="flex-1 items-center justify-center p-6">
          <ThinkingAnimation />
          <Text className="text-white text-xl font-semibold mb-2">AI is thinking...</Text>
          <Text className="text-dark-text-secondary text-center">
            Organizing your thoughts and generating insights
          </Text>
        </View>
      )}

      {step === 'complete' && (
        <ScrollView className="flex-1 p-6">
          {/* Success Banner */}
          <Card variant="default" className="mb-6 bg-green-900/20 border-green-600/50">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center mr-3">
                <Check size={20} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-green-300 font-semibold text-lg">Success!</Text>
                <Text className="text-green-300/70 text-sm">Your brain dump has been saved</Text>
              </View>
            </View>
          </Card>

          {/* Transcript */}
          {transcription.transcript && (
            <Card variant="default" className="mb-4">
              <Text className="text-dark-text-secondary text-xs uppercase tracking-wide mb-2">
                What you said
              </Text>
              <Text className="text-white text-sm leading-6">{transcription.transcript}</Text>
            </Card>
          )}

          {/* Organized Content */}
          {synthesis && (
            <>
              <Card variant="default" className="mb-4 bg-purple-900/10 border-purple-600/30">
                <View className="flex-row items-center mb-3">
                  <Sparkles size={18} color="#a855f7" />
                  <Text className="text-purple-300 font-semibold ml-2">Organized Thoughts</Text>
                </View>
                <Text className="text-white text-sm leading-6">{synthesis.organizedContent}</Text>
              </Card>

              {/* Insights */}
              {synthesis.insights.length > 0 && (
                <Card variant="default" className="mb-4 bg-blue-900/10 border-blue-600/30">
                  <View className="flex-row items-center mb-3">
                    <Text className="text-xl mr-2">💡</Text>
                    <Text className="text-blue-300 font-semibold">Key Insights</Text>
                  </View>
                  {synthesis.insights.map((insight, i) => (
                    <TouchableOpacity 
                        key={i} 
                        onPress={() => setActiveContext(insight)}
                        className="flex-row items-start mb-2 active:opacity-60"
                    >
                      <Text className="text-blue-400 mr-2">•</Text>
                      <View className="flex-1">
                          <Text className="text-blue-100 text-sm">{insight}</Text>
                          <Text className="text-blue-400/50 text-[10px] uppercase font-bold mt-1">Tap to Plan Action</Text>
                      </View>
                      <ArrowRight size={14} color="#60a5fa" className="mt-1 opacity-50" />
                    </TouchableOpacity>
                  ))}
                </Card>
              )}

              {/* Questions - Now Interactive */}
              {synthesis.questions.length > 0 && (
                <Card variant="default" className="mb-4 bg-yellow-900/10 border-yellow-600/30">
                  <View className="flex-row items-center mb-3">
                    <Text className="text-xl mr-2">❓</Text>
                    <Text className="text-yellow-300 font-semibold">To Explore Further</Text>
                  </View>
                  {synthesis.questions.map((q, i) => (
                    <TouchableOpacity 
                        key={i} 
                        onPress={() => setActiveQuestion(q)}
                        className="flex-row items-start mb-3 p-2 rounded-lg active:bg-yellow-900/20"
                    >
                      <View className="w-5 h-5 bg-yellow-600/20 rounded-full items-center justify-center mr-2 mt-0.5">
                        <Text className="text-yellow-400 text-xs font-semibold">{i + 1}</Text>
                      </View>
                      <View className="flex-1">
                          <Text className="text-yellow-100 text-sm mb-1">{q}</Text>
                          <Text className="text-yellow-500/80 text-xs font-semibold">Tap to answer</Text>
                      </View>
                      <ArrowRight size={16} color="#eab308" className="mt-1 opacity-50" />
                    </TouchableOpacity>
                  ))}
                </Card>
              )}
            </>
          )}

          <Button onPress={handleClose} variant="primary" size="lg">
            Done
          </Button>
        </ScrollView>
      )}
      
      {/* Deep Dive Sheet for Actionable Insights */}
      {activeContext && (
         <DeepDiveSheet 
            index={0} 
            initialContext={activeContext} 
            onClose={() => setActiveContext(null)} 
         />
      )}

      {/* Refinement Modal */}
      <Modal visible={!!activeQuestion} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setActiveQuestion(null)}>
        <View className="flex-1 bg-slate-900 p-6">
             <View className="flex-row justify-between items-center mb-8">
                 <Text className="text-white text-lg font-bold">Refine Analysis</Text>
                 <TouchableOpacity onPress={() => setActiveQuestion(null)}>
                     <X size={24} color="#94a3b8" />
                 </TouchableOpacity>
             </View>
             
             <View className="mb-8">
                 <Text className="text-yellow-400 text-sm font-bold uppercase mb-2">The Question</Text>
                 <Text className="text-white text-xl font-serif">{activeQuestion}</Text>
             </View>
             
             {refinementAnswer ? (
                 <View className="flex-1">
                     <Text className="text-blue-400 text-sm font-bold uppercase mb-2">Your Answer</Text>
                     <TextInput 
                        value={refinementAnswer}
                        onChangeText={setRefinementAnswer}
                        multiline
                        className="bg-slate-800 text-white p-4 rounded-xl text-lg h-40 mb-6"
                        textAlignVertical="top"
                     />
                     <Button onPress={submitRefinement} variant="primary" size="lg" className="mb-4">
                         <View className="flex-row items-center">
                            <Sparkles size={20} color="#fff" />
                            <Text className="text-white font-bold ml-2">Re-Analyze with Context</Text>
                         </View>
                     </Button>
                     <Button onPress={() => setRefinementAnswer('')} variant="secondary" size="sm">
                         Retake Answer
                     </Button>
                 </View>
             ) : (
                 <View className="flex-1 items-center justify-center">
                     <TouchableOpacity 
                        onPress={isRefining ? handleRefinementStop : handleRefinementStart}
                        className={`w-24 h-24 rounded-full items-center justify-center mb-6 ${isRefining ? 'bg-red-500' : 'bg-blue-600'}`}
                     >
                         {isRefining ? <StopCircle size={40} color="#fff" /> : <MicIcon size={40} color="#fff" />}
                     </TouchableOpacity>
                     
                     <Text className="text-white font-bold text-lg mb-1">
                         {isRefining ? 'Listening...' : 'Tap to Answer'}
                     </Text>
                     <Text className="text-slate-400 text-sm text-center px-8">
                         {isRefining ? 'Speak naturally. Tap again to stop.' : 'Your answer will be added to the transcript and the AI will update its analysis.'}
                     </Text>
                     
                     {isRefining && <View className="mt-8 flex-row items-center space-x-2">
                        <View className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <Text className="text-red-400">Recording</Text>
                     </View>}
                 </View>
             )}
        </View>
      </Modal>

    </SafeAreaView>
  );
}
