import { useState, useEffect, useCallback, useRef } from 'react';
import { Language } from '../types/payment.types';

export interface UseSpeechSynthesisResult {
  isSpeaking: boolean;
  hasSpeechSupport: boolean;
  speak: (text: string, lang?: Language) => void;
  stop: () => void;
  currentCaption: string | null;
}

export function useSpeechSynthesis(): UseSpeechSynthesisResult {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(false);
  const [currentCaption, setCurrentCaption] = useState<string | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSpeechSupport(true);

      const updateVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentCaption(null);
    }
  }, []);

  const speak = useCallback(
    (text: string, lang: Language = 'en') => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        // Fallback visual caption only
        setCurrentCaption(text);
        return;
      }

      window.speechSynthesis.cancel();

      if (!text.trim()) {
        setIsSpeaking(false);
        setCurrentCaption(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      setCurrentCaption(text);

      // Select matching voice if available
      const langCodeMap: Record<Language, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN',
      };
      const preferredCode = langCodeMap[lang] || 'en-IN';
      utterance.lang = preferredCode;

      const availableVoices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
      const matchedVoice = availableVoices.find(
        (v) => v.lang.toLowerCase().startsWith(preferredCode.toLowerCase()) || v.lang.toLowerCase().includes(lang)
      ) || availableVoices.find((v) => v.lang.includes('IN') || v.name.includes('India')) || availableVoices[0];

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      // Slightly slower rate for elderly & clarity
      utterance.rate = 0.88;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setTimeout(() => {
          setCurrentCaption(null);
        }, 2000);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  return {
    isSpeaking,
    hasSpeechSupport,
    speak,
    stop,
    currentCaption,
  };
}
