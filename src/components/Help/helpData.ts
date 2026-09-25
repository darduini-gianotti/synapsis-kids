export interface QuickGuideStep {
  id: string;
  badge: string;
  title: string;
  description: string;
  practicalTip: string;
  icon: string;
  gradient: string;
}

export interface InspectorItem {
  id: string;
  title: string;
  category: 'rotina' | 'visualizacao' | 'sensorial' | 'seguranca';
  description: string;
  clinicalTip?: string;
  iconName: string;
}

export const QUICK_GUIDE_STEPS: QuickGuideStep[] = [
  {
    id: 'step-1',
    badge: 'Passo 1 de 5 • Começando',
    title: 'Monte a Rotina do Dia',
    description: 'Adicione as tarefas diárias no botão "+ Nova Tarefa" ou use os "Modelos Clínicos" prontos para carregar rotinas completas validadas (Matinal, Noturna, Desfralde, Terapia).',
    practicalTip: 'Dica da Psicóloga Sandra: Manter os mesmos horários para acordar, refeições e sono reduz significativamente a ansiedade e as crises de transição.',
    icon: 'ListPlus',
    gradient: 'from-teal-500 to-indigo-600',
  },
  {
    id: 'step-2',
    badge: 'Passo 2 de 5 • Visualização',
    title: 'Adapte o Modo Visual',
    description: 'Alterne entre a "Agenda com Horários" (ideal para o dia a dia e adultos com TDAH) e os "Cartões Grandes / CAA" com pictogramas oficiais ARASAAC em tela cheia.',
    practicalTip: 'Use o modo "Primeiro / Depois" quando a criança estiver sobrecarregada — ele mostra apenas a atividade atual e a seguinte, eliminando a ansiedade do dia todo.',
    icon: 'LayoutGrid',
    gradient: 'from-indigo-600 to-purple-600',
  },
  {
    id: 'step-3',
    badge: 'Passo 3 de 5 • Conforto Sensorial',
    title: 'Sons Acolhedores & Sem Ruído',
    description: 'Nada de bips estridentes ou cronômetros estressantes. Todos os sons foram calibrados em estúdio para não assustar ouvidos sensíveis.',
    practicalTip: 'Nas Configurações, os próprios pais ou terapeutas podem gravar a sua voz para guiar a rotina com afeto e familiaridade.',
    icon: 'Volume2',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'step-4',
    badge: 'Passo 4 de 5 • Compartilhamento',
    title: 'Envie por WhatsApp ou QR Code',
    description: 'Toque em "Enviar / Importar" para gerar um Link Mágico de 1 toque ou QR Code. A rotina abre instantaneamente no celular da vovó, da escola ou do terapeuta sem precisar de cadastro.',
    practicalTip: 'Funciona 100% offline após instalado na tela inicial, preservando totalmente a privacidade da família.',
    icon: 'Share2',
    gradient: 'from-amber-500 to-rose-600',
  },
  {
    id: 'step-5',
    badge: 'Passo 5 de 5 • Segurança',
    title: 'Área Segura dos Pais (Trava PIN)',
    description: 'Ative o bloqueio com senha de 4 dígitos no botão de Cadeado. A criança pode marcar tarefas concluídas e tocar nos áudios sem risco de apagar ou alterar a programação.',
    practicalTip: 'A autonomia da criança aumenta quando ela mesma marca o passo como feito e recebe a comemoração visual acolhedora!',
    icon: 'ShieldCheck',
    gradient: 'from-blue-600 to-indigo-700',
  },
];

export const INSPECTOR_ITEMS: Record<string, InspectorItem> = {
  'new-task': {
    id: 'new-task',
    title: 'Nova Tarefa (+)',
    category: 'rotina',
    description: 'Abre o formulário para adicionar uma nova atividade à rotina do dia, escolhendo horário, pictogramas ARASAAC e áudios.',
    clinicalTip: 'Defina títulos curtos e objetivos (ex: "Escovar os Dentes") para facilitar a compreensão imediata.',
    iconName: 'Plus',
  },
  'theme-toggle': {
    id: 'theme-toggle',
    title: 'Modo Claro / Escuro (Sol & Lua)',
    category: 'sensorial',
    description: 'Alterna instantaneamente as cores do aplicativo para garantir alto contraste durante o dia e tons relaxantes sem brilho excessivo à noite.',
    clinicalTip: 'O modo escuro reduz a emissão de luz azul, ideal para a rotina noturna que prepara o cérebro para o sono.',
    iconName: 'Sun',
  },
  'sound-toggle': {
    id: 'sound-toggle',
    title: 'Controle de Som Rápido',
    category: 'sensorial',
    description: 'Ativa ou silencia os efeitos sonoros de conclusão e incentivo com apenas um toque.',
    clinicalTip: 'Excelente para momentos em ambientes silenciosos (consultório, igreja, sala de aula).',
    iconName: 'Volume2',
  },
  'parent-lock': {
    id: 'parent-lock',
    title: 'Cadeado dos Pais (Modo Protegido)',
    category: 'seguranca',
    description: 'Bloqueia alterações acidentais por meio de senha de 4 dígitos, permitindo que a criança use o aparelho com autonomia.',
    clinicalTip: 'Evita a ansiedade de perder tarefas configuradas durante a manipulação livre pelo usuário.',
    iconName: 'Lock',
  },
  'settings': {
    id: 'settings',
    title: 'Configurações Gerais',
    category: 'seguranca',
    description: 'Personalize o estilo de voz (Mascote, Suave, Normal), cadência da fala, gravação de voz dos pais, vibração e cartões.',
    clinicalTip: 'Ajuste a cadência para "Fala Mais Calma (TEA)" para dar tempo de processamento cognitivo auditivo.',
    iconName: 'Settings',
  },
  'day-selector': {
    id: 'day-selector',
    title: 'Seletor de Dias da Semana',
    category: 'rotina',
    description: 'Navega de segunda a domingo. Cada dia mantém sua programação própria com anel de progresso percentual.',
    clinicalTip: 'Visualizar os dias ajuda na estruturação temporal e na previsibilidade do que esperar ao longo da semana.',
    iconName: 'Calendar',
  },
  'clinical-templates': {
    id: 'clinical-templates',
    title: 'Modelos Clínicos de Rotina',
    category: 'rotina',
    description: 'Biblioteca com 4 rotinas terapêuticas prontas com pictogramas oficiais: Desfralde, Matinal, Noturna e Terapia.',
    clinicalTip: 'Economiza tempo precioso dos pais e garante uma estrutura testada pela neuropsicologia.',
    iconName: 'Sparkles',
  },
  'share-routine': {
    id: 'share-routine',
    title: 'Enviar / Importar Rotinas',
    category: 'rotina',
    description: 'Gera link instantâneo para WhatsApp ou QR Code para sincronizar a rotina com cuidadores e terapeutas.',
    clinicalTip: 'Garante que escola, clínica e casa sigam a mesma rotina sem contradições.',
    iconName: 'Share2',
  },
  'calendar-export': {
    id: 'calendar-export',
    title: 'Lembretes no Celular (Alarme)',
    category: 'rotina',
    description: 'Exporta os horários da rotina para o aplicativo de Calendário do seu celular para disparar notificações.',
    clinicalTip: 'Essencial para quem tem TDAH e precisa de alertas sonoros externos para não perder a noção do tempo.',
    iconName: 'Bell',
  },
  'copy-routine': {
    id: 'copy-routine',
    title: 'Copiar Programação',
    category: 'rotina',
    description: 'Copia todas as tarefas de um dia para outros dias da semana em um único toque, sem precisar redigitar.',
    clinicalTip: 'Prático para replicar a rotina escolar de segunda a sexta-feira.',
    iconName: 'Copy',
  },
  'view-mode-list': {
    id: 'view-mode-list',
    title: 'Agenda com Horários',
    category: 'visualizacao',
    description: 'Exibe as tarefas ordenadas por horário em formato de lista cronológica, com filtros de Manhã, Tarde e Noite.',
    clinicalTip: 'Ideal para adolescentes, adultos e momentos com horários fixos de medicação ou compromissos.',
    iconName: 'ListTodo',
  },
  'view-mode-board': {
    id: 'view-mode-board',
    title: 'Cartões Grandes (CAA / PECS)',
    category: 'visualizacao',
    description: 'Visualização lúdica com foco visual expandido, cartões grandes de toque fácil e borda comemorativa.',
    clinicalTip: 'Pilar da Comunicação Aumentativa e Alternativa (CAA) para crianças não-verbais ou em fase de alfabetização.',
    iconName: 'Grid',
  },
  'first-then': {
    id: 'first-then',
    title: 'Painel Primeiro / Depois',
    category: 'visualizacao',
    description: 'Mostra apenas duas tarefas: a tarefa atual em execução ("Primeiro") e a recompensa ou próximo passo ("Depois").',
    clinicalTip: 'Técnica de ouro em TCC e Análise do Comportamento Aplicada (ABA) para motivar a conclusão de tarefas difíceis.',
    iconName: 'ArrowRight',
  },
  'subtasks': {
    id: 'subtasks',
    title: 'Passos / Micro-tarefas',
    category: 'rotina',
    description: 'Divide uma tarefa grande (ex: "Tomar Banho") em etapas menores (tirar roupa, lavar cabelo, secar-se).',
    clinicalTip: 'Diminui a sobrecarga cognitiva da função executiva por meio do encadeamento de passos.',
    iconName: 'CheckSquare',
  },
  'visual-timer': {
    id: 'visual-timer',
    title: 'Cronômetro Visual',
    category: 'sensorial',
    description: 'Mostra o tempo se esgotando como um círculo colorido desaparecendo, sem números que causam ansiedade.',
    clinicalTip: 'Ajuda a criança a internalizar a passagem do tempo sem a pressão do relógio numérico.',
    iconName: 'Timer',
  },
};
