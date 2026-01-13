import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Video, ResizeMode } from 'expo-av';
import { X, RefreshCw, Check, Video as VideoIcon, StopCircle } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';

interface VideoRecorderProps {
    onSave: (uri: string, duration: number) => void;
    onCancel: () => void;
}

export function VideoRecorder({ onSave, onCancel }: VideoRecorderProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('front');
    const [isRecording, setIsRecording] = useState(false);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [duration, setDuration] = useState(0);
    const cameraRef = useRef<CameraView>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // No need for useVideoPlayer hook with expo-av legacy/standard component

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    if (!permission) {
        return <View className="flex-1 bg-black justify-center items-center"><ActivityIndicator /></View>;
    }
    if (!permission.granted) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <Text className="text-white text-center mb-4">Camera permission is required</Text>
                <TouchableOpacity onPress={requestPermission} className="bg-blue-600 px-4 py-2 rounded-lg">
                    <Text className="text-white">Grant Permission</Text>
                </TouchableOpacity>
                 <TouchableOpacity onPress={onCancel} className="mt-4">
                    <Text className="text-slate-400">Cancel</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const startRecording = async () => {
        if (cameraRef.current) {
            try {
                setIsRecording(true);
                setDuration(0);
                timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
                
                const video = await cameraRef.current.recordAsync({
                    maxDuration: 60 * 5, // 5 mins cap
                    // quality: '720p', // Removed invalid prop
                });
                
                if (video) {
                    setVideoUri(video.uri);
                    setIsRecording(false); // Ensure state is synced
                    if (timerRef.current) clearInterval(timerRef.current);
                }
            } catch (e) {
                console.error("Recording failed", e);
                setIsRecording(false);
                if (timerRef.current) clearInterval(timerRef.current);
            }
        }
    };

    const stopRecording = () => {
        if (cameraRef.current && isRecording) {
            cameraRef.current.stopRecording();
            setIsRecording(false); // Optimistic update
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Review Mode
    if (videoUri) {
        return (
            <View className="flex-1 bg-black">
                <Video
                    source={{ uri: videoUri }}
                    style={StyleSheet.absoluteFill}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    shouldPlay
                    useNativeControls
                />
                <View className="absolute bottom-10 left-0 right-0 flex-row justify-center space-x-8 px-8 items-center">
                     <TouchableOpacity 
                        onPress={() => {
                            setVideoUri(null);
                            setDuration(0);
                        }} 
                        className="w-16 h-16 bg-slate-800/80 rounded-full items-center justify-center border border-slate-600"
                    >
                        <RefreshCw size={24} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => onSave(videoUri, duration)} 
                        className="w-20 h-20 bg-green-500 rounded-full items-center justify-center shadow-lg shadow-green-900/50"
                    >
                        <Check size={40} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Capture Mode
    return (
        <View className="flex-1 bg-black relative">
            <CameraView 
                ref={cameraRef} 
                className="flex-1" 
                facing={facing} 
                mode="video"
            >
                <View className="flex-1 justify-between py-12 px-6">
                    {/* Top Controls */}
                    <View className="flex-row justify-between items-center">
                         <TouchableOpacity onPress={onCancel} className="w-10 h-10 bg-black/40 rounded-full items-center justify-center">
                            <X size={24} color="#fff" />
                        </TouchableOpacity>
                        {isRecording && (
                             <View className="bg-red-500/80 px-3 py-1 rounded-full">
                                <Text className="text-white font-mono font-bold">{formatTime(duration)}</Text>
                            </View>
                        )}
                        <TouchableOpacity 
                            onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
                            disabled={isRecording}
                            className="w-10 h-10 bg-black/40 rounded-full items-center justify-center"
                        >
                            <RefreshCw size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Controls */}
                    <View className="items-center mb-8">
                         <TouchableOpacity
                            onPress={isRecording ? stopRecording : startRecording}
                            className={`w-20 h-20 rounded-full border-4 border-white items-center justify-center ${
                                isRecording ? 'bg-red-500' : 'bg-transparent'
                            }`}
                         >
                            {isRecording ? (
                                <View className="w-8 h-8 bg-white rounded-md" />
                            ) : (
                                <View className="w-16 h-16 bg-red-500 rounded-full m-1" />
                            )}
                         </TouchableOpacity>
                         <Text className="text-white text-xs mt-4 font-medium opacity-80">
                             {isRecording ? 'Tap to stop' : 'Tap to record video'}
                         </Text>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}
