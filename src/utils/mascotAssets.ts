import { RoutineTask } from '../types';

export interface MascotTaskConfig {
  id: string;
  keywords: string[];
  titlePt: string;
  category: string;
  executionImage: string;
  executionVideo?: string;
  celebrationImage: string;
  celebrationBadge: string;
  celebrationTitle: string;
}

/**
 * Catálogo completo de atividades da rotina infantil com a mascote oficial Panquecca.
 * Cada atividade possui sua representação durante a ação (modelagem de hábito)
 * e o seu desfecho comemorativo de vitória (reforço positivo específico).
 */
export const PANQUECCA_CATALOG: MascotTaskConfig[] = [
  // 1. HIGIENE PESSOAL
  {
    id: 'escovar_dentes',
    keywords: ['escovar', 'dente', 'dentes', 'bucal', 'pasta'],
    titlePt: 'Escovar os Dentes',
    category: 'higiene',
    executionImage: '/mascots/panquecca_escovando.jpg',
    executionVideo: '/mascots/panquecca_escovando.mp4',
    celebrationImage: '/mascots/panquecca_sorriso.jpg',
    celebrationBadge: '✨ Dentes Brilhando!',
    celebrationTitle: 'Dentes limpinhos e sorriso brilhante!',
  },
  {
    id: 'lavar_maos',
    keywords: ['lavar', 'mão', 'mãos', 'mao', 'maos', 'sabonete'],
    titlePt: 'Lavar as Mãos',
    category: 'higiene',
    executionImage: '/mascots/panquecca_lavando_maos.jpg',
    executionVideo: '/mascots/panquecca_lavando_maos.mp4',
    celebrationImage: '/mascots/panquecca_lavando_maos_fim.jpg',
    celebrationBadge: '🧼 Patinhas Limpas!',
    celebrationTitle: 'Mãos limpinhas e protegidas!',
  },
  {
    id: 'banheiro',
    keywords: ['banheiro', 'vaso', 'xixi', 'cocô', 'coco', 'privada', 'fralda', 'penico'],
    titlePt: 'Ir ao Banheiro',
    category: 'higiene',
    executionImage: '/mascots/panquecca_banheiro.jpg',
    executionVideo: '/mascots/panquecca_banheiro.mp4',
    celebrationImage: '/mascots/panquecca_banheiro_fim.jpg',
    celebrationBadge: '🚽 Parabéns!',
    celebrationTitle: 'Descarga dada e autonomia conquistada!',
  },
  {
    id: 'tomar_banho',
    keywords: ['banho', 'chuveiro', 'banheira', 'sabonete', 'lavar cabelo'],
    titlePt: 'Tomar Banho',
    category: 'higiene',
    executionImage: '/mascots/panquecca_banho.jpg',
    executionVideo: '/mascots/panquecca_banho.mp4',
    celebrationImage: '/mascots/panquecca_banho_fim.jpg',
    celebrationBadge: '🛁 Muito Cheiroso!',
    celebrationTitle: 'Banho gostoso e corpinho limpinho!',
  },
  {
    id: 'cortar_unhas_pentear',
    keywords: ['unha', 'unhas', 'pentear', 'cabelo', 'escova de cabelo'],
    titlePt: 'Pentear o Cabelo & Cuidados',
    category: 'higiene',
    executionImage: '/mascots/panquecca_pentear.jpg',
    celebrationImage: '/mascots/panquecca_pentear_fim.jpg',
    celebrationBadge: '✨ Muito Arrumado!',
    celebrationTitle: 'Cabelo arrumado e visual nota 10!',
  },

  // 2. DIA A DIA & ORGANIZAÇÃO
  {
    id: 'acordar',
    keywords: ['acordar', 'espreguiçar', 'espreguicar', 'bom dia', 'despertar'],
    titlePt: 'Acordar e Espreguiçar',
    category: 'dia_a_dia',
    executionImage: '/mascots/panquecca_acordar.jpg',
    celebrationImage: '/mascots/panquecca_acordar_fim.jpg',
    celebrationBadge: '☀️ Bom Dia!',
    celebrationTitle: 'Dia iluminado com energia total!',
  },
  {
    id: 'arrumar_cama',
    keywords: ['arrumar a cama', 'cama', 'lençol', 'lencol', 'travesseiro', 'cobertor'],
    titlePt: 'Arrumar a Cama',
    category: 'dia_a_dia',
    executionImage: '/mascots/panquecca_arrumar_cama.jpg',
    celebrationImage: '/mascots/panquecca_arrumar_cama_fim.jpg',
    celebrationBadge: '🛏️ Cama Impecável!',
    celebrationTitle: 'Cama arrumadinha e quarto acolhedor!',
  },
  {
    id: 'trocar_roupa',
    keywords: ['trocar de roupa', 'vestir', 'roupa', 'pijama', 'uniforme', 'sapato', 'tênis', 'tenis'],
    titlePt: 'Vestir a Roupa / Pijama',
    category: 'dia_a_dia',
    executionImage: '/mascots/panquecca_vestir_roupa.jpg',
    celebrationImage: '/mascots/panquecca_vestir_roupa_fim.jpg',
    celebrationBadge: '👕 Pronto pro Dia!',
    celebrationTitle: 'Roupa trocada e pronto para brilhar!',
  },
  {
    id: 'guardar_brinquedos',
    keywords: ['brinquedo', 'brinquedos', 'guardar', 'arrumar', 'organizar', 'tarefas da casa', 'quarto'],
    titlePt: 'Guardar os Brinquedos',
    category: 'dia_a_dia',
    executionImage: '/mascots/panquecca_guardar_brinquedos.jpg',
    executionVideo: '/mascots/panquecca_guardar_brinquedos.mp4',
    celebrationImage: '/mascots/panquecca_guardar_brinquedos_fim.jpg',
    celebrationBadge: '🧸 Quarto Organizado!',
    celebrationTitle: 'Brinquedos guardados e dever cumprido!',
  },
  {
    id: 'dormir',
    keywords: ['dormir', 'sono', 'descansar', 'cama', 'boa noite', 'sonhar'],
    titlePt: 'Hora de Dormir',
    category: 'dia_a_dia',
    executionImage: '/mascots/panquecca_dormir.jpg',
    executionVideo: '/mascots/panquecca_dormir.mp4',
    celebrationImage: '/mascots/panquecca_dormir_fim.jpg',
    celebrationBadge: '🌙 Bons Sonhos!',
    celebrationTitle: 'Descanso merecido e soninho tranquilo!',
  },

  // 3. ALIMENTAÇÃO
  {
    id: 'cafe_manha',
    keywords: ['café da manhã', 'cafe da manha', 'café', 'cafe', 'leite', 'cereal', 'torrada'],
    titlePt: 'Café da Manhã',
    category: 'alimentacao',
    executionImage: '/mascots/panquecca_comendo.jpg',
    executionVideo: '/mascots/panquecca_comendo.mp4',
    celebrationImage: '/mascots/panquecca_comendo_fim.jpg',
    celebrationBadge: '🥣 Energia Carregada!',
    celebrationTitle: 'Café nutritivo tomado com sucesso!',
  },
  {
    id: 'almoco_jantar',
    keywords: ['almoço', 'almoco', 'jantar', 'comer', 'refeição', 'refeicao', 'comida', 'prato'],
    titlePt: 'Almoço / Jantar',
    category: 'alimentacao',
    executionImage: '/mascots/panquecca_comendo.jpg',
    executionVideo: '/mascots/panquecca_comendo.mp4',
    celebrationImage: '/mascots/panquecca_comendo_fim.jpg',
    celebrationBadge: '🍽️ Prato Limpinho!',
    celebrationTitle: 'Comeu tudinho e cresceu forte!',
  },
  {
    id: 'comer_fruta',
    keywords: ['fruta', 'frutas', 'lanche', 'maçã', 'maca', 'banana', 'laranja', 'sanduíche', 'sanduiche'],
    titlePt: 'Comer Fruta / Lanche',
    category: 'alimentacao',
    executionImage: '/mascots/panquecca_fruta.jpg',
    celebrationImage: '/mascots/panquecca_fruta_fim.jpg',
    celebrationBadge: '🍎 Lanche Saudável!',
    celebrationTitle: 'Alimentação saudável e deliciosa!',
  },
  {
    id: 'beber_agua',
    keywords: ['água', 'agua', 'beber água', 'garrafa', 'hidratar', 'copo de água'],
    titlePt: 'Beber Água',
    category: 'alimentacao',
    executionImage: '/mascots/panquecca_beber_agua.jpg',
    celebrationImage: '/mascots/panquecca_beber_agua_fim.jpg',
    celebrationBadge: '💧 Corpo Hidratado!',
    celebrationTitle: 'Refrescado e cheio de vitalidade!',
  },

  // 4. ESTUDO & ESCOLA
  {
    id: 'escola_mochila',
    keywords: ['escola', 'mochila', 'colégio', 'colegio', 'aula', 'van', 'ônibus'],
    titlePt: 'Arrumar a Mochila / Escola',
    category: 'estudo',
    executionImage: '/mascots/panquecca_escola.jpg',
    celebrationImage: '/mascots/panquecca_escola_fim.jpg',
    celebrationBadge: '🎒 Pronto pra Escola!',
    celebrationTitle: 'Mochila pronta e material organizado!',
  },
  {
    id: 'licao_estudo',
    keywords: ['lição', 'licao', 'estudo', 'estudar', 'dever', 'tarefa', 'desenhar', 'ler', 'leitura', 'livro'],
    titlePt: 'Lição de Casa & Leitura',
    category: 'estudo',
    executionImage: '/mascots/panquecca_licao.jpg',
    celebrationImage: '/mascots/panquecca_licao_fim.jpg',
    celebrationBadge: '⭐ Foco Total!',
    celebrationTitle: 'Atividade concluída com dedicação!',
  },

  // 5. SAÚDE, TERAPIA & LAZER
  {
    id: 'terapia',
    keywords: ['terapia', 'fono', 'fonoaudiologia', 'psicologia', 'terapeuta', 'médico', 'medico', 'to', 'fisioterapia'],
    titlePt: 'Hora da Terapia / Fono',
    category: 'saude',
    executionImage: '/mascots/panquecca_terapia.jpg',
    celebrationImage: '/mascots/panquecca_terapia_fim.jpg',
    celebrationBadge: '🏅 Campeão da Sessão!',
    celebrationTitle: 'Evolução incrível e muito aprendizado!',
  },
  {
    id: 'brincar_lazer',
    keywords: ['brincar', 'parquinho', 'jogo', 'jogos', 'passeio', 'parque', 'lazer'],
    titlePt: 'Brincar & Passear',
    category: 'lazer',
    executionImage: '/mascots/panquecca_brincar.jpg',
    celebrationImage: '/mascots/panquecca_brincar_fim.jpg',
    celebrationBadge: '🎉 Diversão Merecida!',
    celebrationTitle: 'Alegria e tempo bom com a família!',
  },
];

/**
 * Ativos físicos que já existem de forma garantida na pasta /public/mascots/
 */
export const EXISTING_MASCOT_FILES = new Set<string>([
  '/mascots/panquecca_escovando.jpg',
  '/mascots/panquecca_escovando.mp4',
  '/mascots/panquecca_1x1.mp4',
  '/mascots/panquecca_sorriso.jpg',
  '/mascots/panquecca_lavando_maos.jpg',
  '/mascots/panquecca_lavando_maos.mp4',
  '/mascots/panquecca_lavando_maos_fim.jpg',
  '/mascots/panquecca_banheiro.jpg',
  '/mascots/panquecca_banheiro.mp4',
  '/mascots/panquecca_banheiro_fim.jpg',
  '/mascots/panquecca_banho.jpg',
  '/mascots/panquecca_banho.mp4',
  '/mascots/panquecca_banho_fim.jpg',
  '/mascots/panquecca_comendo.jpg',
  '/mascots/panquecca_comendo.mp4',
  '/mascots/panquecca_comendo_fim.jpg',
  '/mascots/panquecca_guardar_brinquedos.jpg',
  '/mascots/panquecca_guardar_brinquedos.mp4',
  '/mascots/panquecca_guardar_brinquedos_fim.jpg',
  '/mascots/panquecca_dormir.jpg',
  '/mascots/panquecca_dormir.mp4',
  '/mascots/panquecca_dormir_fim.jpg',
  '/mascots/panquecca_acordar.jpg',
  '/mascots/panquecca_acordar_fim.jpg',
  '/mascots/panquecca_arrumar_cama.jpg',
  '/mascots/panquecca_arrumar_cama_fim.jpg',
  '/mascots/panquecca_licao.jpg',
  '/mascots/panquecca_licao_fim.jpg',
  '/mascots/panquecca_beber_agua.jpg',
  '/mascots/panquecca_beber_agua_fim.jpg',
  '/mascots/panquecca_escola.jpg',
  '/mascots/panquecca_escola_fim.jpg',
  '/mascots/panquecca_terapia.jpg',
  '/mascots/panquecca_terapia_fim.jpg',
  '/mascots/joao_escovando.jpg',
  '/mascots/joao_sorriso.jpg',
  '/mascots/gigi_escovando.jpg',
  '/mascots/gigi_sorriso.jpg',
]);

/**
 * Encontra a configuração correspondente da tarefa pela análise do título.
 */
export function findMascotConfigForTitle(title: string): MascotTaskConfig | undefined {
  const normalized = (title || '').toLowerCase().trim();
  if (!normalized) return undefined;

  for (const item of PANQUECCA_CATALOG) {
    if (item.keywords.some((kw) => normalized.includes(kw))) {
      return item;
    }
  }
  return undefined;
}

/**
 * Retorna a mídia de execução (ilustração oficial + vídeo animado, se houver).
 */
export function getPanqueccaAssetsForTitle(taskTitle: string): { image: string; video?: string } {
  const config = findMascotConfigForTitle(taskTitle);

  if (config) {
    // Se a imagem de execução específica já existe fisicamente, usa-a;
    // caso contrário, usa o fallback mais próximo existente
    const image = EXISTING_MASCOT_FILES.has(config.executionImage)
      ? config.executionImage
      : config.category === 'alimentacao'
      ? '/mascots/panquecca_comendo.jpg'
      : '/mascots/panquecca_escovando.jpg';

    // Se o vídeo configurado já existe fisicamente, anexa
    const video = config.executionVideo && EXISTING_MASCOT_FILES.has(config.executionVideo)
      ? config.executionVideo
      : undefined;

    return { image, video };
  }

  // Fallback padrão
  return {
    image: '/mascots/panquecca_escovando.jpg',
    video: '/mascots/panquecca_1x1.mp4',
  };
}

/**
 * Retorna os detalhes de celebração de vitória (imagem, selo comemorativo e frase)
 * com fallback inteligente para garantir que a tela nunca quebre se a imagem
 * personalizada ainda estiver sendo gerada.
 */
export function getTaskCelebrationDetails(task: RoutineTask): {
  image: string;
  badge: string;
  title: string;
} {
  // 1. Suporte a outros mascotes caso configurados na tarefa
  if (task.imageUrl?.includes('joao')) {
    return {
      image: '/mascots/joao_sorriso.jpg',
      badge: '✨ Parabéns!',
      title: 'Muito bem, tarefa concluída!',
    };
  }
  if (task.imageUrl?.includes('gigi')) {
    return {
      image: '/mascots/gigi_sorriso.jpg',
      badge: '✨ Parabéns!',
      title: 'Muito bem, tarefa concluída!',
    };
  }

  // 2. Busca configuração específica da Panquecca para a tarefa
  const config = findMascotConfigForTitle(task.title);

  if (config) {
    const hasCustomImage = EXISTING_MASCOT_FILES.has(config.celebrationImage);
    return {
      image: hasCustomImage ? config.celebrationImage : '/mascots/panquecca_sorriso.jpg',
      badge: config.celebrationBadge,
      title: config.celebrationTitle,
    };
  }

  // 3. Fallback clássico da Panquecca
  return {
    image: '/mascots/panquecca_sorriso.jpg',
    badge: '✨ Muito Bem!',
    title: 'Parabéns, tarefa cumprida com sucesso!',
  };
}
