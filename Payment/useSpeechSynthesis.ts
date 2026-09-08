import { useState, useEffect, useCallback, useRef } from 'react';
import { Language } from '../types/payment.types';
import { getStepVoiceContent, VoiceContent } from '../utils/voiceScripts';

export interface UseSpeechSynthesisResult {
  isSpeaking: boolean;
  hasSpeechSupport: boolean;
  speak: (text: string, lang?: Language, customCaption?: string) => void;
  speakStep: (
    step: 1 | 2 | 3 | 4 | 5 | 'processing' | 'success' | 'failed',
    lang: Language,
    merchantName?: string,
    amount?: number
  ) => void;
  stop: () => void;
  currentCaption: string | null;
  activeVoiceLang: Language | null;
}

// Gentle pleasant audio chime before speech to confirm audio playback
function playAudioChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // AudioContext autoplay might be restricted before interaction; ignore safely
  }
}

export function useSpeechSynthesis(): UseSpeechSynthesisResult {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(false);
  const [currentCaption, setCurrentCaption] = useState<string | null>(null);
  const [activeVoiceLang, setActiveVoiceLang] = useState<Language | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSpeechSupport(true);

      const updateVoices = () => {
        const loadedVoices = window.speechSynthesis.getVoices();
        if (loadedVoices.length > 0) {
          voicesRef.current = loadedVoices;
        }
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
      setActiveVoiceLang(null);
    }
  }, []);

  const speak = useCallback(
    (text: string, lang: Language = 'en', customCaption?: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setCurrentCaption(customCaption || text);
        return;
      }

      window.speechSynthesis.cancel();

      if (!text.trim()) {
        setIsSpeaking(false);
        setCurrentCaption(null);
        setActiveVoiceLang(null);
        return;
      }

      playAudioChime();
      setCurrentCaption(customCaption || text);
      setActiveVoiceLang(lang);

      const allVoices =
        voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();

      // Find appropriate voice based on language
      let chosenVoice: SpeechSynthesisVoice | null = null;
      let textToSpeak = text;
      let targetLangCode = 'en-IN';

      if (lang === 'te') {
        // 1. Look for native Telugu voice
        const nativeTelugu = allVoices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('te') ||
            v.name.toLowerCase().includes('telugu')
        );

        if (nativeTelugu) {
          chosenVoice = nativeTelugu;
          targetLangCode = nativeTelugu.lang;
          textToSpeak = text;
        } else {
          // 2. Fallback: Use Indian English / Hindi voice with phonetic syllables
          const indianVoice =
            allVoices.find(
              (v) =>
                v.lang.toLowerCase().startsWith('en-in') ||
                v.lang.toLowerCase().includes('india') ||
                v.name.toLowerCase().includes('india') ||
                v.lang.toLowerCase().startsWith('hi-in')
            ) || allVoices[0];

          chosenVoice = indianVoice;
          targetLangCode = indianVoice ? indianVoice.lang : 'en-IN';
          textToSpeak = text;
        }
      } else if (lang === 'hi') {
        // Look for native Hindi voice
        const nativeHindi = allVoices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('hi') ||
            v.name.toLowerCase().includes('hindi')
        );
        chosenVoice =
          nativeHindi ||
          allVoices.find((v) => v.lang.toLowerCase().startsWith('en-in')) ||
          allVoices[0];
        targetLangCode = chosenVoice?.lang || 'hi-IN';
        textToSpeak = text;
      } else {
        // English (en)
        const englishVoice =
          allVoices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('en-in') ||
              v.name.toLowerCase().includes('india')
          ) ||
          allVoices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
          allVoices[0];

        chosenVoice = englishVoice;
        targetLangCode = chosenVoice?.lang || 'en-IN';
        textToSpeak = text;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = targetLangCode;
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      // Slightly slower rate for high clarity and accessibility
      utterance.rate = lang === 'te' ? 0.85 : 0.88;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setActiveVoiceLang(null);
        setTimeout(() => {
          setCurrentCaption(null);
        }, 2500);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setActiveVoiceLang(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  const speakStep = useCallback(
    (
      step: 1 | 2 | 3 | 4 | 5 | 'processing' | 'success' | 'failed',
      lang: Language,
      merchantName: string = 'Worker',
      amount: number = 0
    ) => {
      const allVoices =
        voicesRef.current.length > 0
          ? voicesRef.current
          : typeof window !== 'undefined' && 'speechSynthesis' in window
          ? window.speechSynthesis.getVoices()
          : [];

      const hasNativeVoice =
        lang === 'en'
          ? true
          : lang === 'te'
          ? allVoices.some(
              (v) =>
                v.lang.toLowerCase().startsWith('te') ||
                v.name.toLowerCase().includes('telugu')
            )
          : allVoices.some(
              (v) =>
                v.lang.toLowerCase().startsWith('hi') ||
                v.name.toLowerCase().includes('hindi')
            );

      const content: VoiceContent = getStepVoiceContent(
        step,
        lang,
        merchantName,
        amount,
        hasNativeVoice
      );

      speak(content.spokenText, lang, content.displayText);
    },
    [speak]
  );

  return {
    isSpeaking,
    hasSpeechSupport,
    speak,
    speakStep,
    stop,
    currentCaption,
    activeVoiceLang,
  };
}
