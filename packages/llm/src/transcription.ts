/**
 * @lcc/transcription
 * 
 * Audio transcription services with privacy-first options:
 * 1. OpenAI Whisper API (BYOK - user provides their key)
 * 2. Web Speech API (completely local, no API needed)
 */

// ============================================================
// TYPES
// ============================================================

export interface TranscriptionResult {
  text: string;
  confidence: number;
  language?: string;
  duration?: number;
  segments?: TranscriptionSegment[];
}

export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  confidence?: number;
}

export interface TranscriptionOptions {
  language?: string;  // e.g., 'en', 'es'
  prompt?: string;    // Hint text to improve accuracy
}

export type TranscriptionService = 'whisper' | 'webspeech' | 'local';

// ============================================================
// OPENAI WHISPER API
// ============================================================

const OPENAI_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

/**
 * Transcribe audio using OpenAI Whisper API
 * Requires user's own API key (BYOK)
 */
export async function transcribeWithWhisper(
  audioBlob: Blob,
  apiKey: string,
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> {
  if (!apiKey) {
    throw new Error('OpenAI API key required for Whisper transcription');
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'verbose_json');
  
  if (options.language) {
    formData.append('language', options.language);
  }
  
  if (options.prompt) {
    formData.append('prompt', options.prompt);
  }

  // Make API request
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error?.message || `Whisper API error: ${response.status}`
    );
  }

  const data = await response.json();
  
  return {
    text: data.text || '',
    confidence: 0.95, // Whisper doesn't provide confidence, assume high
    language: data.language,
    duration: data.duration,
    segments: data.segments?.map((seg: any) => ({
      start: seg.start,
      end: seg.end,
      text: seg.text,
    })),
  };
}

// ============================================================
// WEB SPEECH API (Browser-based, no API key needed)
// ============================================================

/**
 * Check if Web Speech API is available
 */
export function isWebSpeechAvailable(): boolean {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

/**
 * Create a live transcription session using Web Speech API
 * Returns a controller to start/stop and get results
 */
export function createLiveTranscription(options: {
  language?: string;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
}): {
  start: () => void;
  stop: () => string;
  isRunning: () => boolean;
} {
  // @ts-ignore - Browser API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    throw new Error('Web Speech API not supported in this browser');
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = options.interimResults ?? true;
  recognition.lang = options.language || 'en-US';
  
  let fullTranscript = '';
  let isRunning = false;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;
      
      if (result.isFinal) {
        fullTranscript += transcript + ' ';
        options.onResult?.(transcript, true);
      } else {
        interimTranscript += transcript;
        options.onResult?.(interimTranscript, false);
      }
    }
  };

  recognition.onerror = (event: any) => {
    options.onError?.(new Error(event.error));
  };

  recognition.onend = () => {
    isRunning = false;
  };

  return {
    start: () => {
      fullTranscript = '';
      isRunning = true;
      recognition.start();
    },
    stop: () => {
      recognition.stop();
      isRunning = false;
      return fullTranscript.trim();
    },
    isRunning: () => isRunning,
  };
}

/**
 * Transcribe pre-recorded audio using Web Speech API
 * Note: This plays audio silently and transcribes in real-time
 * Less accurate than Whisper but completely local
 */
export async function transcribeWithWebSpeech(
  audioBlob: Blob,
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> {
  return new Promise((resolve, reject) => {
    if (!isWebSpeechAvailable()) {
      reject(new Error('Web Speech API not available'));
      return;
    }

    // Create audio element to play
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.volume = 0; // Silent playback
    
    let fullText = '';
    let sumConfidence = 0;
    let resultCount = 0;

    const liveTranscription = createLiveTranscription({
      language: options.language,
      interimResults: false,
      onResult: (text, isFinal) => {
        if (isFinal) {
          fullText += text + ' ';
          // Web Speech provides confidence per result
          sumConfidence += 0.85; // Approximate average
          resultCount++;
        }
      },
      onError: (error) => {
        cleanup();
        reject(error);
      },
    });

    const cleanup = () => {
      liveTranscription.stop();
      audio.pause();
      URL.revokeObjectURL(audioUrl);
    };

    audio.onended = () => {
      // Wait a bit for final results
      setTimeout(() => {
        cleanup();
        resolve({
          text: fullText.trim(),
          confidence: resultCount > 0 ? sumConfidence / resultCount : 0,
          language: options.language,
          duration: audio.duration,
        });
      }, 1000);
    };

    audio.onerror = () => {
      cleanup();
      reject(new Error('Failed to play audio for transcription'));
    };

    // Start transcription then play audio
    liveTranscription.start();
    audio.play().catch((err) => {
      cleanup();
      reject(err);
    });
  });
}

// ============================================================
// UNIFIED TRANSCRIPTION INTERFACE
// ============================================================

export interface TranscriptionConfig {
  service: TranscriptionService;
  apiKey?: string;  // Required for 'whisper'
  language?: string;
}

/**
 * Transcribe audio using configured service
 */
export async function transcribe(
  audioBlob: Blob,
  config: TranscriptionConfig,
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> {
  const opts = { ...options, language: options.language || config.language };

  switch (config.service) {
    case 'whisper':
      if (!config.apiKey) {
        throw new Error('OpenAI API key required for Whisper');
      }
      return transcribeWithWhisper(audioBlob, config.apiKey, opts);

    case 'webspeech':
      return transcribeWithWebSpeech(audioBlob, opts);

    case 'local':
      // For local, we try Web Speech API
      if (isWebSpeechAvailable()) {
        return transcribeWithWebSpeech(audioBlob, opts);
      }
      throw new Error('No local transcription available');

    default:
      throw new Error(`Unknown transcription service: ${config.service}`);
  }
}

/**
 * Get the best available transcription service
 */
export function getBestTranscriptionService(hasApiKey: boolean): TranscriptionService {
  if (hasApiKey) {
    return 'whisper'; // Best quality
  }
  
  if (isWebSpeechAvailable()) {
    return 'webspeech'; // Works offline
  }

  throw new Error('No transcription service available');
}
