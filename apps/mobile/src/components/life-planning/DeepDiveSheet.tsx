import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { BaseBottomSheet } from '../navigation/BottomSheets/BaseBottomSheet';
import { Mic, ArrowRight, StopCircle, RefreshCw, Check, X } from 'lucide-react-native';
import { Audio } from 'expo-av';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { saveTask } from '../../lib/storage'; // Direct storage
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

interface DeepDiveSheetProps {
    index: number;
    initialContext?: string;
    onClose?: () => void;
}

type Step = 'recording' | 'processing' | 'review' | 'success';

export function DeepDiveSheet({ index, initialContext = '', onClose }: DeepDiveSheetProps) {
    const { dismiss } = useBottomSheetModal();
    const [step, setStep] = useState<Step>('recording');
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [duration, setDuration] = useState(0);
    const [transcript, setTranscript] = useState('');
    const [generatedTask, setGeneratedTask] = useState({ title: '', description: '', priority: 'medium' });
    
    // Animation
    const pulse = useSharedValue(1);

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (recording) {
            interval = setInterval(() => setDuration(d => d + 1), 1000);
            pulse.value = withRepeat(
                withSequence(withTiming(1.2, { duration: 500 }), withTiming(1, { duration: 500 })),
                -1,
                true
            );
        } else {
            pulse.value = withTiming(1);
        }
        return () => clearInterval(interval);
    }, [recording]);

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            setRecording(recording);
        } catch (err) {
            Alert.alert('Error', 'Failed to start recording');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setStep('processing');
        
        // Mock AI Processing
        setTimeout(() => {
            // Simulate transcription and analysis
            setTranscript("I really want to start training for a marathon next year. I need to buy running shoes, find a training plan, and maybe join a local club.");
            setGeneratedTask({
                title: 'Train for Marathon',
                description: 'Plan and execute marathon training.\n\n- Buy running shoes\n- Find training plan\n- Join local club',
                priority: 'high'
            });
            setStep('review');
        }, 2000);
    };

    const handleSave = () => {
        saveTask({
            title: generatedTask.title,
            description: generatedTask.description,
            priority: generatedTask.priority as any,
            status: 'todo',
            category: 'Life Goal', // Default to life goal since we are in that flow
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Due in 1 week
        });
        setStep('success');
        setTimeout(() => {
            dismiss();
            onClose?.();
        }, 1000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const micStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        backgroundColor: recording ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.1)'
    }));

    return (
        <BaseBottomSheet index={index} snapPoints={['60%', '85%']} onClose={onClose}>
            <View className="flex-1 p-6 bg-slate-900">
                <View className="items-center mb-6">
                    <Text className="text-white text-xl font-bold font-inter-bold">Deep Dive Planning</Text>
                    <Text className="text-slate-400 text-sm text-center mt-2">
                        {step === 'recording' ? 'Speak your mind. We will structure it.' : 
                         step === 'processing' ? 'Analyzing your thoughts...' : 
                         step === 'review' ? 'Review & Refine' : 'Saved!'}
                    </Text>
                </View>

                {step === 'recording' && (
                    <View className="flex-1 items-center justify-center">
                        <Animated.View style={[micStyle]} className="p-8 rounded-full mb-8">
                             <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                                {recording ? <StopCircle size={48} color="#ef4444" /> : <Mic size={48} color="#3b82f6" />}
                             </TouchableOpacity>
                        </Animated.View>
                        <Text className="text-slate-200 text-3xl font-mono mb-2">{formatTime(duration)}</Text>
                        <Text className="text-slate-500 text-sm">
                            {recording ? 'Recording... Tap to stop' : 'Tap mic to start'}
                        </Text>
                        {initialContext ? (
                            <View className="mt-8 p-4 bg-slate-800/50 rounded-xl max-w-xs">
                                <Text className="text-slate-400 text-xs italic">Context: "{initialContext}"</Text>
                            </View>
                        ) : null}
                    </View>
                )}

                {step === 'processing' && (
                     <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text className="text-slate-400 mt-4 text-sm font-medium">Extracting Action Items...</Text>
                     </View>
                )}

                {step === 'review' && (
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                        <ScrollView className="flex-1">
                            <View className="mb-4">
                                <Text className="text-slate-500 text-xs uppercase font-bold mb-2">Goal Title</Text>
                                <TextInput
                                    value={generatedTask.title}
                                    onChangeText={(t) => setGeneratedTask({...generatedTask, title: t})}
                                    className="bg-slate-800 text-white rounded-xl p-4 text-lg font-bold"
                                />
                            </View>
                             <View className="mb-4 flex-1">
                                <Text className="text-slate-500 text-xs uppercase font-bold mb-2">Plan & Subtasks</Text>
                                <TextInput
                                    value={generatedTask.description}
                                    onChangeText={(t) => setGeneratedTask({...generatedTask, description: t})}
                                    multiline
                                    textAlignVertical="top"
                                    className="bg-slate-800 text-white rounded-xl p-4 h-40"
                                />
                            </View>
                        </ScrollView>
                        <View className="flex-row space-x-3 mt-4 pt-4 border-t border-white/5">
                            <TouchableOpacity onPress={() => setStep('recording')} className="flex-1 py-4 bg-slate-800 rounded-xl items-center">
                                <RefreshCw size={20} color="#94a3b8" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} className="flex-[3] py-4 bg-blue-600 rounded-xl items-center flex-row justify-center space-x-2">
                                <Check size={20} color="#fff" />
                                <Text className="text-white font-bold">Create Action Plan</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                )}

                {step === 'success' && (
                    <View className="flex-1 items-center justify-center">
                        <View className="w-20 h-20 bg-green-500/20 rounded-full items-center justify-center mb-4">
                            <Check size={40} color="#22c55e" />
                        </View>
                        <Text className="text-white text-xl font-bold">Plan Created</Text>
                    </View>
                )}
            </View>
        </BaseBottomSheet>
    );
}
