import confetti from 'canvas-confetti';
import { SoundAlert, VoiceCharacterStyle } from '../types';

export const CORE_TASK_AUDIO_MAP: Record<string, string> = {
  'acordar': '/audio/task_acordar.mp3',
  'espreguiçar': '/audio/task_acordar.mp3',
  'escovar': '/audio/task_escovar_dentes.mp3',
  'dente': '/audio/task_escovar_dentes.mp3',
  'cafe': '/audio/task_cafe_manha.mp3',
  'café': '/audio/task_cafe_manha.mp3',
  'escola': '/audio/task_escola.mp3',
  'aula': '/audio/task_escola.mp3',
  'almoco': '/audio/task_almoco.mp3',
  'almoço': '/audio/task_almoco.mp3',
  'licao': '/audio/task_licao.mp3',
  'lição': '/audio/task_licao.mp3',
  'estudar': '/audio/task_licao.mp3',
  'estudo': '/audio/task_licao.mp3',
  'brincar': '/audio/task_brincar.mp3',
  'brincadeira': '/audio/task_brincar.mp3',
  'guardar': '/audio/task_guardar_brinquedos.mp3',
  'brinquedo': '/audio/task_guardar_brinquedos.mp3',
  'banho': '/audio/task_banho.mp3',
  'jantar': '/audio/task_jantar.mp3',
  'dormir': '/audio/task_dormir.mp3',
  'sono': '/audio/task_dormir.mp3',
  'xixi': '/audio/task_banheiro.mp3',
  'banheiro': '/audio/task_banheiro.mp3',
  'vaso': '/audio/task_banheiro.mp3',
  'mochila': '/audio/task_mochila.mp3',
  'terapia': '/audio/task_terapia.mp3',
  'passeio': '/audio/task_passeio.mp3',
  'parquinho': '/audio/task_passeio.mp3',
};

export function getCoreTaskAudioUrl(title: string): string | null {
  if (!title) return null;
  const normalized = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [key, url] of Object.entries(CORE_TASK_AUDIO_MAP)) {
    const normKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes(normKey)) {
      return url;
    }
  }
  return null;
}

class AudioManager {
  private ctx: AudioContext | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;

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
   * Play base64 or URL audio recording (e.g. parents or therapist voice memo, or mascot mp3)
   */
  playRecording(audioDataUrl: string, volume = 1.0): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        if (this.currentAudioElement) {
          this.currentAudioElement.pause();
          this.currentAudioElement.currentTime = 0;
          this.currentAudioElement = null;
        }

        const audio = new Audio(audioDataUrl);
        this.currentAudioElement = audio;
        audio.volume = Math.min(Math.max(volume, 0.05), 1.0);
        audio.onended = () => {
          if (this.currentAudioElement === audio) {
            this.currentAudioElement = null;
          }
          resolve();
        };
        audio.onerror = () => {
          if (this.currentAudioElement === audio) {
            this.currentAudioElement = null;
          }
          reject(new Error('Falha na reprodução do áudio gravado'));
        };
        audio.play().catch((err) => {
          if (this.currentAudioElement === audio) {
            this.currentAudioElement = null;
          }
          reject(err);
        });
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
    
    const liveVoices = window.speechSynthesis.getVoices();
    const voices = liveVoices && liveVoices.length > 0 ? liveVoices : (this.cachedVoices || []);
    if (liveVoices && liveVoices.length > 0) {
      this.cachedVoices = liveVoices;
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
      if (name.includes('francisca') || name.includes('thalita') || name.includes('luciana') || name.includes('felipe') || name.includes('antonio') || name.includes('maria')) {
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
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.preferredRate || 0.95; // Natural human conversational pace
      utterance.pitch = this.preferredPitch || 1.0; // Warm, natural human pitch
      utterance.volume = volume;

      const allVoices = window.speechSynthesis.getVoices();
      let chosenVoice: SpeechSynthesisVoice | undefined;

      // 1. If user selected a specific voice in Settings, try to use it across all voices
      if (this.preferredVoiceURI) {
        chosenVoice = allVoices.find((v) => v.voiceURI === this.preferredVoiceURI);
      }

      // 2. Otherwise pick the top-ranked natural voice in Portuguese
      if (!chosenVoice) {
        const ptVoices = this.getPortugueseVoices();
        if (ptVoices.length > 0) {
          chosenVoice = ptVoices[0];
        }
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang || 'pt-BR';
      } else {
        utterance.lang = 'pt-BR';
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech is restricted by browser policy before user interaction
    }
  }


  /**
   * Speak lively encouragement praise with positive reinforcement tailored for children.
   * Plays studio pre-recorded MP3 when in mascot mode without custom voice override.
   */
  speakEncouragement(taskTitle: string, isAllCompleted = false, volume = 0.9) {
    if (this.voiceStyle === 'mascot' && !this.preferredVoiceURI) {
      if (isAllCompleted) {
        const audioFiles = ['/audio/all_done.mp3', '/audio/all_done_2.mp3'];
        const chosen = audioFiles[Math.floor(Math.random() * audioFiles.length)];
        this.playRecording(chosen, volume).catch(() => {
          this.speak(
            'Uau, sensacional! Você terminou todas as tarefas de hoje! Você é um super campeão! Viva!',
            volume
          );
        });
        return;
      } else {
        const audioFiles = [
          '/audio/celebration_1.mp3',
          '/audio/celebration_2.mp3',
          '/audio/celebration_3.mp3',
          '/audio/celebration_4.mp3',
          '/audio/celebration_5.mp3',
        ];
        const chosen = audioFiles[Math.floor(Math.random() * audioFiles.length)];
        this.playRecording(chosen, volume).catch(() => {
          this.speak(`Eba! Você concluiu: ${taskTitle}! Você é demais!`, volume);
        });
        return;
      }
    }

    let phrase = '';
    if (isAllCompleted) {
      if (this.voiceStyle === 'gentle') {
        phrase = 'Muito bem. Você concluiu todas as tarefas com calma e dedicação hoje. Parabéns pelo seu dia.';
      } else {
        phrase = 'Parabéns! Todas as tarefas programadas para hoje foram concluídas com sucesso.';
      }
    } else {
      if (this.voiceStyle === 'gentle') {
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
   * Play studio intro speech for the Mascot
   */
  playMascotIntro(volume = 0.9): Promise<void> {
    if (this.voiceStyle === 'mascot' && !this.preferredVoiceURI) {
      return this.playRecording('/audio/intro_mascote.mp3', volume).catch(() => {
        this.speak(
          'Oi amiguinho! Eu sou o Mascote do Synapsis Kids! Vamos fazer as tarefas juntos e se divertir?',
          volume
        );
      });
    }

    this.speak(
      'Oi amiguinho! Eu sou o Mascote do Synapsis Kids! Vamos fazer as tarefas juntos e se divertir?',
      volume
    );
    return Promise.resolve();
  }

  /**
   * Play task audio:
   * 1. Voice Memo recorded by parents / therapist (if present)
   * 2. Studio pre-recorded MP3 for core routine tasks (when in mascot mode without custom voice override)
   * 3. Customized voice phrase or task title via Speech Synthesis
   */
  playTaskAudio(
    title: string,
    voicePhrase?: string,
    audioRecording?: string,
    volume = 0.9
  ): Promise<void> {
    if (audioRecording) {
      return this.playRecording(audioRecording, volume);
    }

    if (this.voiceStyle === 'mascot' && !this.preferredVoiceURI) {
      const coreAudio = getCoreTaskAudioUrl(title);
      if (coreAudio) {
        return this.playRecording(coreAudio, volume).catch(() => {
          this.speak(voicePhrase || `Hora de: ${title}`, volume);
        });
      }
    }

    this.speak(voicePhrase || `Hora de: ${title}`, volume);
    return Promise.resolve();
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
