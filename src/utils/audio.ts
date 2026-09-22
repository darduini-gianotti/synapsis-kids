import confetti from 'canvas-confetti';
import { SoundAlert } from '../types';

class AudioManager {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Play a gentle, sensory-friendly tone using Web Audio API synthesis
   */
  playSound(type: SoundAlert, volume = 0.8) {
    if (type === 'none') return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.min(Math.max(volume, 0.05), 1), now);
    masterGain.connect(ctx.destination);

    if (type === 'chime') {
      // Gentle two-tone chime (F5 -> A5)
      this.playTone(ctx, masterGain, 698.46, now, 0.6, 'sine');
      this.playTone(ctx, masterGain, 880.00, now + 0.18, 0.9, 'sine');
    } else if (type === 'harp') {
      // Gentle arpeggio (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        this.playTone(ctx, masterGain, freq, now + i * 0.12, 0.8, 'sine');
      });
    } else if (type === 'bell') {
      // Warm singing bell with subtle harmonic
      this.playBell(ctx, masterGain, 587.33, now, 1.4); // D5
    } else if (type === 'marimba') {
      // Warm woody acoustic tone
      this.playMarimba(ctx, masterGain, 523.25, now, 0.4);
      this.playMarimba(ctx, masterGain, 659.25, now + 0.12, 0.5);
    }
  }

  /**
   * Play success victory fanfare for completing a task or all subtasks
   */
  playSuccess(volume = 0.8) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.9, now);
    masterGain.connect(ctx.destination);

    // Warm cheerful chords: C5, E5, G5, high C6
    const melody = [
      { freq: 523.25, time: 0, dur: 0.2 },
      { freq: 659.25, time: 0.14, dur: 0.2 },
      { freq: 783.99, time: 0.28, dur: 0.25 },
      { freq: 1046.50, time: 0.45, dur: 0.8 },
    ];

    melody.forEach(({ freq, time, dur }) => {
      this.playTone(ctx, masterGain, freq, now + time, dur, 'triangle');
    });

    // Fire celebratory confetti!
    this.triggerConfetti();
  }

  /**
   * Play subtask check click sound
   */
  playCheckSound(volume = 0.7) {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.7, now);
    masterGain.connect(ctx.destination);

    this.playTone(ctx, masterGain, 880, now, 0.15, 'sine');
    this.playTone(ctx, masterGain, 1174.66, now + 0.08, 0.25, 'sine');
  }

  private playTone(ctx: AudioContext, destination: GainNode, freq: number, startTime: number, duration: number, type: OscillatorType = 'sine') {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Gentle envelope: soft attack, exponential decay
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.6, startTime + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private playBell(ctx: AudioContext, destination: GainNode, freq: number, startTime: number, duration: number) {
    [1, 2.76, 5.4].forEach((harmonic, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * harmonic, startTime);

      const amp = 0.5 / (idx + 1);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(amp, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration / (idx === 0 ? 1 : 2));

      osc.connect(gain);
      gain.connect(destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  private playMarimba(ctx: AudioContext, destination: GainNode, freq: number, startTime: number, duration: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.7, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private cachedVoices: SpeechSynthesisVoice[] = [];
  private preferredVoiceURI: string | null = null;
  private preferredPitch: number = 1.0;
  private preferredRate: number = 0.95;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.cachedVoices = window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  /**
   * Set voice customization preferences (saved from settings)
   */
  setVoicePreferences(voiceURI?: string, pitch = 1.0, rate = 0.95) {
    this.preferredVoiceURI = voiceURI || null;
    this.preferredPitch = pitch;
    this.preferredRate = rate;
  }

  /**
   * Retrieve list of Portuguese voices available in the browser,
   * sorted with natural/neural/Google human voices first.
   */
  getPortugueseVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    
    let voices = this.cachedVoices;
    if (!voices || voices.length === 0) {
      voices = window.speechSynthesis.getVoices();
      this.cachedVoices = voices;
    }

    const ptVoices = voices.filter((v) => {
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      return lang.startsWith('pt');
    });

    // Score voices so natural human-sounding neural voices are at the top
    const scoreVoice = (v: SpeechSynthesisVoice): number => {
      let score = 0;
      const name = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase().replace('_', '-');

      if (lang === 'pt-br') score += 30;
      if (name.includes('natural')) score += 100;
      if (name.includes('google')) score += 90;
      if (name.includes('online')) score += 70;
      if (name.includes('neural')) score += 70;
      if (name.includes('francisca') || name.includes('thalita') || name.includes('luciana') || name.includes('felipe') || name.includes('antonio')) {
        score += 50;
      }
      // Deprioritize older robotic desktop voices
      if (name.includes('desktop') || name.includes('espeak')) score -= 50;

      return score;
    };

    return ptVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a));
  }

  /**
   * Speak friendly text in Portuguese using the highest quality natural voice
   */
  speak(text: string, volume = 0.9) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = this.preferredRate || 0.95; // Natural human conversational pace
      utterance.pitch = this.preferredPitch || 1.0; // Warm, natural human pitch (no robotic distortion)
      utterance.volume = volume;

      const ptVoices = this.getPortugueseVoices();

      let chosenVoice: SpeechSynthesisVoice | undefined;

      // 1. If user selected a specific voice in Settings, try to use it
      if (this.preferredVoiceURI) {
        chosenVoice = ptVoices.find((v) => v.voiceURI === this.preferredVoiceURI);
      }

      // 2. Otherwise pick the top-ranked natural voice
      if (!chosenVoice && ptVoices.length > 0) {
        chosenVoice = ptVoices[0];
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech is restricted by browser policy before user interaction
    }
  }

  /**
   * Confetti celebration for positive reinforcement
   */
  triggerConfetti() {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#a78bfa'],
        disableForReducedMotion: true,
      });
    } catch {
      // Fallback safe
    }
  }
}

export const soundManager = new AudioManager();
