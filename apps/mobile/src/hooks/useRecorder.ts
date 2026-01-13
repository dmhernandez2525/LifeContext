/**
 * useRecorder - React Native hook for audio recording
 * Uses expo-av for audio capture
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { SafeHaptics as Haptics } from '../lib/haptics';

// ============================================================
// TYPES
// ============================================================

export type RecordingStatus = 'idle' | 'requesting-permission' | 'recording' | 'paused' | 'stopped' | 'error';

export interface UseRecorderOptions {
  onStatusChange?: (status: RecordingStatus) => void;
  onDurationUpdate?: (duration: number) => void;
  onError?: (error: Error) => void;
}

export interface UseRecorderReturn {
  status: RecordingStatus;
  duration: number;
  audioUri: string | null;
  hasPermission: boolean | null;
  error: Error | null;
  volume: number;
  
  start: () => Promise<void>;
  stop: () => Promise<{ uri: string; duration: number }>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  cancel: () => void;
  requestPermission: () => Promise<boolean>;
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

export function useRecorder(options: UseRecorderOptions = {}): UseRecorderReturn {
  const { onStatusChange, onDurationUpdate, onError } = options;
  
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [volume, setVolume] = useState(0);
  
  const recordingRef = useRef<Audio.Recording | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update status with callback
  const updateStatus = useCallback((newStatus: RecordingStatus) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);
  
  // Cleanup
  const cleanup = useCallback(async () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch {
        // Already stopped
      }
      recordingRef.current = null;
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);
  
  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      updateStatus('requesting-permission');
      
      const { status: permStatus } = await Audio.requestPermissionsAsync();
      const granted = permStatus === 'granted';
      
      setHasPermission(granted);
      updateStatus('idle');
      
      if (!granted) {
        setError(new Error('Microphone permission denied'));
      }
      
      return granted;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Permission request failed');
      setError(error);
      updateStatus('error');
      onError?.(error);
      return false;
    }
  }, [updateStatus, onError]);
  
  // Start recording
  const start = useCallback(async (): Promise<void> => {
    try {
      // Check permission
      if (hasPermission === null) {
        const granted = await requestPermission();
        if (!granted) return;
      } else if (!hasPermission) {
        throw new Error('Microphone permission not granted');
      }
      
      // Reset state
      setAudioUri(null);
      setDuration(0);
      setError(null);
      setVolume(0);
      
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      // Create and start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          if (status.isRecording) {
            // Calculate volume from metering
            const metering = status.metering ?? -160;
            const normalizedVolume = Math.max(0, Math.min(1, (metering + 160) / 160));
            setVolume(normalizedVolume);
          }
        },
        100 // Update every 100ms
      );
      
      recordingRef.current = recording;
      
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Start duration timer
      const startTime = Date.now();
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setDuration(elapsed);
        onDurationUpdate?.(elapsed);
      }, 1000);
      
      updateStatus('recording');
    } catch (err) {
      await cleanup();
      const error = err instanceof Error ? err : new Error('Failed to start recording');
      setError(error);
      updateStatus('error');
      onError?.(error);
    }
  }, [hasPermission, requestPermission, cleanup, updateStatus, onDurationUpdate, onError]);
  
  // Stop recording
  const stop = useCallback(async (): Promise<{ uri: string; duration: number }> => {
    if (!recordingRef.current) {
      throw new Error('No active recording');
    }
    
    // Stop timer
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    
    const finalDuration = duration;
    
    // Stop recording
    await recordingRef.current.stopAndUnloadAsync();
    const uri = recordingRef.current.getURI();
    recordingRef.current = null;
    
    if (!uri) {
      throw new Error('No recording URI');
    }
    
    // Reset audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    
    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setAudioUri(uri);
    updateStatus('stopped');
    
    return { uri, duration: finalDuration };
  }, [duration, updateStatus]);
  
  // Pause recording
  const pause = useCallback(async (): Promise<void> => {
    if (!recordingRef.current) return;
    
    await recordingRef.current.pauseAsync();
    
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateStatus('paused');
  }, [updateStatus]);
  
  // Resume recording
  const resume = useCallback(async (): Promise<void> => {
    if (!recordingRef.current) return;
    
    await recordingRef.current.startAsync();
    
    // Restart timer from current duration
    const pausedDuration = duration;
    const resumeTime = Date.now();
    durationIntervalRef.current = setInterval(() => {
      const elapsed = pausedDuration + Math.floor((Date.now() - resumeTime) / 1000);
      setDuration(elapsed);
      onDurationUpdate?.(elapsed);
    }, 1000);
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateStatus('recording');
  }, [duration, updateStatus, onDurationUpdate]);
  
  // Cancel recording
  const cancel = useCallback(() => {
    cleanup();
    setAudioUri(null);
    setDuration(0);
    setVolume(0);
    updateStatus('idle');
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, [cleanup, updateStatus]);
  
  return {
    status,
    duration,
    audioUri,
    hasPermission,
    error,
    volume,
    start,
    stop,
    pause,
    resume,
    cancel,
    requestPermission,
  };
}

export default useRecorder;
