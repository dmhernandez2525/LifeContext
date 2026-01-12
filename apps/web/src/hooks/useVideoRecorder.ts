/**
 * useVideoRecorder - React hook for video recording with audio
 * Used for video journal entries
 */
import { useState, useCallback, useRef, useEffect } from 'react';

// ============================================================
// TYPES
// ============================================================

export type VideoRecordingStatus = 
  | 'idle' 
  | 'requesting-permission'
  | 'recording' 
  | 'paused' 
  | 'stopped'
  | 'error';

export interface UseVideoRecorderOptions {
  onStatusChange?: (status: VideoRecordingStatus) => void;
  onDurationUpdate?: (duration: number) => void;
  onError?: (error: Error) => void;
  /** Video width constraint, default 1280 */
  width?: number;
  /** Video height constraint, default 720 */
  height?: number;
  /** Frame rate, default 30 */
  frameRate?: number;
}

export interface UseVideoRecorderReturn {
  // State
  status: VideoRecordingStatus;
  duration: number;
  videoBlob: Blob | null;
  videoUrl: string | null;
  hasPermission: boolean | null;
  error: Error | null;
  
  // Ref for preview element
  previewRef: React.RefObject<HTMLVideoElement>;
  
  // Actions
  start: () => Promise<void>;
  stop: () => Promise<{ blob: Blob; duration: number }>;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  requestPermission: () => Promise<boolean>;
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

export function useVideoRecorder(options: UseVideoRecorderOptions = {}): UseVideoRecorderReturn {
  const {
    onStatusChange,
    onDurationUpdate,
    onError,
    width = 1280,
    height = 720,
    frameRate = 30,
  } = options;

  const [status, setStatus] = useState<VideoRecordingStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const previewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedDurationRef = useRef<number>(0);

  // Update status with callback
  const updateStatus = useCallback((newStatus: VideoRecordingStatus) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Stop duration interval
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Clear preview
    if (previewRef.current) {
      previewRef.current.srcObject = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [cleanup, videoUrl]);

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      updateStatus('requesting-permission');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: 'user',
          frameRate: { ideal: frameRate },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Stop the stream immediately - we just wanted to check permission
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      updateStatus('idle');
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Permission denied');
      setError(error);
      setHasPermission(false);
      updateStatus('error');
      onError?.(error);
      return false;
    }
  }, [width, height, frameRate, updateStatus, onError]);

  // Start recording
  const start = useCallback(async (): Promise<void> => {
    try {
      // Reset state
      setVideoBlob(null);
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
      }
      setDuration(0);
      setError(null);
      chunksRef.current = [];
      pausedDurationRef.current = 0;

      updateStatus('requesting-permission');

      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: 'user',
          frameRate: { ideal: frameRate },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      setHasPermission(true);

      // Attach to preview
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
        previewRef.current.muted = true; // Prevent echo
        previewRef.current.play().catch(() => {});
      }

      // Determine best MIME type
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      if (!selectedMimeType) {
        throw new Error('No supported video format found');
      }

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event: Event) => {
        const err = new Error((event as ErrorEvent).message || 'Recording error');
        setError(err);
        updateStatus('error');
        onError?.(err);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second

      // Start duration tracking
      startTimeRef.current = Date.now();
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000) + pausedDurationRef.current;
        setDuration(elapsed);
        onDurationUpdate?.(elapsed);
      }, 1000);

      updateStatus('recording');
    } catch (err) {
      cleanup();
      const error = err instanceof Error ? err : new Error('Failed to start recording');
      setError(error);
      updateStatus('error');
      onError?.(error);
      throw error;
    }
  }, [width, height, frameRate, videoUrl, cleanup, updateStatus, onDurationUpdate, onError]);

  // Stop recording
  const stop = useCallback(async (): Promise<{ blob: Blob; duration: number }> => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;
      
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }

      // Stop duration tracking
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      mediaRecorder.onstop = () => {
        // Create blob from chunks
        const blob = new Blob(chunksRef.current, { 
          type: mediaRecorder.mimeType || 'video/webm' 
        });
        
        // Create URL for playback
        const url = URL.createObjectURL(blob);
        
        setVideoBlob(blob);
        setVideoUrl(url);
        updateStatus('stopped');

        // Cleanup stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        // Clear preview
        if (previewRef.current) {
          previewRef.current.srcObject = null;
        }

        resolve({ blob, duration });
      };

      mediaRecorder.stop();
    });
  }, [duration, updateStatus]);

  // Pause recording
  const pause = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      pausedDurationRef.current = duration;
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      
      updateStatus('paused');
    }
  }, [duration, updateStatus]);

  // Resume recording
  const resume = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      
      startTimeRef.current = Date.now();
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000) + pausedDurationRef.current;
        setDuration(elapsed);
        onDurationUpdate?.(elapsed);
      }, 1000);
      
      updateStatus('recording');
    }
  }, [updateStatus, onDurationUpdate]);

  // Cancel recording
  const cancel = useCallback(() => {
    cleanup();
    chunksRef.current = [];
    setDuration(0);
    setVideoBlob(null);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
    pausedDurationRef.current = 0;
    updateStatus('idle');
  }, [cleanup, videoUrl, updateStatus]);

  return {
    status,
    duration,
    videoBlob,
    videoUrl,
    hasPermission,
    error,
    previewRef,
    start,
    stop,
    pause,
    resume,
    cancel,
    requestPermission,
  };
}

export default useVideoRecorder;
