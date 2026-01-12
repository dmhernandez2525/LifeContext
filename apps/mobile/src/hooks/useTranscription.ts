/**
 * useTranscription - React Native hook for audio transcription
 * Uses OpenAI Whisper API
 */
import { useState, useCallback } from 'react';
import * as FileSystem from 'expo-file-system';
import { getSettings } from '../lib/storage';

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
  onResult?: (text: string) => void;
  onError?: (error: Error) => void;
}

export interface UseTranscriptionReturn {
  isTranscribing: boolean;
  transcript: string;
  error: string | null;
  hasWhisperKey: boolean;
  
  transcribeAudio: (audioUri: string) => Promise<TranscriptionResult>;
  clearTranscript: () => void;
}

// ============================================================
// WHISPER API
// ============================================================

async function transcribeWithWhisper(
  audioUri: string,
  apiKey: string
): Promise<TranscriptionResult> {
  // Read audio file as base64
  const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  
  // Get file info for extension
  const fileInfo = await FileSystem.getInfoAsync(audioUri);
  const fileName = audioUri.split('/').pop() || 'recording.m4a';
  
  // Create form data
  const formData = new FormData();
  formData.append('file', {
    uri: audioUri,
    type: 'audio/m4a',
    name: fileName,
  } as unknown as Blob);
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
// FALLBACK (Demo)
// ============================================================

function generateDemoTranscription(): TranscriptionResult {
  const demoTexts = [
    "I've been thinking about my goals lately and what I really want to achieve.",
    "Today was a good day. I made progress on my projects and felt productive.",
    "I need to remember to take more breaks and practice self-care.",
    "I'm grateful for the people in my life who support me.",
    "There are some things I want to change about my daily routine.",
  ];
  
  return {
    text: demoTexts[Math.floor(Math.random() * demoTexts.length)],
    confidence: 0.85,
    language: 'en',
    duration: 5,
  };
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

export function useTranscription(options: UseTranscriptionOptions = {}): UseTranscriptionReturn {
  const { onResult, onError } = options;
  
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Check for Whisper API key
  const settings = getSettings();
  const whisperKey = settings.whisperApiKey || settings.apiKey;
  const hasWhisperKey = Boolean(whisperKey);
  
  // Transcribe audio file
  const transcribeAudio = useCallback(async (audioUri: string): Promise<TranscriptionResult> => {
    setIsTranscribing(true);
    setError(null);
    
    try {
      let result: TranscriptionResult;
      
      if (hasWhisperKey && whisperKey) {
        result = await transcribeWithWhisper(audioUri, whisperKey);
      } else {
        // Demo mode - generate placeholder
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
        result = generateDemoTranscription();
      }
      
      setTranscript(result.text);
      onResult?.(result.text);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transcription failed');
      setError(error.message);
      onError?.(error);
      
      // Return demo on error
      const demo = generateDemoTranscription();
      setTranscript(demo.text);
      return demo;
    } finally {
      setIsTranscribing(false);
    }
  }, [hasWhisperKey, whisperKey, onResult, onError]);
  
  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);
  
  return {
    isTranscribing,
    transcript,
    error,
    hasWhisperKey,
    transcribeAudio,
    clearTranscript,
  };
}

export default useTranscription;
