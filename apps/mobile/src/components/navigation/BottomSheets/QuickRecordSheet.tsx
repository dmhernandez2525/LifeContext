/**
 * QuickRecordSheet - Minimal friction recording bottom sheet
 * 
 * Opens from FAB for quick voice capture without full screen transition.
 * Features:
 * - One-tap recording
 * - Mini waveform visualization
 * - Duration display
 * - Save or cancel
 */
import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeHaptics as Haptics } from '../../../lib/haptics';
import { useRouter } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { Mic, Square, X, Check, Pause, Play } from 'lucide-react-native';

import { BaseBottomSheet } from './BaseBottomSheet';
import { useRecorder } from '../../../hooks';
import * as storage from '../../../lib/storage';

// ============================================================
// TYPES
// ============================================================

interface QuickRecordSheetProps {
  onClose?: () => void;
  questionId?: string;
  questionText?: string;
}

// ============================================================
// MINI WAVEFORM
// ============================================================

function MiniWaveform({ isRecording }: { isRecording: boolean }) {
  const bars = 12;
  
  return (
    <View style={styles.waveformContainer}>
      {Array.from({ length: bars }).map((_, i) => (
        <AnimatedBar key={i} index={i} isRecording={isRecording} />
      ))}
    </View>
  );
}

function AnimatedBar({ index, isRecording }: { index: number; isRecording: boolean }) {
  const height = useSharedValue(4);
  
  useEffect(() => {
    if (isRecording) {
      height.value = withRepeat(
        withTiming(20 + Math.random() * 20, { duration: 200 + index * 50 }),
        -1,
        true
      );
    } else {
      height.value = withSpring(4);
    }
  }, [isRecording, index]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));
  
  return (
    <Animated.View 
      style={[
        styles.waveformBar, 
        animatedStyle,
        { backgroundColor: isRecording ? '#3b82f6' : '#64748b' }
      ]} 
    />
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export const QuickRecordSheet = forwardRef<any, QuickRecordSheetProps>(
  ({ onClose, questionId, questionText }, ref) => {
    const router = useRouter();
    const { 
      start, 
      stop, 
      pause,
      resume,
      status, 
      duration, 
    } = useRecorder();
    
    // Derive booleans from status
    const isRecording = status === 'recording' || status === 'paused';
    const isPaused = status === 'paused';
    
    // Format duration helper
    const formatDuration = (secs: number): string => {
      const mins = Math.floor(secs / 60);
      const s = secs % 60;
      return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
    
    const [isSaving, setIsSaving] = useState(false);
    const pulseScale = useSharedValue(1);

    // Pulse animation when recording
    useEffect(() => {
      if (isRecording && !isPaused) {
        pulseScale.value = withRepeat(
          withTiming(1.1, { duration: 1000 }),
          -1,
          true
        );
      } else {
        pulseScale.value = withSpring(1);
      }
    }, [isRecording, isPaused]);

    const handleStart = useCallback(async () => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      await start();
    }, [start]);

    const handlePause = useCallback(async () => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      await pause();
    }, [pause]);

    const handleResume = useCallback(async () => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      await resume();
    }, [resume]);

    const handleSave = useCallback(async () => {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      setIsSaving(true);
      try {
        const result = await stop();
        
        if (result?.uri) {
          // Save to storage with correct signature
          await storage.saveRecording(
            questionId || '',
            result.uri,
            result.duration,
            '' // No transcription yet
          );
        }
      } catch {
        // Save failed - recording data lost
      }
      
      setIsSaving(false);
      onClose?.();
    }, [stop, questionId, onClose]);

    const handleCancel = useCallback(async () => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      try {
        await stop();
      } catch {
        // Ignore if no recording
      }
      onClose?.();
    }, [stop, onClose]);

    const pulseStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pulseScale.value }],
    }));

    return (
      <BaseBottomSheet
        ref={ref}
        snapPoints={['40%']}
        onDismiss={onClose}
        index={0}
      >
        <View style={styles.container}>
          {/* Question Context (if any) */}
          {questionText && (
            <Animated.View 
              entering={FadeIn.duration(200)}
              style={styles.questionContainer}
            >
              <Text style={styles.questionLabel}>Answering:</Text>
              <Text style={styles.questionText} numberOfLines={2}>
                {questionText}
              </Text>
            </Animated.View>
          )}

          {/* Waveform */}
          <View style={styles.waveformSection}>
            <MiniWaveform isRecording={isRecording && !isPaused} />
          </View>

          {/* Duration */}
          <Text style={styles.duration}>
            {formatDuration(duration)}
          </Text>

          {/* Controls */}
          <View style={styles.controls}>
            {/* Cancel */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleCancel}
              disabled={isSaving}
            >
              <X size={24} color="#ef4444" />
            </TouchableOpacity>

            {/* Main Record/Pause Button */}
            <Animated.View style={pulseStyle}>
              <TouchableOpacity
                style={[
                  styles.mainButton,
                  isRecording && !isPaused && styles.mainButtonRecording,
                ]}
                onPress={isRecording ? (isPaused ? handleResume : handlePause) : handleStart}
                disabled={isSaving}
              >
                {isRecording ? (
                  isPaused ? (
                    <Play size={32} color="#ffffff" />
                  ) : (
                    <Pause size={32} color="#ffffff" />
                  )
                ) : (
                  <Mic size={32} color="#ffffff" />
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Save */}
            <TouchableOpacity
              style={[styles.secondaryButton, !isRecording && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={!isRecording || isSaving}
            >
              {isRecording ? (
                <Check size={24} color="#10b981" />
              ) : (
                <Square size={24} color="#64748b" />
              )}
            </TouchableOpacity>
          </View>

          {/* Status */}
          <Text style={styles.statusText}>
            {isSaving ? 'Saving...' : (
              isRecording 
                ? (isPaused ? 'Paused' : 'Recording...') 
                : 'Tap to start recording'
            )}
          </Text>
        </View>
      </BaseBottomSheet>
    );
  }
);

QuickRecordSheet.displayName = 'QuickRecordSheet';

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
  },
  questionContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  questionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#60a5fa',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#f8fafc',
    lineHeight: 20,
  },
  waveformSection: {
    height: 60,
    justifyContent: 'center',
    marginBottom: 8,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
  },
  duration: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    color: '#f8fafc',
    marginBottom: 24,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  mainButtonRecording: {
    backgroundColor: '#ef4444',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#94a3b8',
    marginTop: 16,
  },
});
