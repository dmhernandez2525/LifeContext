import { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import { SafeHaptics as Haptics } from '../lib/haptics';

export interface RecorderState {
  status: 'idle' | 'recording' | 'paused';
  duration: number;
  uri: string | null;
  metering: number;
}

export function useAudioRecorder() {
  const [state, setState] = useState<RecorderState>({
    status: 'idle',
    duration: 0,
    uri: null,
    metering: -160,
  });
  
  const recordingRef = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  const startTimer = () => {
    stopTimer();
    intervalRef.current = setInterval(() => {
      setState(s => ({ ...s, duration: s.duration + 1 }));
      // Optional: Update metering here if we enabled it
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert(
          'Microphone Permission Required',
          'Please grant microphone access in Settings to record audio.',
          [{ text: 'OK' }]
        );
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      startTimer();
      
      setState({
        status: 'recording',
        duration: 0,
        uri: null,
        metering: -160
      });
      
      return true;
    } catch {
      // Recording failed to start - permission or hardware issue
      return false;
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return null;

    try {
      stopTimer();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      setState(s => ({ ...s, status: 'idle', uri }));
      recordingRef.current = null;

      return uri;
    } catch {
      // Recording failed to stop - likely already stopped or unloaded
      return null;
    }
  };

  const pauseRecording = async () => {
    if (!recordingRef.current) return;
    await recordingRef.current.pauseAsync();
    stopTimer();
    setState(s => ({ ...s, status: 'paused' }));
  };

  const resumeRecording = async () => {
    if (!recordingRef.current) return;
    await recordingRef.current.startAsync();
    startTimer();
    setState(s => ({ ...s, status: 'recording' }));
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    formatDuration: (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
    }
  };
}
