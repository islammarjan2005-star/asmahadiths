import { useState, useEffect, useCallback, useRef } from 'react';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const available = speechSynthesis.getVoices();
      // Prefer Arabic voices
      const arabicVoices = available.filter(v => v.lang.startsWith('ar'));
      const englishVoices = available.filter(v => v.lang.startsWith('en'));
      setVoices([...arabicVoices, ...englishVoices]);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text, { lang = 'ar', rate = 0.8, pitch = 1 } = {}) => {
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Try to find matching voice
    const matchingVoice = voices.find(v => v.lang.startsWith(lang));
    if (matchingVoice) utterance.voice = matchingVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const isSupported = 'speechSynthesis' in window;

  return { speak, stop, isSpeaking, voices, isSupported };
}
