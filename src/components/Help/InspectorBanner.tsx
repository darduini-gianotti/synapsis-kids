import React from 'react';
import { HelpCircle, X } from 'lucide-react';

interface InspectorBannerProps {
  onExit: () => void;
}

export const InspectorBanner: React.FC<InspectorBannerProps> = ({ onExit }) => {
  return (
    <aside
      className="sticky top-0 z-40 bg-gradient-to-r from-teal-900/95 via-stone-900/95 to-indigo-950/95 text-stone-100 border-b border-teal-500/40 px-3.5 py-2 backdrop-blur-md shadow-lg flex items-center justify-between gap-2.5 animate-slide-down"
      aria-label="Aviso do modo explicação ativado"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping shrink-0" />
        <div className="truncate">
          <span className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
            <HelpCircle className="w-3.5 h-3.5 text-teal-300 shrink-0" />
            <span>Modo Explicação Ativado</span>
          </span>
          <span className="text-[10px] text-teal-200/90 block truncate">
            Toque em qualquer botão para ver para que serve
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onExit}
        className="shrink-0 px-3 py-1 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1"
        title="Encerrar o modo de explicação"
      >
        <X className="w-3.5 h-3.5" />
        <span>Sair da Ajuda</span>
      </button>
    </aside>
  );
};
