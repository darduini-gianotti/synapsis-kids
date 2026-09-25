import React from 'react';
import {
  X,
  Plus,
  Sun,
  Volume2,
  Lock,
  Settings,
  Calendar,
  Sparkles,
  Share2,
  Bell,
  Copy,
  ListTodo,
  Grid,
  ArrowRight,
  CheckSquare,
  Timer,
  Check,
} from 'lucide-react';
import { INSPECTOR_ITEMS, InspectorItem } from './helpData';

interface InspectorExplanationSheetProps {
  itemId: string | null;
  onClose: () => void;
  onExitInspectorMode: () => void;
}

const ITEM_ICONS: Record<string, React.ReactNode> = {
  Plus: <Plus className="w-5 h-5 text-teal-400" />,
  Sun: <Sun className="w-5 h-5 text-amber-400" />,
  Volume2: <Volume2 className="w-5 h-5 text-indigo-400" />,
  Lock: <Lock className="w-5 h-5 text-amber-400" />,
  Settings: <Settings className="w-5 h-5 text-stone-300" />,
  Calendar: <Calendar className="w-5 h-5 text-teal-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-indigo-400" />,
  Share2: <Share2 className="w-5 h-5 text-teal-400" />,
  Bell: <Bell className="w-5 h-5 text-rose-400" />,
  Copy: <Copy className="w-5 h-5 text-indigo-400" />,
  ListTodo: <ListTodo className="w-5 h-5 text-teal-400" />,
  Grid: <Grid className="w-5 h-5 text-indigo-400" />,
  ArrowRight: <ArrowRight className="w-5 h-5 text-emerald-400" />,
  CheckSquare: <CheckSquare className="w-5 h-5 text-teal-400" />,
  Timer: <Timer className="w-5 h-5 text-amber-400" />,
};

const CATEGORY_LABELS: Record<InspectorItem['category'], { label: string; color: string }> = {
  rotina: { label: 'Gestão de Rotina', color: 'bg-teal-950/80 text-teal-300 border-teal-500/30' },
  visualizacao: { label: 'Modo Visual', color: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30' },
  sensorial: { label: 'Conforto Sensorial', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' },
  seguranca: { label: 'Segurança & Família', color: 'bg-amber-950/80 text-amber-300 border-amber-500/30' },
};

export const InspectorExplanationSheet: React.FC<InspectorExplanationSheetProps> = ({
  itemId,
  onClose,
  onExitInspectorMode,
}) => {
  if (!itemId) return null;

  const item = INSPECTOR_ITEMS[itemId] || {
    id: itemId,
    title: 'Recurso da Tela',
    category: 'rotina' as const,
    description: 'Este elemento faz parte da navegação ou controle da sua rotina diária.',
    clinicalTip: 'Explore tocando nos outros botões para conhecer as funções.',
    iconName: 'Sparkles',
  };

  const cat = CATEGORY_LABELS[item.category] || CATEGORY_LABELS.rotina;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-stone-900 border-t sm:border border-stone-800 text-stone-100 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle visual para mobile */}
        <div className="w-10 h-1 bg-stone-700 rounded-full mx-auto sm:hidden" />

        {/* Topo do Card */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 shadow-inner">
              {ITEM_ICONS[item.iconName] || <Sparkles className="w-5 h-5 text-teal-400" />}
            </div>
            <div>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1 ${cat.color}`}>
                {cat.label}
              </span>
              <h3 className="text-base font-black text-white leading-tight">
                {item.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Fechar explicação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Descrição em 2 linhas */}
        <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700/80 text-xs sm:text-sm text-stone-200 leading-relaxed">
          {item.description}
        </div>

        {/* Dica da Especialista */}
        {item.clinicalTip && (
          <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-xs text-teal-200/90 leading-relaxed flex items-start gap-2.5">
            <span className="text-base shrink-0">🌿</span>
            <div>
              <strong className="block text-teal-300 font-bold mb-0.5">Por que isso importa:</strong>
              <span>{item.clinicalTip}</span>
            </div>
          </div>
        )}

        {/* Ações inferiores */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onExitInspectorMode}
            className="text-xs text-stone-400 hover:text-rose-400 font-semibold transition-colors"
          >
            Encerrar Modo Ajuda
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 active:scale-98 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Entendi, continuar explorando</span>
          </button>
        </div>
      </div>
    </div>
  );
};
