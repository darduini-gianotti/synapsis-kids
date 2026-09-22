export type TaskCategory = 
  | 'hygiene' 
  | 'chores' 
  | 'meals' 
  | 'school' 
  | 'therapy' 
  | 'play' 
  | 'sleep' 
  | 'exercise'
  | 'other';

export type SoundAlert = 'chime' | 'harp' | 'bell' | 'marimba' | 'voice' | 'none';

export type VoiceCharacterStyle = 'mascot' | 'gentle' | 'normal';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  iconName?: string;
}

export interface RoutineTask {
  id: string;
  title: string;
  time: string; // HH:mm
  endTime?: string; // HH:mm
  category: TaskCategory;
  iconName: string;
  color: string; // Theme color (blue, emerald, amber, purple, rose, sky, etc)
  completed: boolean;
  completedAt?: string;
  subtasks: SubTask[];
  soundAlert: SoundAlert;
  voicePhrase?: string; // Custom phrase for voice prompt, e.g. "Hora de fazer as tarefas da casa!"
  audioRecording?: string; // Gravação de áudio dos pais/terapeuta em base64 (data:audio/webm;base64,...)
  durationMinutes?: number;
  notes?: string;
  imageUrl?: string; // URL do pictograma ARASAAC ou imagem personalizada
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

export interface DayRoutine {
  dayOfWeek: DayOfWeek;
  tasks: RoutineTask[];
  isCustomized?: boolean;
}

export interface AppSettings {
  soundVolume: number; // 0 to 1
  voiceEnabled: boolean;
  vibrationEnabled: boolean;
  childLockEnabled: boolean;
  showVisualTimer: boolean;
  parentPin?: string; // default "1234" or simple math question
  themeMode?: ThemeMode; // 'light' | 'dark' | 'system'
  enableLargeCards?: boolean; // Habilitar ou desabilitar modo cartões grandes (PECS/CAA)
  selectedVoiceURI?: string; // URI da voz selecionada pelo usuário (ex: Google, Natural)
  voiceStyle?: VoiceCharacterStyle; // 'mascot' | 'gentle' | 'normal'
  voicePitch?: number; // 0.8 a 1.5
  voiceRate?: number; // 0.8 a 1.2
}
