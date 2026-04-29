import { useCallback, useRef } from 'react';
import { synthesizeSpeech } from '../lib/api';

export function useTTS() {
  const audioRef = useRef(null);

  const speak = useCallback(async (text, language = 'en', useElevenLabs = false) => {
    // Stop any current speech
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    console.log('[useTTS] speak called:', { text: text.slice(0, 20), language, useElevenLabs });
    if (useElevenLabs) {
      try {
        const audioBlob = await synthesizeSpeech(text, language);
        if (audioBlob) {
          const url = URL.createObjectURL(audioBlob);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => URL.revokeObjectURL(url);
          await audio.play();
          return;
        }
      } catch (err) {
        console.warn('ElevenLabs TTS failed, falling back to browser:', err);
      }
    }

    // Browser TTS fallback
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;

    // Find the best voice for the language
    const voices = window.speechSynthesis.getVoices();
    if (language === 'ar') {
      const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arabicVoice) utterance.voice = arabicVoice;
      utterance.lang = 'ar-SA';
    } else {
      const englishVoice = voices.find(
        (v) => v.lang.startsWith('en') && v.name.includes('Samantha')
      ) || voices.find((v) => v.lang.startsWith('en-US'));
      if (englishVoice) utterance.voice = englishVoice;
      utterance.lang = 'en-US';
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  return { speak, stop };
}
