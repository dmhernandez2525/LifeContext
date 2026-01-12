/**
 * useRecorder - React hook for audio recording
 * Integrates with @lcc/audio package
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  AudioRecorder, 
  compressWaveform,
  checkAudioSupport,
  requestMicrophonePermission 
} from '@lcc/audio';
import type { RecordingStatus } from '@lcc/types';

export interface UseRecorderOptions {
  onWaveformUpdate?: (waveform: number[]) => void;
  onDurationUpdate?: (duration: number) => void;
  onTranscriptionUpdate?: (text: string) => void;
  onError?: (error: Error) => void;
  gain?: number;
}

export interface UseRecorderReturn {
  // State
  status: RecordingStatus;
  duration: number;
  waveform: number[];
  audioBlob: Blob | null;
  audioUrl: string | null;
  volume: number;
  
  // Permissions
  hasPermission: boolean | null;
  isSupported: boolean;
  
  // Actions
  start: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => Promise<{ blob: Blob; duration: number }>;
  cancel: () => void;
  requestPermission: () => Promise<boolean>;
  setGain: (value: number) => void;
}

export function useRecorder(options: UseRecorderOptions = {}): UseRecorderReturn {
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [volume, setVolume] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  // Check browser support
  const support = checkAudioSupport();
  const isSupported = support.mediaDevices && support.mediaRecorder && support.audioContext;
  
  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);
  
  // Request microphone permission
  const requestPermission = useCallback(async () => {
    const granted = await requestMicrophonePermission();
    setHasPermission(granted);
    return granted;
  }, []);
  
  // Start recording
  const start = useCallback(async () => {
    if (status !== 'idle') {
      throw new Error('Already recording');
    }
    
    // Cleanup previous audio URL
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    
    // Create new recorder
    const recorder = new AudioRecorder({
      gain: options.gain
    });
    recorderRef.current = recorder;
    
    // Set up event handlers
    recorder.on('onStatusChange', (newStatus) => {
      setStatus(newStatus);
    });
    
    recorder.on('onWaveformUpdate', (data) => {
      setWaveform(data);
      options.onWaveformUpdate?.(data);
    });
    
    recorder.on('onDurationUpdate', (dur) => {
      setDuration(dur);
      options.onDurationUpdate?.(dur);
    });

    recorder.on('onVolumeUpdate', (vol) => {
      setVolume(vol);
    });
    
    recorder.on('onError', (error) => {
      options.onError?.(error);
    });
    
    try {
      await recorder.start();
      setHasPermission(true);
    } catch (error) {
      setHasPermission(false);
      throw error;
    }
  }, [status, options]);
  
  // Set gain
  const setGain = useCallback((value: number) => {
    recorderRef.current?.setGain(value);
  }, []);
  
  // Pause recording
  const pause = useCallback(() => {
    recorderRef.current?.pause();
  }, []);
  
  // Resume recording
  const resume = useCallback(() => {
    recorderRef.current?.resume();
  }, []);
  
  // Stop recording
  const stop = useCallback(async () => {
    if (!recorderRef.current) {
      throw new Error('No active recording');
    }
    
    const result = await recorderRef.current.stop();
    
    // Create playable URL
    const url = URL.createObjectURL(result.blob);
    audioUrlRef.current = url;
    setAudioBlob(result.blob);
    
    // Compress waveform for storage
    const compressed = compressWaveform(result.waveform, 100);
    setWaveform(compressed);
    
    recorderRef.current = null;
    
    return {
      blob: result.blob,
      duration: result.duration,
    };
  }, []);
  
  // Cancel recording
  const cancel = useCallback(() => {
    recorderRef.current?.cancel();
    recorderRef.current = null;
    setStatus('idle');
    setDuration(0);
    setWaveform([]);
  }, []);
  
  return {
    status,
    duration,
    waveform,
    volume,
    audioBlob,
    audioUrl: audioUrlRef.current,
    hasPermission,
    isSupported,
    start,
    pause,
    resume,
    stop,
    cancel,
    requestPermission,
    setGain,
  };
}

export default useRecorder;
