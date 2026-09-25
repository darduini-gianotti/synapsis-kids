import React from 'react';
import {
  X,
  Search,
  Sparkles,
  FileText,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInspectorMode: () => void;
  onStartQuickGuide: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  onStartInspectorMode,
  onStartQuickGuide,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-hub-title"
    >
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl shadow-2xl p-6 space-y-5">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="help-hub-title" className="text-base font-black text-white">
                Como podemos ajudar?
              </h2>
              <p className="text-[11px] text-stone-400">
                Aprenda a usar o Synapsis Kids sem complicação
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Fechar ajuda"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* As 2 opções principais */}
        <div className="space-y-3">
          {/* Opção 1: Modo Inspetor */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartInspectorMode();
            }}
            className="w-full text-left p-4 rounded-2xl bg-gradient-to-br from-stone-850 to-stone-800 hover:to-stone-750 border border-teal-500/40 hover:border-teal-400 active:scale-[0.99] transition-all group shadow-sm flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0 group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/30">
                    Interativo
                  </span>
                  <span className="text-sm font-black text-white">
                    Modo Inspetor de Botões
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-snug">
                  Toque em qualquer botão ou área da tela para ler uma explicação rápida em 2 linhas.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-500 group-hover:text-teal-300 shrink-0 self-center transition-colors" />
          </button>

          {/* Opção 2: Guia Rápido em 1 Minuto */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartQuickGuide();
            }}
            className="w-full text-left p-4 rounded-2xl bg-gradient-to-br from-stone-850 to-stone-800 hover:to-stone-750 border border-indigo-500/40 hover:border-indigo-400 active:scale-[0.99] transition-all group shadow-sm flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    Em 5 passos
                  </span>
                  <span className="text-sm font-black text-white">
                    Guia Rápido (1 minuto)
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-snug">
                  Veja o fluxo completo do app em cartões ilustrados com dicas da especialista.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-500 group-hover:text-indigo-300 shrink-0 self-center transition-colors" />
          </button>
        </div>

        {/* Rodapé com link para manual em PDF */}
        <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            100% Gratuito & Validado
          </span>
          <a
            href="/manual.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 underline font-semibold text-[11px]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Manual Técnico (PDF)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
