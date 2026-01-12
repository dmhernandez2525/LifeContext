/**
 * @lcc/audio
 * 
 * Audio recording, waveform analysis, and transcription utilities
 */

import type { RecordingStatus, Transcription } from '@lcc/types';

// ============================================================
// RECORDER CLASS
// ============================================================

export interface RecorderEvents {
  onStatusChange: (status: RecordingStatus) => void;
  onWaveformUpdate: (waveform: number[]) => void;
  onDurationUpdate: (duration: number) => void;
  onVolumeUpdate: (volume: number) => void;
  onError: (error: Error) => void;
}

export interface RecorderConfig {
  sampleRate?: number;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
  gain?: number; // Gain multiplier (1.0 = normal, 2.0 = double)
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;
  private pausedDuration: number = 0;
  private pauseStartTime: number = 0;
  private animationFrameId: number | null = null;
  private status: RecordingStatus = 'idle';

  private events: Partial<RecorderEvents> = {};
  private config: RecorderConfig;

  constructor(config: RecorderConfig = {}) {
    this.config = {
      sampleRate: 44100,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      gain: 2.0, // Default to 2.0 to help with low volume issues reported
      ...config,
    };
  }

  /**
   * Set recording gain (volume boost)
   */
  setGain(value: number): void {
    this.config.gain = value;
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(value, this.audioContext?.currentTime || 0, 0.1);
    }
  }

  /**
   * Set event handlers
   */
  on<K extends keyof RecorderEvents>(event: K, handler: RecorderEvents[K]): void {
    this.events[event] = handler;
  }

  /**
   * Get current status
   */
  getStatus(): RecordingStatus {
    return this.status;
  }

  /**
   * Get current recording duration in seconds
   */
  getDuration(): number {
    if (this.startTime === 0) return 0;
    if (this.status === 'paused') {
      return (this.pauseStartTime - this.startTime - this.pausedDuration) / 1000;
    }
    return (Date.now() - this.startTime - this.pausedDuration) / 1000;
  }

  /**
   * Start recording
   */
  async start(): Promise<void> {
    if (this.status !== 'idle') {
      throw new Error('Recorder is not idle');
    }

    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.config.sampleRate,
          echoCancellation: this.config.echoCancellation,
          noiseSuppression: this.config.noiseSuppression,
          autoGainControl: this.config.autoGainControl,
        },
      });

      // Setup audio processing pipeline
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.config.gain || 1.0;
      
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      const destination = this.audioContext.createMediaStreamDestination();
      
      // Connect nodes: Source -> Gain -> Analyser -> Destination
      source.connect(this.gainNode);
      this.gainNode.connect(this.analyser);
      this.analyser.connect(destination);

      // Setup MediaRecorder using the processed stream
      this.mediaRecorder = new MediaRecorder(destination.stream, {
        mimeType: this.getSupportedMimeType(),
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onerror = (_event) => {
        const error = new Error('Recording error');
        this.setStatus('failed');
        this.events.onError?.(error);
      };

      // Start recording
      this.mediaRecorder.start(100); // Collect data every 100ms
      this.startTime = Date.now();
      this.pausedDuration = 0;
      this.audioChunks = [];
      this.setStatus('recording');

      // Start waveform animation
      this.startWaveformAnimation();
    } catch (error) {
      this.setStatus('failed');
      throw error;
    }
  }

  /**
   * Pause recording
   */
  pause(): void {
    if (this.status !== 'recording') {
      throw new Error('Cannot pause: not recording');
    }

    this.mediaRecorder?.pause();
    this.pauseStartTime = Date.now();
    this.setStatus('paused');
    this.stopWaveformAnimation();
  }

  /**
   * Resume recording
   */
  resume(): void {
    if (this.status !== 'paused') {
      throw new Error('Cannot resume: not paused');
    }

    this.mediaRecorder?.resume();
    this.pausedDuration += Date.now() - this.pauseStartTime;
    this.setStatus('recording');
    this.startWaveformAnimation();
  }

  /**
   * Stop recording and return audio blob
   */
  async stop(): Promise<{ blob: Blob; duration: number; waveform: number[] }> {
    if (this.status !== 'recording' && this.status !== 'paused') {
      throw new Error('Cannot stop: not recording');
    }

    const duration = this.getDuration();
    this.stopWaveformAnimation();

    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve({ blob: new Blob(), duration: 0, waveform: [] });
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, {
          type: this.getSupportedMimeType(),
        });

        // Cleanup
        this.stream?.getTracks().forEach((track) => track.stop());
        this.audioContext?.close();
        this.mediaRecorder = null;
        this.stream = null;
        this.audioContext = null;
        this.analyser = null;
        this.gainNode = null;
        this.audioChunks = [];
        this.setStatus('idle');

        resolve({
          blob,
          duration,
          waveform: this.getWaveform(),
        });
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Cancel recording and discard audio
   */
  cancel(): void {
    this.stopWaveformAnimation();
    this.mediaRecorder?.stop();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.audioContext?.close();
    this.mediaRecorder = null;
    this.stream = null;
    this.audioContext = null;
    this.analyser = null;
    this.gainNode = null;
    this.audioChunks = [];
    this.setStatus('idle');
  }

  /**
   * Get current waveform data (normalized -1 to 1)
   */
  getWaveform(): number[] {
    if (!this.analyser) return [];

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);

    // Normalize to -1 to 1
    return Array.from(dataArray).map((v) => (v - 128) / 128);
  }

  /**
   * Get audio quality indicator (0-1)
   * Based on signal level and noise
   */
  getAudioQuality(): number {
    if (!this.analyser) return 0;

    const waveform = this.getWaveform();
    if (waveform.length === 0) return 0;

    // Calculate RMS (root mean square) for volume level
    const rms = Math.sqrt(
      waveform.reduce((sum, v) => sum + v * v, 0) / waveform.length
    );

    // Map to 0-1 range (0.05 is very quiet, 0.5 is loud)
    const quality = Math.min(1, rms / 0.3);
    return quality;
  }

  private setStatus(status: RecordingStatus): void {
    this.status = status;
    this.events.onStatusChange?.(status);
  }

  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm';
  }

  private startWaveformAnimation(): void {
    const update = () => {
      if (this.status === 'recording') {
        this.events.onWaveformUpdate?.(this.getWaveform());
        this.events.onDurationUpdate?.(this.getDuration());
        this.events.onVolumeUpdate?.(this.getAudioQuality());
        this.animationFrameId = requestAnimationFrame(update);
      }
    };
    update();
  }

  private stopWaveformAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

// ============================================================
// WAVEFORM UTILITIES
// ============================================================

/**
 * Compress waveform data to a smaller array for storage/display
 */
export function compressWaveform(
  waveform: number[],
  targetLength: number = 100
): number[] {
  if (waveform.length <= targetLength) return waveform;

  const compressed: number[] = [];
  const ratio = waveform.length / targetLength;

  for (let i = 0; i < targetLength; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.floor((i + 1) * ratio);
    const slice = waveform.slice(start, end);

    // Use max absolute value for better visualization
    const max = Math.max(...slice.map(Math.abs));
    compressed.push(max);
  }

  return compressed;
}

/**
 * Generate a placeholder waveform for testing/demo
 */
export function generatePlaceholderWaveform(length: number = 100): number[] {
  return Array.from({ length }, () => Math.random() * 0.8);
}

// ============================================================
// AUDIO UTILITIES
// ============================================================

/**
 * Convert audio blob to base64 string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // Remove data URL prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert base64 string to audio blob
 */
export function base64ToBlob(base64: string, mimeType: string = 'audio/webm'): Blob {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

/**
 * Get audio duration from blob
 */
export async function getAudioDuration(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.onerror = reject;
    audio.src = URL.createObjectURL(blob);
  });
}

/**
 * Create playable URL from audio blob
 */
export function createAudioUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Revoke audio URL to free memory
 */
export function revokeAudioUrl(url: string): void {
  URL.revokeObjectURL(url);
}

// ============================================================
// TRANSCRIPTION INTERFACE
// ============================================================

export interface TranscriptionProvider {
  name: string;
  transcribe(audioBlob: Blob): Promise<Transcription>;
  isAvailable(): Promise<boolean>;
}

/**
 * Check if browser supports required audio APIs
 */
export function checkAudioSupport(): {
  mediaDevices: boolean;
  mediaRecorder: boolean;
  audioContext: boolean;
} {
  return {
    mediaDevices: 'mediaDevices' in navigator,
    mediaRecorder: 'MediaRecorder' in window,
    audioContext: 'AudioContext' in window || 'webkitAudioContext' in window,
  };
}

/**
 * Request microphone permission
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}

/**
 * Check microphone permission status
 */
export async function getMicrophonePermissionStatus(): Promise<PermissionState> {
  try {
    const result = await navigator.permissions.query({
      name: 'microphone' as PermissionName,
    });
    return result.state;
  } catch {
    // Safari doesn't support permissions query for microphone
    return 'prompt';
  }
}
