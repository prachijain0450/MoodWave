import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useSpeechRecognition
 * Custom hook wrapping the browser's Web Speech API for speech-to-text.
 * Handles feature detection, permission errors, and recognition lifecycle.
 */
export function useSpeechRecognition({ onResult, onError } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimText(interim);
      if (final && onResult) {
        onResult(final);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setInterimText('');
      let msg = 'An error occurred. Please try again.';
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        msg = 'Microphone access is unavailable. You can type your note instead.';
      } else if (event.error === 'no-speech') {
        msg = 'No speech detected. Please try again.';
      } else if (event.error === 'network') {
        msg = 'Network error during voice input. Please type your note instead.';
      }
      setError(msg);
      if (onError) onError(msg);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    try {
      recognitionRef.current.start();
    } catch {
      // Already started — ignore
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  }, []);

  return {
    isListening,
    isSupported,
    interimText,
    error,
    startListening,
    stopListening,
  };
}
