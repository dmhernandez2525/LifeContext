import { useEffect, useMemo, useRef, useState } from 'react';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultLike[];
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface WindowWithSpeech {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

interface StartListeningOptions {
  language?: string;
  onFinalTranscript: (transcript: string) => void;
}

interface UseSpeechRecognitionResult {
  isSupported: boolean;
  isListening: boolean;
  interimTranscript: string;
  errorMessage: string | null;
  startListening: (options: StartListeningOptions) => void;
  stopListening: () => void;
}

const getRecognitionConstructor = (): SpeechRecognitionConstructor | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const win = window as WindowWithSpeech;
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
};

export const useSpeechRecognition = (): UseSpeechRecognitionResult => {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSupported = useMemo(() => getRecognitionConstructor() !== null, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, []);

  const stopListening = (): void => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  };

  const startListening = (options: StartListeningOptions): void => {
    const Recognition = getRecognitionConstructor();
    if (!Recognition) {
      setErrorMessage('Voice input is not supported in this browser.');
      return;
    }

    try {
      recognitionRef.current?.stop();

      const recognition = new Recognition();
      recognition.lang = options.language ?? 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEventLike): void => {
        let finalTranscript = '';
        let interim = '';

        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const result = event.results[index];
          const value = result[0]?.transcript ?? '';

          if (result.isFinal) {
            finalTranscript += value;
          } else {
            interim += value;
          }
        }

        setInterimTranscript(interim);

        if (finalTranscript.trim()) {
          options.onFinalTranscript(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike): void => {
        setErrorMessage(`Voice input failed: ${event.error}`);
      };

      recognition.onend = (): void => {
        setIsListening(false);
        setInterimTranscript('');
        recognitionRef.current = null;
      };

      setErrorMessage(null);
      setInterimTranscript('');
      setIsListening(true);
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setErrorMessage('Voice input could not be started.');
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  return {
    isSupported,
    isListening,
    interimTranscript,
    errorMessage,
    startListening,
    stopListening,
  };
};
