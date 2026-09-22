import confetti from 'canvas-confetti';
import { SoundAlert, VoiceCharacterStyle } from '../types';

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
   * Play grand victory celebration with joyful cartoon sparkles and double confetti
   * Triggered when completing all daily tasks!
   */
  playGrandCelebration(volume = 0.85) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, now);
    masterGain.connect(ctx.destination);

    // Triumphant cartoon fanfare melody (C5, E5, G5, C6, A5, sustained high C6)
    const melody = [
      { freq: 523.25, time: 0, dur: 0.16 },
      { freq: 659.25, time: 0.13, dur: 0.16 },
      { freq: 783.99, time: 0.26, dur: 0.18 },
      { freq: 1046.50, time: 0.42, dur: 0.35 },
      { freq: 880.00, time: 0.70, dur: 0.20 },
      { freq: 1046.50, time: 0.90, dur: 0.90 },
    ];

    melody.forEach(({ freq, time, dur }) => {
      this.playTone(ctx, masterGain, freq, now + time, dur, 'triangle');
    });

    // Magical chime cascade in background (shimmering bells)
    const chimes = [1318.51, 1567.98, 1760.00, 2093.00];
    chimes.forEach((freq, idx) => {
      this.playBell(ctx, masterGain, freq, now + 0.45 + idx * 0.14, 0.6);
    });

    // Fire double celebratory confetti!
    this.triggerConfetti();
    setTimeout(() => this.triggerConfetti(), 350);
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
  private preferredPitch: number = 1.35;
  private preferredRate: number = 1.0;
  private voiceStyle: VoiceCharacterStyle = 'mascot';

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
  setVoicePreferences(
    voiceURI?: string,
    pitch?: number,
    rate?: number,
    style: VoiceCharacterStyle = 'mascot'
  ) {
    this.preferredVoiceURI = voiceURI || null;
    this.voiceStyle = style;

    if (style === 'mascot') {
      // Mascote Infantil em Cadência Mais Calma (Apoio TEA e sensorial)
      this.preferredPitch = pitch !== undefined ? pitch : 1.28;
      this.preferredRate = rate !== undefined ? rate : 0.88;
    } else if (style === 'gentle') {
      // Calm, reassuring, sensory-friendly tone for autism/TEA
      this.preferredPitch = pitch !== undefined ? pitch : 1.05;
      this.preferredRate = rate !== undefined ? rate : 0.88;
    } else {
      // Standard neutral voice
      this.preferredPitch = pitch !== undefined ? pitch : 1.0;
      this.preferredRate = rate !== undefined ? rate : 0.95;
    }
  }

  getVoiceStyle(): VoiceCharacterStyle {
    return this.voiceStyle;
  }

  /**
   * Play base64 or URL audio recording (e.g. parents or therapist voice memo)
   */
  playRecording(audioDataUrl: string, volume = 1.0): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(audioDataUrl);
        audio.volume = Math.min(Math.max(volume, 0.05), 1.0);
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Falha na reprodução do áudio gravado'));
        audio.play().catch(reject);
      } catch (e) {
        reject(e);
      }
    });
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
   * Speak lively encouragement praise with positive reinforcement tailored for children
   */
  speakEncouragement(taskTitle: string, isAllCompleted = false, volume = 0.9) {
    let phrase = '';

    if (isAllCompleted) {
      if (this.voiceStyle === 'mascot') {
        const celebrations = [
          'Uau, sensacional! Você terminou todas as tarefas de hoje! Você é um super campeão! Viva!',
          'Eba! Missão cumprida! Concluímos todas as tarefas de hoje! Que orgulho de você!',
          'Parabéns, nota dez! Você finalizou toda a rotina de hoje! Você arrasou!',
        ];
        phrase = celebrations[Math.floor(Math.random() * celebrations.length)];
      } else if (this.voiceStyle === 'gentle') {
        phrase = 'Muito bem. Você concluiu todas as tarefas com calma e dedicação hoje. Parabéns pelo seu dia.';
      } else {
        phrase = 'Parabéns! Todas as tarefas programadas para hoje foram concluídas com sucesso.';
      }
    } else {
      if (this.voiceStyle === 'mascot') {
        const praises = [
          `Eba! Você concluiu: ${taskTitle}! Você é demais!`,
          `Muito bem! Tarefa prontinha: ${taskTitle}! Que orgulho!`,
          `Uau, que capricho! Tarefa concluída: ${taskTitle}!`,
          `Show de bola! Concluímos: ${taskTitle}!`,
          `Incrível! Parabéns por fazer: ${taskTitle}!`,
        ];
        phrase = praises[Math.floor(Math.random() * praises.length)];
      } else if (this.voiceStyle === 'gentle') {
        const praises = [
          `Muito bem. Você concluiu: ${taskTitle}.`,
          `Parabéns pelo capricho em: ${taskTitle}.`,
          `Tarefa realizada com carinho: ${taskTitle}.`,
        ];
        phrase = praises[Math.floor(Math.random() * praises.length)];
      } else {
        phrase = `Muito bem! Você concluiu: ${taskTitle}!`;
      }
    }

    this.speak(phrase, volume);
  }

  /**
   * Play sample fanfare celebration and voice praise for demonstration/testing in settings
   */
  playCelebrationSample(volume = 0.9) {
    this.playSuccess(volume);
    setTimeout(() => {
      this.speakEncouragement('Escovar os Dentes', false, volume);
    }, 450);
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
