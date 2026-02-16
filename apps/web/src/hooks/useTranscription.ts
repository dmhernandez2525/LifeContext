/**
 * useTranscription - React hook for audio transcription
 * Supports OpenAI Whisper API and Web Speech API
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';

// ============================================================
// TYPES
// ============================================================

export interface TranscriptionResult {
  text: string;
  confidence: number;
  language?: string;
  duration?: number;
}

export interface UseTranscriptionOptions {
  onInterimResult?: (text: string) => void;
  onFinalResult?: (text: string) => void;
  onError?: (error: Error) => void;
}

export interface UseTranscriptionReturn {
  // State
  isTranscribing: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  
  // Capabilities
  hasWhisperKey: boolean;
  hasWebSpeech: boolean;
  
  // Actions for live transcription
  startLive: () => void;
  stopLive: () => string;
  
  // Actions for file transcription
  transcribeBlob: (blob: Blob) => Promise<TranscriptionResult>;
  
  // Reset
  clearTranscript: () => void;
}

// ============================================================
// WEB SPEECH API WRAPPER
// ============================================================

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

function isWebSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
}

// ============================================================
// OPENAI WHISPER API
// ============================================================

async function transcribeWithWhisper(
  audioBlob: Blob,
  apiKey: string
): Promise<TranscriptionResult> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'verbose_json');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Whisper API error: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    text: data.text || '',
    confidence: 0.95,
    language: data.language,
    duration: data.duration,
  };
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

// Web Speech API SpeechRecognition interface (not fully typed by TS)
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export function useTranscription(options: UseTranscriptionOptions = {}): UseTranscriptionReturn {
  const settings = useAppStore((state) => state.settings);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Check capabilities - prefer dedicated whisperApiKey, fall back to shared apiKey
  const whisperKey = settings?.aiProvider?.whisperApiKey || settings?.aiProvider?.apiKey;
  const hasWhisperKey = Boolean(whisperKey);
  const hasWebSpeech = isWebSpeechAvailable();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Start live transcription (Web Speech API)
  const startLive = useCallback(() => {
    if (!hasWebSpeech) {
      setError('Web Speech API not available');
      return;
    }

    try {
      const win = window as unknown as Record<string, unknown>;
      const SpeechRecognitionCtor = (win.SpeechRecognition ?? win.webkitSpeechRecognition) as (new () => SpeechRecognitionInstance) | undefined;
      if (!SpeechRecognitionCtor) {
        setError('Web Speech API not available');
        return;
      }
      const recognition = new SpeechRecognitionCtor();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0]?.transcript ?? '';

          if (result.isFinal) {
            setTranscript(prev => prev + text + ' ');
            options.onFinalResult?.(text);
          } else {
            interim += text;
          }
        }

        setInterimTranscript(interim);
        if (interim) {
          options.onInterimResult?.(interim);
        }
      };

      recognition.onerror = (event) => {
        const errorMessage = event.error;
        const err = new Error(errorMessage);
        setError(errorMessage);
        options.onError?.(err);
      };

      recognition.onend = () => {
        setIsTranscribing(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsTranscribing(true);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start transcription');
      setError(error.message);
      options.onError?.(error);
    }
  }, [hasWebSpeech, options]);

  // Stop live transcription
  const stopLive = useCallback((): string => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsTranscribing(false);
    setInterimTranscript('');
    return transcript;
  }, [transcript]);

  // Transcribe audio blob
  const transcribeBlob = useCallback(async (blob: Blob): Promise<TranscriptionResult> => {
    setIsTranscribing(true);
    setError(null);

    try {
      // Prefer Whisper if API key available (dedicated whisperApiKey or shared apiKey)
      const whisperApiKey = settings?.aiProvider?.whisperApiKey || settings?.aiProvider?.apiKey;
      if (hasWhisperKey && whisperApiKey) {
        const result = await transcribeWithWhisper(blob, whisperApiKey);
        setTranscript(result.text);
        options.onFinalResult?.(result.text);
        return result;
      }

      // Fall back to playing audio with live transcription
      // (This is less accurate but works without API)
      throw new Error('No API key. Use live transcription during recording.');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transcription failed');
      setError(error.message);
      options.onError?.(error);
      throw error;
    } finally {
      setIsTranscribing(false);
    }
  }, [hasWhisperKey, settings, options]);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isTranscribing,
    transcript,
    interimTranscript,
    error,
    hasWhisperKey,
    hasWebSpeech,
    startLive,
    stopLive,
    transcribeBlob,
    clearTranscript,
  };
}

export default useTranscription;
