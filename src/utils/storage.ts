import { DayRoutine, DayOfWeek, RoutineTask, AppSettings } from '../types';
import { getPanqueccaAssetsForTitle } from './mascotAssets';

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
    time: '07:00',
    category: 'hygiene',
    iconName: 'SunMedium',
    color: 'amber',
    completed: false,
    subtasks: [],
    soundAlert: 'chime',
    voicePhrase: 'Bom dia, raio de sol! Hora de acordar com calma e alegria!',
    durationMinutes: 10,
    notes: 'Abrir a cortina e respirar fundo',
    imageUrl: '/mascots/panquecca_acordar.jpg',
    videoUrl: '/mascots/panquecca_acordar.mp4',
  },
  {
    id: 'task-bed',
    title: 'Arrumar a Cama',
    time: '07:15',
    category: 'chores',
    iconName: 'BedDouble',
    color: 'indigo',
    completed: false,
    subtasks: [
      { id: 'sub-bed-1', title: 'Esticar o lençol', completed: false, iconName: 'Sparkles' },
      { id: 'sub-bed-2', title: 'Ajeitar o travesseiro', completed: false, iconName: 'Smile' },
      { id: 'sub-bed-3', title: 'Dobrar a coberta', completed: false, iconName: 'Check' },
    ],
    soundAlert: 'bell',
    voicePhrase: 'Missão quarto nota dez! Hora de esticar o lençol e deixar a cama fofinha como uma nuvem!',
    durationMinutes: 10,
    imageUrl: '/mascots/panquecca_arrumar_cama.jpg',
    videoUrl: '/mascots/panquecca_arrumar_cama.mp4',
  },
  {
    id: 'task-toilet',
    title: 'Ir ao Banheiro',
    time: '07:30',
    category: 'hygiene',
    iconName: 'Toilet',
    color: 'sky',
    completed: false,
    subtasks: DEFAULT_TOILET_SUBTASKS,
    soundAlert: 'chime',
    voicePhrase: 'Hora de ir ao banheiro com calma! Desce a roupinha, usa o papel e depois dá tchau na descarga!',
    durationMinutes: 10,
    notes: 'Abaixe a roupa, use o papel e dê a descarga',
    imageUrl: '/mascots/panquecca_banheiro.jpg',
    videoUrl: '/mascots/panquecca_banheiro.mp4',
  },
  {
    id: 'task-wash-hands',
    title: 'Lavar as Mãos',
    time: '07:45',
    category: 'hygiene',
    iconName: 'Hand',
    color: 'cyan',
    completed: false,
    subtasks: [
      { id: 'sub-hand-1', title: 'Molhar as mãos', completed: false, iconName: 'Droplets' },
      { id: 'sub-hand-2', title: 'Passar sabonete e esfregar bem', completed: false, iconName: 'Sparkles' },
      { id: 'sub-hand-3', title: 'Enxaguar na água', completed: false, iconName: 'Droplets' },
      { id: 'sub-hand-4', title: 'Secar na toalha limpa', completed: false, iconName: 'Check' },
    ],
    soundAlert: 'chime',
    voicePhrase: 'Xô bactérias! Hora de lavar as mãozinhas com muita espuma e fazer bolhinhas de sabão!',
    durationMinutes: 5,
    imageUrl: '/mascots/panquecca_lavando_maos.jpg',
    videoUrl: '/mascots/panquecca_lavando_maos.mp4',
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
    voicePhrase: 'Hummm, que cheirinho bom! Hora do café da manhã para encher a barriguinha de energia!',
    durationMinutes: 25,
    imageUrl: '/mascots/panquecca_comendo.jpg',
    videoUrl: '/mascots/panquecca_comendo.mp4',
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
    voicePhrase: 'Tchick, tchick, tchick! Hora de escovar os dentinhos e deixar tudo brilhando como estrelinhas!',
    durationMinutes: 3,
    imageUrl: '/mascots/panquecca_escovando.jpg',
    videoUrl: '/mascots/panquecca_escovando.mp4',
  },
  {
    id: 'task-clothes',
    title: 'Vestir a Roupa',
    time: '08:45',
    category: 'chores',
    iconName: 'Shirt',
    color: 'sky',
    completed: false,
    subtasks: [
      { id: 'sub-clo-1', title: 'Escolher a roupa confortável', completed: false, iconName: 'Shirt' },
      { id: 'sub-clo-2', title: 'Vestir a camiseta e calça/short', completed: false, iconName: 'Check' },
      { id: 'sub-clo-3', title: 'Calçar meias e sapatos', completed: false, iconName: 'Smile' },
    ],
    soundAlert: 'chime',
    voicePhrase: 'Transformação mágica! Hora de vestir uma roupinha bem linda, confortável e charmosa!',
    durationMinutes: 10,
    imageUrl: '/mascots/panquecca_vestir_roupa.jpg',
    videoUrl: '/mascots/panquecca_vestir_roupa.mp4',
  },
  {
    id: 'task-comb',
    title: 'Pentear o Cabelo',
    time: '08:55',
    category: 'hygiene',
    iconName: 'Sparkles',
    color: 'teal',
    completed: false,
    subtasks: [],
    soundAlert: 'chime',
    voicePhrase: 'Espelho, espelho meu! Hora de pentear o cabelinho e ficar super estiloso!',
    durationMinutes: 5,
    imageUrl: '/mascots/panquecca_pentear.jpg',
    videoUrl: '/mascots/panquecca_pentear.mp4',
  },
  {
    id: 'task-water-1',
    title: 'Beber Água',
    time: '09:15',
    category: 'meals',
    iconName: 'GlassWater',
    color: 'blue',
    completed: false,
    subtasks: [],
    soundAlert: 'chime',
    voicePhrase: 'Glub, glub, glub! Hora de beber água bem fresquinha para o corpinho ficar feliz e hidratado!',
    durationMinutes: 5,
    imageUrl: '/mascots/panquecca_beber_agua.jpg',
    videoUrl: '/mascots/panquecca_beber_agua.mp4',
  },
  {
    id: 'task-4',
    title: 'Tarefas da Casa',
    time: '09:30',
    category: 'chores',
    iconName: 'CheckSquare',
    color: 'indigo',
    completed: false,
    subtasks: DEFAULT_CHORES_SUBTASKS,
    soundAlert: 'bell',
    voicePhrase: 'Super organizador em ação! Cada brinquedinho na sua casinha e tudo no seu lugar!',
    durationMinutes: 20,
    notes: 'Marque cada item que você concluir!',
    imageUrl: '/mascots/panquecca_guardar_brinquedos.jpg',
    videoUrl: '/mascots/panquecca_guardar_brinquedos.mp4',
  },
  {
    id: 'task-5',
    title: 'Momento Livre / Brincadeira',
    time: '10:15',
    category: 'play',
    iconName: 'Gamepad2',
    color: 'violet',
    completed: false,
    subtasks: [],
    soundAlert: 'harp',
    voicePhrase: 'Ebaaa! Hora de brincar, usar a imaginação e se divertir de montão!',
    durationMinutes: 60,
    imageUrl: '/mascots/panquecca_brincar.jpg',
    videoUrl: '/mascots/panquecca_brincar.mp4',
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
    voicePhrase: 'Prato colorido e saboroso! Hora do almoço gostoso para crescer forte como um herói!',
    durationMinutes: 30,
    imageUrl: '/mascots/panquecca_comendo.jpg',
    videoUrl: '/mascots/panquecca_comendo.mp4',
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
    voicePhrase: 'Modo gênio ativado! Hora da lição com bastante foco, calma e capricho!',
    durationMinutes: 45,
    imageUrl: '/mascots/panquecca_licao.jpg',
    videoUrl: '/mascots/panquecca_licao.mp4',
  },
  {
    id: 'task-lanche',
    title: 'Hora do Lanche / Fruta',
    time: '15:30',
    category: 'meals',
    iconName: 'Apple',
    color: 'amber',
    completed: false,
    subtasks: [
      { id: 'sub-lan-1', title: 'Lavar as mãos antes do lanche', completed: false, iconName: 'Hand' },
      { id: 'sub-lan-2', title: 'Comer a fruta ou lanchinho gostoso', completed: false, iconName: 'Apple' },
      { id: 'sub-lan-3', title: 'Guardar o pratinho na pia', completed: false, iconName: 'Check' },
    ],
    soundAlert: 'marimba',
    voicePhrase: 'Nhac, nhac, que delícia! Hora do lanche gostoso e saudável com frutinhas bem docinhas!',
    durationMinutes: 20,
    imageUrl: '/mascots/panquecca_fruta.jpg',
    videoUrl: '/mascots/panquecca_fruta.mp4',
  },
  {
    id: 'task-water-2',
    title: 'Beber Água da Tarde',
    time: '16:30',
    category: 'meals',
    iconName: 'GlassWater',
    color: 'blue',
    completed: false,
    subtasks: [],
    soundAlert: 'chime',
    voicePhrase: 'Pausa para o gole mágico! Hora de beber mais uma água geladinha e refrescante!',
    durationMinutes: 5,
    imageUrl: '/mascots/panquecca_beber_agua.jpg',
    videoUrl: '/mascots/panquecca_beber_agua.mp4',
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
    voicePhrase: 'Tchibum na banheira! Hora de um banho bem quentinho, cheiroso e cheio de espuminha!',
    durationMinutes: 20,
    imageUrl: '/mascots/panquecca_banho.jpg',
    videoUrl: '/mascots/panquecca_banho.mp4',
  },
  {
    id: 'task-screen',
    title: 'Desligar Telas e Desconectar',
    time: '18:00',
    category: 'chores',
    iconName: 'Tv',
    color: 'purple',
    completed: false,
    subtasks: [
      { id: 'sub-scr-1', title: 'Salvar e desligar os jogos', completed: false, iconName: 'Check' },
      { id: 'sub-scr-2', title: 'Guardar o celular/tablet no lugar', completed: false, iconName: 'Box' },
    ],
    soundAlert: 'bell',
    voicePhrase: 'Telinhas em modo soneca! Hora de desligar os aparelhos e dar um abraço bem gostoso na família!',
    durationMinutes: 15,
    imageUrl: '/mascots/panquecca_desligar_telas.jpg',
    videoUrl: '/mascots/panquecca_desligar_telas.mp4',
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
    voicePhrase: 'Mochila pronta, aventura garantida! Vamos conferir o estojo e os cadernos para amanhã!',
    durationMinutes: 15,
    imageUrl: '/mascots/panquecca_escola.jpg',
    videoUrl: '/mascots/panquecca_escola.mp4',
  },
  {
    id: 'task-calm',
    title: 'Momento de Acalmar / Leitura',
    time: '20:30',
    category: 'sleep',
    iconName: 'HeartHandshake',
    color: 'indigo',
    completed: false,
    subtasks: [],
    soundAlert: 'harp',
    voicePhrase: 'Respira bem fundo como um balão... Solta devagarzinho... Hora da calma, do soninho e da paz no coração!',
    durationMinutes: 20,
    imageUrl: '/mascots/panquecca_acalmar.jpg',
    videoUrl: '/mascots/panquecca_acalmar.mp4',
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
    voicePhrase: 'Boa noite, campeão! Fecha os olhinhos, relaxa no travesseiro e tenha sonhos mágicos e felizes!',
    durationMinutes: 15,
    imageUrl: '/mascots/panquecca_dormir.jpg',
    videoUrl: '/mascots/panquecca_dormir.mp4',
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
    imageUrl: '/mascots/panquecca_acordar.jpg',
    videoUrl: '/mascots/panquecca_acordar.mp4',
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
    imageUrl: '/mascots/panquecca_comendo.jpg',
    videoUrl: '/mascots/panquecca_comendo.mp4',
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
    imageUrl: '/mascots/panquecca_escovando.jpg',
    videoUrl: '/mascots/panquecca_escovando.mp4',
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
    imageUrl: '/mascots/panquecca_guardar_brinquedos.jpg',
    videoUrl: '/mascots/panquecca_guardar_brinquedos.mp4',
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
    imageUrl: '/mascots/panquecca_brincar.jpg',
    videoUrl: '/mascots/panquecca_brincar.mp4',
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
    imageUrl: '/mascots/panquecca_comendo.jpg',
    videoUrl: '/mascots/panquecca_comendo.mp4',
  },
  {
    id: 'task-we-7',
    title: 'Filme em Família / Desenho',
    time: '14:30',
    category: 'play',
    iconName: 'Tv',
    color: 'purple',
    completed: false,
    subtasks: [],
    soundAlert: 'harp',
    voicePhrase: 'Hora do cineminha em família!',
    durationMinutes: 75,
    imageUrl: '/mascots/panquecca_brincar.jpg',
    videoUrl: '/mascots/panquecca_brincar.mp4',
  },
  {
    id: 'task-we-lanche',
    title: 'Hora do Lanche / Fruta',
    time: '16:00',
    category: 'meals',
    iconName: 'Apple',
    color: 'amber',
    completed: false,
    subtasks: [],
    soundAlert: 'marimba',
    voicePhrase: 'Hora do lanche gostoso e saudável!',
    durationMinutes: 20,
    imageUrl: '/mascots/panquecca_fruta.jpg',
    videoUrl: '/mascots/panquecca_fruta.mp4',
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
    imageUrl: '/mascots/panquecca_banho.jpg',
    videoUrl: '/mascots/panquecca_banho.mp4',
  },
  {
    id: 'task-we-calm',
    title: 'Momento de Acalmar e Relaxar',
    time: '20:30',
    category: 'sleep',
    iconName: 'HeartHandshake',
    color: 'indigo',
    completed: false,
    subtasks: [],
    soundAlert: 'harp',
    voicePhrase: 'Hora de descansar e relaxar a mente.',
    durationMinutes: 30,
    imageUrl: '/mascots/panquecca_acalmar.jpg',
    videoUrl: '/mascots/panquecca_acalmar.mp4',
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
    imageUrl: '/mascots/panquecca_dormir.jpg',
    videoUrl: '/mascots/panquecca_dormir.mp4',
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
    const parsed: Record<DayOfWeek, DayRoutine> = JSON.parse(raw);
    let changed = false;

    // Auto-migrate mascot images and videos for all 20 Pixar 3D routines
    for (const day in parsed) {
      const routine = parsed[day as unknown as DayOfWeek];
      if (routine?.tasks) {
        // 1. Atualiza e enriquece cada tarefa existente
        routine.tasks.forEach((t) => {
          const lower = (t.title || '').toLowerCase();

          // A) Lanche e Fruta (prioridade para garantir vídeo e frase correta)
          if (lower.includes('lanche') || lower.includes('fruta')) {
            if (!t.imageUrl || t.imageUrl.includes('placeholder')) {
              t.imageUrl = '/mascots/panquecca_fruta.jpg';
              changed = true;
            }
            if (t.videoUrl !== '/mascots/panquecca_fruta.mp4') {
              t.videoUrl = '/mascots/panquecca_fruta.mp4';
              changed = true;
            }
            if (!t.voicePhrase) {
              t.voicePhrase = 'Hora do lanche gostoso e saudável!';
              changed = true;
            }
            if (!t.iconName || t.iconName === 'Circle') {
              t.iconName = 'Apple';
              changed = true;
            }
            return;
          }

          // B) Demais atividades: busca assets 3D Pixar oficiais correspondentes
          const assets = getPanqueccaAssetsForTitle(t.title);
          if (assets) {
            if (!t.imageUrl || t.imageUrl.includes('placeholder')) {
              t.imageUrl = assets.image;
              changed = true;
            }
            if (!t.videoUrl || t.videoUrl === '/mascots/panquecca_1x1.mp4') {
              if (assets.video) {
                t.videoUrl = assets.video;
                changed = true;
              }
            }
          }

          // C) Migra frases divertidas e criativas para tarefas existentes com frases genéricas
          if (!t.voicePhrase || t.voicePhrase === 'Hora do lanche gostoso e saudável!' || t.voicePhrase.startsWith('Hora de ') || t.voicePhrase.startsWith('Hora do ')) {
            if (lower.includes('lanche') || lower.includes('fruta')) {
              t.voicePhrase = 'Nhac, nhac, que delícia! Hora do lanche gostoso e saudável com frutinhas bem docinhas!';
              changed = true;
            } else if (lower.includes('mão') || lower.includes('mao')) {
              t.voicePhrase = 'Xô bactérias! Hora de lavar as mãozinhas com muita espuma e fazer bolhinhas de sabão!';
              changed = true;
            } else if (lower.includes('água') || lower.includes('agua')) {
              t.voicePhrase = 'Glub, glub, glub! Hora de beber água bem fresquinha para o corpinho ficar feliz e hidratado!';
              changed = true;
            } else if (lower.includes('rosto')) {
              t.voicePhrase = 'Gotinha mágica no rosto! Hora de lavar a carinha com água fresca para espantar a preguiça!';
              changed = true;
            } else if (lower.includes('pentear') || lower.includes('cabelo')) {
              t.voicePhrase = 'Espelho, espelho meu! Hora de pentear o cabelinho e ficar super estiloso!';
              changed = true;
            } else if (lower.includes('vestir') || lower.includes('roupa')) {
              t.voicePhrase = 'Transformação mágica! Hora de vestir uma roupinha bem linda, confortável e charmosa!';
              changed = true;
            } else if (lower.includes('tela') || lower.includes('celular') || lower.includes('tablet')) {
              t.voicePhrase = 'Telinhas em modo soneca! Hora de desligar os aparelhos e dar um abraço bem gostoso na família!';
              changed = true;
            } else if (lower.includes('cama')) {
              t.voicePhrase = 'Missão quarto nota dez! Hora de esticar o lençol e deixar a cama fofinha como uma nuvem!';
              changed = true;
            } else if (lower.includes('acalmar') || lower.includes('respirar')) {
              t.voicePhrase = 'Respira bem fundo como um balão... Solta devagarzinho... Hora da calma, do soninho e da paz no coração!';
              changed = true;
            }
          }
        });

        // 2. Garante que todo dia tenha a Hora do Lanche / Fruta
        const hasLanche = routine.tasks.some((t) => {
          const l = (t.title || '').toLowerCase();
          return l.includes('lanche') || l.includes('fruta');
        });

        if (!hasLanche) {
          const dayNum = Number(day);
          const isWeekend = dayNum === 0 || dayNum === 6;
          const lancheTask: RoutineTask = {
            id: isWeekend ? `task-we-lanche-${day}` : `task-lanche-${day}`,
            title: 'Hora do Lanche / Fruta',
            time: isWeekend ? '16:00' : '15:30',
            category: 'meals',
            iconName: 'Apple',
            color: 'amber',
            completed: false,
            subtasks: [
              { id: `sub-lan-1-${day}`, title: 'Lavar as mãos antes do lanche', completed: false, iconName: 'Hand' },
              { id: `sub-lan-2-${day}`, title: 'Comer a fruta ou lanchinho gostoso', completed: false, iconName: 'Apple' },
              { id: `sub-lan-3-${day}`, title: 'Guardar o pratinho na pia', completed: false, iconName: 'Check' },
            ],
            soundAlert: 'marimba',
            voicePhrase: 'Hora do lanche gostoso e saudável!',
            durationMinutes: 20,
            imageUrl: '/mascots/panquecca_fruta.jpg',
            videoUrl: '/mascots/panquecca_fruta.mp4',
          };
          routine.tasks.push(lancheTask);
          changed = true;
        }

        // 3. Garante que todas as rotinas oficiais do Catálogo Master estejam presentes
        const dayNum = Number(day);
        const isWeekend = dayNum === 0 || dayNum === 6;
        const defaultList = isWeekend ? DEFAULT_WEEKEND_TASKS : DEFAULT_WEEKDAY_TASKS;

        defaultList.forEach((defTask) => {
          const normDef = defTask.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
          const exists = routine.tasks.some((t) => {
            const normT = (t.title || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
            return t.id === defTask.id || normT === normDef || normT.includes(normDef) || normDef.includes(normT);
          });

          if (!exists) {
            routine.tasks.push(JSON.parse(JSON.stringify(defTask)));
            changed = true;
          }
        });

        if (changed) {
          routine.tasks.sort((a, b) => a.time.localeCompare(b.time));
        }
      }
    }

    if (changed) {
      saveRoutines(parsed);
    }

    return parsed;
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
