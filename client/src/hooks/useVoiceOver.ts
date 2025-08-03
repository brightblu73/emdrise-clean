import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceOverOptions {
  enabled: boolean;
  rate: number; // 0.1 to 10
  pitch: number; // 0 to 2
  volume: number; // 0 to 1
  voice: string | null; // Voice name
}

export function useVoiceOver() {
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem('voiceOverEnabled');
    return saved ? JSON.parse(saved) : false;
  });

  const [options, setOptions] = useState<VoiceOverOptions>(() => {
    const saved = localStorage.getItem('voiceOverOptions');
    return saved ? JSON.parse(saved) : {
      enabled: false,
      rate: 1,
      pitch: 1,
      volume: 0.8,
      voice: null
    };
  });

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Set default voice if none selected
      if (!options.voice && voices.length > 0) {
        const defaultVoice = voices.find(voice => voice.default) || voices[0];
        setOptions(prev => ({ ...prev, voice: defaultVoice.name }));
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('voiceOverEnabled', JSON.stringify(isEnabled));
    localStorage.setItem('voiceOverOptions', JSON.stringify(options));
  }, [isEnabled, options]);

  const speak = useCallback((text: string, interrupt: boolean = true) => {
    if (!isEnabled || !text.trim()) return;

    // Stop current speech if interrupting
    if (interrupt && isSpeaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice settings
    utterance.rate = options.rate;
    utterance.pitch = options.pitch;
    utterance.volume = options.volume;
    
    // Set voice
    if (options.voice) {
      const selectedVoice = availableVoices.find(voice => voice.name === options.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    // Event listeners
    utterance.onstart = () => {
      setIsSpeaking(true);
      currentUtterance.current = utterance;
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      currentUtterance.current = null;
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      currentUtterance.current = null;
    };

    speechSynthesis.speak(utterance);
  }, [isEnabled, options, availableVoices, isSpeaking]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    currentUtterance.current = null;
  }, []);

  const pause = useCallback(() => {
    if (isSpeaking) {
      speechSynthesis.pause();
    }
  }, [isSpeaking]);

  const resume = useCallback(() => {
    speechSynthesis.resume();
  }, []);

  const toggle = useCallback(() => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    
    if (newEnabled) {
      speak("Voice-over guidance enabled");
    } else {
      stop();
    }
  }, [isEnabled, speak, stop]);

  const updateOptions = useCallback((newOptions: Partial<VoiceOverOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  // Announce script changes and important UI updates
  const announceScriptChange = useCallback((scriptTitle: string, scriptNumber: number | string) => {
    if (isEnabled) {
      speak(`Now on ${scriptTitle}, Script ${scriptNumber}`);
    }
  }, [isEnabled, speak]);

  const announceAction = useCallback((action: string) => {
    if (isEnabled) {
      speak(action);
    }
  }, [isEnabled, speak]);

  const announceButton = useCallback((buttonText: string, context?: string) => {
    if (isEnabled) {
      const announcement = context ? `${buttonText} button, ${context}` : `${buttonText} button`;
      speak(announcement);
    }
  }, [isEnabled, speak]);

  return {
    isEnabled,
    options,
    availableVoices,
    isSpeaking,
    toggle,
    speak,
    stop,
    pause,
    resume,
    updateOptions,
    announceScriptChange,
    announceAction,
    announceButton
  };
}