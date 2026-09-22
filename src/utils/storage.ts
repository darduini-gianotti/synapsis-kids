import { DayRoutine, DayOfWeek, RoutineTask, AppSettings } from '../types';

const STORAGE_KEY_ROUTINES = 'tea_routines_v1';
const STORAGE_KEY_SETTINGS = 'tea_settings_v1';
const STORAGE_KEY_COMPLETIONS = 'tea_completions_v1'; // Map of dateKey ("YYYY-MM-DD") -> { [taskId: string]: boolean, subtasks: { [subId: string]: boolean } }

export const DAY_NAMES: { [key in DayOfWeek]: { short: string; full: string } } = {
  0: { short: 'Dom', full: 'Domingo' },
  1: { short: 'Seg', full: 'Segunda-feira' },
  2: { short: 'Ter', full: 'Terça-feira' },
  3: { short: 'Qua', full: 'Quarta-feira' },
  4: { short: 'Qui', full: 'Quinta-feira' },
  5: { short: 'Sex', full: 'Sexta-feira' },
  6: { short: 'Sáb', full: 'Sábado' },
};

export const DEFAULT_CHORES_SUBTASKS = [
  { id: 'sub-chore-1', title: 'Guardar os brinquedos na caixa', completed: false, iconName: 'Box' },
  { id: 'sub-chore-2', title: 'Arrumar a cama e os travesseiros', completed: false, iconName: 'BedDouble' },
  { id: 'sub-chore-3', title: 'Colocar a roupa suja no cesto', completed: false, iconName: 'Shirt' },
  { id: 'sub-chore-4', title: 'Levar o prato e copo para a pia', completed: false, iconName: 'Utensils' },
];

export const DEFAULT_HYGIENE_SUBTASKS = [
  { id: 'sub-hyg-1', title: 'Colocar pasta na escova', completed: false, iconName: 'Sparkles' },
  { id: 'sub-hyg-2', title: 'Escovar dentes da frente e de trás', completed: false, iconName: 'Smile' },
  { id: 'sub-hyg-3', title: 'Enxaguar a boca com água', completed: false, iconName: 'Droplets' },
  { id: 'sub-hyg-4', title: 'Secar a boca na toalha', completed: false, iconName: 'Check' },
];

export const DEFAULT_BACKPACK_SUBTASKS = [
  { id: 'sub-bp-1', title: 'Guardar cadernos e livros', completed: false, iconName: 'BookOpen' },
  { id: 'sub-bp-2', title: 'Conferir o estojo com lápis', completed: false, iconName: 'PenTool' },
  { id: 'sub-bp-3', title: 'Encher a garrafinha de água', completed: false, iconName: 'GlassWater' },
  { id: 'sub-bp-4', title: 'Fechar o zíper da mochila', completed: false, iconName: 'Check' },
];

export const DEFAULT_TOILET_SUBTASKS = [
  { id: 'sub-toi-1', title: 'Abaixar a roupa', completed: false, iconName: 'Shirt' },
  { id: 'sub-toi-2', title: 'Sentar no vaso sanitário', completed: false, iconName: 'Toilet' },
  { id: 'sub-toi-3', title: 'Usar o papel higiênico', completed: false, iconName: 'Sparkles' },
  { id: 'sub-toi-4', title: 'Apertar a descarga', completed: false, iconName: 'Droplets' },
  { id: 'sub-toi-5', title: 'Lavar e secar as mãos', completed: false, iconName: 'Hand' },
];

const DEFAULT_WEEKDAY_TASKS: RoutineTask[] = [
  {
    id: 'task-1',
    title: 'Acordar e Espreguiçar',
    time: '07:30',
    category: 'hygiene',
    iconName: 'SunMedium',
    color: 'amber',
    completed: false,
    subtasks: [],
    soundAlert: 'chime',
    voicePhrase: 'Bom dia! Hora de acordar com calma.',
    durationMinutes: 10,
    notes: 'Abrir a cortina e respirar fundo',
  },
  {
    id: 'task-toilet',
    title: 'Ir ao Banheiro',
    time: '07:45',
    category: 'hygiene',
    iconName: 'Toilet',
    color: 'sky',
    completed: false,
    subtasks: DEFAULT_TOILET_SUBTASKS,
    soundAlert: 'chime',
    voicePhrase: 'Hora de ir ao banheiro com calma.',
    durationMinutes: 10,
    notes: 'Abaixe a roupa, use o papel e dê a descarga',
  },
  {
    id: 'task-2',
    title: 'Café da Manhã Gostoso',
    time: '08:00',
    category: 'meals',
    iconName: 'UtensilsCrossed',
    color: 'emerald',
    completed: false,
    subtasks: [],
    soundAlert: 'marimba',
    voicePhrase: 'Hora do café da manhã!',
    durationMinutes: 25,
  },
  {
    id: 'task-3',
    title: 'Escovar os Dentes',
    time: '08:30',
    category: 'hygiene',
    iconName: 'Sparkles',
    color: 'cyan',
    completed: false,
    subtasks: DEFAULT_HYGIENE_SUBTASKS,
    soundAlert: 'harp',
    voicePhrase: 'Hora de escovar os dentinhos!',
    durationMinutes: 3,
  },
  {
    id: 'task-4',
    title: 'Tarefas da Casa',
    time: '09:00',
    category: 'chores',
    iconName: 'CheckSquare',
    color: 'indigo',
    completed: false,
    subtasks: DEFAULT_CHORES_SUBTASKS,
    soundAlert: 'bell',
    voicePhrase: 'Hora das tarefas da casa! Vamos conferir a lista?',
    durationMinutes: 20,
    notes: 'Marque cada item que você concluir!',
  },
  {
    id: 'task-5',
    title: 'Momento Livre / Brincadeira',
    time: '10:00',
    category: 'play',
    iconName: 'Gamepad2',
    color: 'violet',
    completed: false,
    subtasks: [],
    soundAlert: 'harp',
    voicePhrase: 'Hora de brincar e relaxar!',
    durationMinutes: 60,
  },
  {
    id: 'task-6',
    title: 'Almoço em Família',
    time: '12:00',
    category: 'meals',
    iconName: 'Soup',
    color: 'emerald',
    completed: false,
    subtasks: [],
    soundAlert: 'marimba',
    voicePhrase: 'O almoço está pronto!',
    durationMinutes: 30,
  },
  {
    id: 'task-7',
    title: 'Lição ou Atividade Escolar',
    time: '14:00',
    category: 'school',
    iconName: 'BookOpen',
    color: 'blue',
    completed: false,
    subtasks: [
      { id: 'sub-lic-1', title: 'Sentar na mesinha de estudos', completed: false, iconName: 'Compass' },
      { id: 'sub-lic-2', title: 'Fazer as lições do dia', completed: false, iconName: 'PenTool' },
      { id: 'sub-lic-3', title: 'Guardar todo o material', completed: false, iconName: 'Check' },
    ],
    soundAlert: 'chime',
    voicePhrase: 'Hora da lição com bastante foco.',
    durationMinutes: 45,
  },
  {
    id: 'task-8',
    title: 'Banho Refrescante',
    time: '17:30',
    category: 'hygiene',
    iconName: 'Bath',
    color: 'teal',
    completed: false,
    subtasks: [],
    soundAlert: 'harp',
    voicePhrase: 'Hora de um banho bem gostoso!',
    durationMinutes: 20,
  },
  {
    id: 'task-9',
    title: 'Organizar a Mochila',
    time: '18:30',
    category: 'chores',
    iconName: 'Backpack',
    color: 'sky',
    completed: false,
    subtasks: DEFAULT_BACKPACK_SUBTASKS,
    soundAlert: 'bell',
    voicePhrase: 'Vamos preparar a mochila de amanhã?',
    durationMinutes: 15,
  },
  {
    id: 'task-10',
    title: 'Hora de Dormir e Descansar',
    time: '21:00',
    category: 'sleep',
    iconName: 'Moon',
    color: 'indigo',
    completed: false,
    subtasks: [],
    soundAlert: 'harp',
    voicePhrase: 'Boa noite! Hora de relaxar e sonhar.',
    durationMinutes: 15,
  },
];

const DEFAULT_WEEKEND_TASKS: RoutineTask[] = [
  {
    id: 'task-we-1',
    title: 'Acordar e Espreguiçar no Fim de Semana',
    time: '08:30',
    category: 'hygiene',
    iconName: 'SunMedium',
    color: 'amber',
    completed: false,
    subtasks: [],
    soundAlert: 'chime',
    voicePhrase: 'Bom dia! Hoje é fim de semana para descansar.',
    durationMinutes: 15,
  },
  {
    id: 'task-we-2',
    title: 'Café da Manhã Especial',
    time: '09:00',
    category: 'meals',
    iconName: 'UtensilsCrossed',
    color: 'emerald',
    completed: false,
    subtasks: [],
    soundAlert: 'marimba',
    voicePhrase: 'Hora do café!',
    durationMinutes: 30,
  },
  {
    id: 'task-we-3',
    title: 'Escovar os Dentes',
    time: '09:45',
    category: 'hygiene',
    iconName: 'Sparkles',
    color: 'cyan',
    completed: false,
    subtasks: DEFAULT_HYGIENE_SUBTASKS,
    soundAlert: 'harp',
    voicePhrase: 'Hora de escovar os dentinhos!',
    durationMinutes: 3,
  },
  {
    id: 'task-we-4',
    title: 'Tarefas da Casa Leves',
    time: '10:30',
    category: 'chores',
    iconName: 'CheckSquare',
    color: 'indigo',
    completed: false,
    subtasks: [
      { id: 'sub-we-c1', title: 'Guardar brinquedos da sala', completed: false, iconName: 'Box' },
      { id: 'sub-we-c2', title: 'Arrumar a cama', completed: false, iconName: 'BedDouble' },
    ],
    soundAlert: 'bell',
    voicePhrase: 'Tarefinhas da casa rápidas para depois brincar!',
    durationMinutes: 15,
  },
  {
    id: 'task-we-5',
    title: 'Passeio ao Ar Livre / Parquinho',
    time: '11:00',
    category: 'play',
    iconName: 'Trees',
    color: 'emerald',
    completed: false,
    subtasks: [],
    soundAlert: 'chime',
    voicePhrase: 'Hora de passear ao ar livre!',
    durationMinutes: 90,
  },
  {
    id: 'task-we-6',
    title: 'Almoço Delicioso',
    time: '13:00',
    category: 'meals',
    iconName: 'Soup',
    color: 'emerald',
    completed: false,
    subtasks: [],
    soundAlert: 'marimba',
    voicePhrase: 'Almoço servido!',
    durationMinutes: 40,
  },
  {
    id: 'task-we-7',
    title: 'Filme em Família / Desenho',
    time: '15:30',
    category: 'play',
    iconName: 'Tv',
    color: 'purple',
    completed: false,
    subtasks: [],
    soundAlert: 'harp',
    voicePhrase: 'Hora do cineminha em família!',
    durationMinutes: 90,
  },
  {
    id: 'task-we-8',
    title: 'Banho Gostoso',
    time: '18:30',
    category: 'hygiene',
    iconName: 'Bath',
    color: 'teal',
    completed: false,
    subtasks: [],
    soundAlert: 'harp',
    voicePhrase: 'Hora do banho relaxante.',
    durationMinutes: 25,
  },
  {
    id: 'task-we-9',
    title: 'Hora de Dormir e Histórias',
    time: '21:30',
    category: 'sleep',
    iconName: 'Moon',
    color: 'indigo',
    completed: false,
    subtasks: [],
    soundAlert: 'harp',
    voicePhrase: 'Boa noite e bons sonhos!',
    durationMinutes: 20,
  },
];

export function getInitialRoutines(): Record<DayOfWeek, DayRoutine> {
  const result: Record<DayOfWeek, DayRoutine> = {} as Record<DayOfWeek, DayRoutine>;
  
  for (let day = 0; day <= 6; day++) {
    const isWeekend = day === 0 || day === 6;
    const template = isWeekend ? DEFAULT_WEEKEND_TASKS : DEFAULT_WEEKDAY_TASKS;
    result[day as DayOfWeek] = {
      dayOfWeek: day as DayOfWeek,
      tasks: JSON.parse(JSON.stringify(template)),
      isCustomized: false,
    };
  }
  return result;
}

export function loadRoutines(): Record<DayOfWeek, DayRoutine> {
  if (typeof window === 'undefined') return getInitialRoutines();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROUTINES);
    if (!raw) {
      const initial = getInitialRoutines();
      saveRoutines(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load routines from storage', e);
    return getInitialRoutines();
  }
}

export function saveRoutines(routines: Record<DayOfWeek, DayRoutine>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ROUTINES, JSON.stringify(routines));
  } catch (e) {
    console.error('Failed to save routines to storage', e);
  }
}

export function loadSettings(): AppSettings {
  const defaults: AppSettings = {
    soundVolume: 0.8,
    voiceEnabled: true,
    vibrationEnabled: true,
    childLockEnabled: false,
    showVisualTimer: true,
    parentPin: '1234',
    themeMode: 'system',
    enableLargeCards: true,
    voiceStyle: 'mascot',
    voiceRate: 0.88,
    voicePitch: 1.28,
  };

  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

/**
 * Daily completions tracking by date string (e.g., "2026-09-15")
 */
export interface DateCompletions {
  tasks: Record<string, boolean>; // taskId -> completed
  subtasks: Record<string, boolean>; // subtaskId -> completed
}

export function loadDateCompletions(dateKey: string): DateCompletions {
  if (typeof window === 'undefined') return { tasks: {}, subtasks: {} };
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_COMPLETIONS}_${dateKey}`);
    if (!raw) return { tasks: {}, subtasks: {} };
    return JSON.parse(raw);
  } catch {
    return { tasks: {}, subtasks: {} };
  }
}

export function saveDateCompletions(dateKey: string, completions: DateCompletions): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_KEY_COMPLETIONS}_${dateKey}`, JSON.stringify(completions));
  } catch (e) {
    console.error('Failed to save date completions', e);
  }
}

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
