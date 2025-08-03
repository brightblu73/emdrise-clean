// Audio generation utilities for creating therapeutic soundscapes
export class AudioGenerator {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private isPlaying = false;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  // Generate nature-inspired rain sounds using filtered white noise
  generateRainSound(intensity: number = 0.3): HTMLAudioElement {
    const audio = new Audio();
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    // Create audio buffer with white noise filtered for rain-like sound
    if (this.audioContext) {
      const bufferSize = this.audioContext.sampleRate * 30; // 30 seconds
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        const noise = Math.random() * 2 - 1;
        // Apply low-pass filtering for rain-like sound
        output[i] = noise * intensity * (0.5 + 0.5 * Math.sin(i * 0.001));
      }
      
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = intensity;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Create downloadable audio
      audio.src = this.bufferToDataURL(buffer);
    }
    
    return audio;
  }

  // Generate ocean wave sounds using multiple sine waves
  generateOceanWaves(): HTMLAudioElement {
    const audio = new Audio();
    
    if (this.audioContext) {
      const bufferSize = this.audioContext.sampleRate * 60; // 60 seconds
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        const time = i / this.audioContext.sampleRate;
        // Layer multiple wave frequencies for ocean-like sound
        const wave1 = Math.sin(2 * Math.PI * 0.1 * time) * 0.3;
        const wave2 = Math.sin(2 * Math.PI * 0.07 * time) * 0.2;
        const wave3 = Math.sin(2 * Math.PI * 0.15 * time) * 0.1;
        const noise = (Math.random() * 2 - 1) * 0.1;
        
        output[i] = wave1 + wave2 + wave3 + noise;
      }
      
      audio.src = this.bufferToDataURL(buffer);
    }
    
    return audio;
  }

  // Generate meditative bell sounds using harmonic sine waves
  generateMeditativeBells(): HTMLAudioElement {
    const audio = new Audio();
    
    if (this.audioContext) {
      const bufferSize = this.audioContext.sampleRate * 45; // 45 seconds
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      
      // Bell frequencies and harmonics
      const fundamentals = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      
      for (let i = 0; i < bufferSize; i++) {
        const time = i / this.audioContext.sampleRate;
        let sample = 0;
        
        // Create bell strikes every 8-12 seconds with random variation
        const bellInterval = 8 + Math.sin(time * 0.1) * 4;
        const bellTrigger = Math.sin(2 * Math.PI * time / bellInterval);
        
        if (bellTrigger > 0.95) {
          fundamentals.forEach((freq, index) => {
            const envelope = Math.exp(-time * 0.5); // Decay envelope
            const harmonic1 = Math.sin(2 * Math.PI * freq * time) * envelope * 0.5;
            const harmonic2 = Math.sin(2 * Math.PI * freq * 2 * time) * envelope * 0.2;
            const harmonic3 = Math.sin(2 * Math.PI * freq * 3 * time) * envelope * 0.1;
            
            sample += (harmonic1 + harmonic2 + harmonic3) * 0.2;
          });
        }
        
        output[i] = sample;
      }
      
      audio.src = this.bufferToDataURL(buffer);
    }
    
    return audio;
  }

  // Generate flowing water sounds
  generateFlowingWater(): HTMLAudioElement {
    const audio = new Audio();
    
    if (this.audioContext) {
      const bufferSize = this.audioContext.sampleRate * 40; // 40 seconds
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        const time = i / this.audioContext.sampleRate;
        
        // Multiple noise layers for water-like sound
        const highFreqNoise = (Math.random() * 2 - 1) * 0.3;
        const midFreqNoise = (Math.random() * 2 - 1) * 0.2 * Math.sin(time * 2);
        const lowFreqNoise = (Math.random() * 2 - 1) * 0.1 * Math.sin(time * 0.5);
        
        // Apply filtering for water-like characteristics
        const filtered = (highFreqNoise + midFreqNoise + lowFreqNoise) * 0.6;
        output[i] = filtered;
      }
      
      audio.src = this.bufferToDataURL(buffer);
    }
    
    return audio;
  }

  // Generate breathing-focused ambient sounds
  generateBreathingSpace(): HTMLAudioElement {
    const audio = new Audio();
    
    if (this.audioContext) {
      const bufferSize = this.audioContext.sampleRate * 35; // 35 seconds
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        const time = i / this.audioContext.sampleRate;
        
        // Breathing rhythm: 4 seconds in, 4 seconds out
        const breathingCycle = Math.sin(2 * Math.PI * time / 8) * 0.3;
        const ambientTone = Math.sin(2 * Math.PI * 110 * time) * 0.1; // A2 note
        const harmonic = Math.sin(2 * Math.PI * 220 * time) * 0.05; // A3 note
        
        output[i] = breathingCycle + ambientTone + harmonic;
      }
      
      audio.src = this.bufferToDataURL(buffer);
    }
    
    return audio;
  }

  // Generate nighttime forest sounds
  generateNightForest(): HTMLAudioElement {
    const audio = new Audio();
    
    if (this.audioContext) {
      const bufferSize = this.audioContext.sampleRate * 50; // 50 seconds
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        const time = i / this.audioContext.sampleRate;
        
        // Base forest ambience
        const windNoise = (Math.random() * 2 - 1) * 0.1 * Math.sin(time * 0.3);
        
        // Occasional cricket sounds
        const cricketFreq = 3000 + Math.sin(time * 10) * 500;
        const cricketTrigger = Math.random() > 0.98 ? 1 : 0;
        const cricket = Math.sin(2 * Math.PI * cricketFreq * time) * cricketTrigger * 0.05;
        
        // Distant owl hoots (very occasional)
        const owlTrigger = Math.random() > 0.999 ? 1 : 0;
        const owl = Math.sin(2 * Math.PI * 200 * time) * owlTrigger * 0.1;
        
        output[i] = windNoise + cricket + owl;
      }
      
      audio.src = this.bufferToDataURL(buffer);
    }
    
    return audio;
  }

  // Convert audio buffer to data URL for audio element
  private bufferToDataURL(buffer: AudioBuffer): string {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(length * 2);
    const view = new DataView(arrayBuffer);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(i * 2, sample * 0x7FFF, true);
    }
    
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  // Clean up resources
  cleanup() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    
    this.gainNodes.forEach(gain => {
      try {
        gain.disconnect();
      } catch (e) {
        // Gain node might already be disconnected
      }
    });
    
    this.oscillators = [];
    this.gainNodes = [];
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}