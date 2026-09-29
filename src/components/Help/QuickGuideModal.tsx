import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ListPlus,
  LayoutGrid,
  Volume2,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { QUICK_GUIDE_STEPS } from './helpData';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInspectorMode?: () => void;
}

const STEP_ICONS: Record<string, React.ReactNode> = {
  ListPlus: <ListPlus className="w-8 h-8 text-teal-400" />,
  LayoutGrid: <LayoutGrid className="w-8 h-8 text-indigo-400" />,
  Volume2: <Volume2 className="w-8 h-8 text-emerald-400" />,
  Share2: <Share2 className="w-8 h-8 text-amber-400" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8 text-blue-400" />,
};

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenInspectorMode,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = QUICK_GUIDE_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === QUICK_GUIDE_STEPS.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-guide-title"
    >
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Superior */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-stone-800/80">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Guia Rápido Synapsis Kids
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Fechar guia"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Indicadores de Passos (Bolinhas) */}
        <div className="flex items-center justify-center gap-2 py-3 px-5 bg-stone-950/40 border-b border-stone-800/60">
          {QUICK_GUIDE_STEPS.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'w-7 bg-gradient-to-r from-teal-400 to-indigo-500'
                  : 'w-2 bg-stone-700 hover:bg-stone-600'
              }`}
              title={`Ir para ${step.title}`}
              aria-label={`Ir para ${step.title}`}
            />
          ))}
        </div>

        {/* Conteúdo do Passo Ativo */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Ícone e Badge */}
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-stone-800/90 border border-stone-700 flex items-center justify-center shadow-inner">
                {STEP_ICONS[currentStep.icon] || <Sparkles className="w-8 h-8 text-teal-400" />}
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300">
                {currentStep.badge}
              </span>
            </div>

            {/* Título e Descrição */}
            <div>
              <h3 id="quick-guide-title" className="text-xl font-black text-white leading-tight">
                {currentStep.title}
              </h3>
              <p className="mt-2 text-sm text-stone-300 leading-relaxed font-normal">
                {currentStep.description}
              </p>
            </div>

            {/* Dica da Especialista */}
            <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-xs text-teal-200/90 leading-relaxed flex items-start gap-2.5">
              <span className="text-base shrink-0">🌿</span>
              <div>
                <strong className="block text-teal-300 font-bold mb-0.5">Dica Clínica Sandra Sorgatti:</strong>
                <span>{currentStep.practicalTip}</span>
              </div>
            </div>
          </div>

          {/* Opção de alternar para Modo Inspetor */}
          {onOpenInspectorMode && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenInspectorMode();
                }}
                className="text-[11px] text-stone-400 hover:text-teal-300 underline transition-colors"
              >
                Prefere tocar na tela para entender cada botão? <strong>Ativar Modo Inspetor</strong>
              </button>
            </div>
          )}
        </div>

        {/* Rodapé de Ações de Navegação */}
        <div className="px-5 py-4 border-t border-stone-800/80 bg-stone-950/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              isFirstStep
                ? 'opacity-30 cursor-not-allowed text-stone-500'
                : 'text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-750 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>



          <button
            type="button"
            onClick={handleNext}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 active:scale-98 shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isLastStep ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Começar a Usar</span>
              </>
            ) : (
              <>
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
