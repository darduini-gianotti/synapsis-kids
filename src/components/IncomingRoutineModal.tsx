import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Clock, Check, X, ShieldAlert, Copy, Smartphone } from 'lucide-react';
import { DayOfWeek, DayRoutine, RoutineTask } from '../types';
import { DAY_NAMES } from '../utils/storage';
import { TaskIcon } from './TaskIcon';

export interface IncomingRoutineData {
  app?: string;
  version?: string;
  type: 'single_day' | 'all_week';
  dayOfWeek?: DayOfWeek;
  dayName?: string;
  tasks?: RoutineTask[];
  routines?: Record<DayOfWeek, DayRoutine>;
}

interface IncomingRoutineModalProps {
  isOpen: boolean;
  data: IncomingRoutineData | null;
  onClose: () => void;
  onApply: (data: IncomingRoutineData) => void;
  isParentLocked?: boolean;
}

export const IncomingRoutineModal: React.FC<IncomingRoutineModalProps> = ({
  isOpen,
  data,
  onClose,
  onApply,
  isParentLocked = false,
}) => {
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  if (!isOpen || !data) return null;

  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setHasCopiedLink(true);
      setTimeout(() => setHasCopiedLink(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const isSingle = data.type === 'single_day' || Boolean(data.tasks);
  const targetDay = data.dayOfWeek ?? 0;
  const targetDayName = data.dayName || DAY_NAMES[targetDay]?.full || 'Dia';
  const tasksList = data.tasks || (data.routines ? data.routines[targetDay]?.tasks : []) || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 dark:bg-black/85 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-indigo-200/80 dark:border-indigo-900/60"
          id="incoming-routine-modal"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner p-1.5">
                <img
                  src="/assets/synapsi_brain1.png"
                  alt="Synapsis Kids"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                  Link Mágico • Synapsis Kids
                </span>
                <h3 className="font-black text-lg sm:text-xl leading-tight">
                  Nova Rotina Recebida!
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
            {/* Info Badge */}
            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200">
                    {isSingle ? `Rotina para ${targetDayName}` : 'Rotina da Semana Completa (7 dias)'}
                  </h4>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
                    {isSingle
                      ? `${tasksList.length} atividades personalizadas prontas para aplicar`
                      : 'Todas as tarefas de segunda a domingo serão atualizadas'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-[11px] font-extrabold shrink-0 shadow-2xs">
                {isSingle ? '1 Dia' : '7 Dias'}
              </span>
            </div>

            {/* In-App Browser Guidance Banner (If not in installed PWA standalone) */}
            {!isStandalone && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold">
                  <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Abriu no navegador do WhatsApp?</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-snug">
                  Se você já usa o <strong>Synapsis Kids instalado na sua Tela de Início</strong> (com seu modo escuro e configurações salvas), você pode copiar este link e colá-lo no seu app instalado:
                </p>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{hasCopiedLink ? '✓ Link Copiado! Abra o seu App na Tela de Início' : 'Copiar Link para Abrir no App Instalado'}</span>
                </button>
              </div>
            )}

            {/* Task Preview List */}
            {tasksList.length > 0 && (
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  Atividades incluídas nesta rotina:
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {tasksList.map((task, idx) => (
                    <div
                      key={task.id || idx}
                      className="p-2.5 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 flex items-center justify-center p-1 border border-stone-200/80 dark:border-stone-700 shadow-2xs shrink-0">
                          {task.imageUrl ? (
                            <img
                              src={task.imageUrl}
                              alt={task.title}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <TaskIcon name={task.iconName} size={20} className="text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h5 className="text-xs font-extrabold text-stone-900 dark:text-stone-100 truncate">
                            {task.title}
                          </h5>
                          {task.voicePhrase && (
                            <p className="text-[10px] text-stone-400 truncate italic">
                              "{task.voicePhrase}"
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-lg bg-stone-200/70 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-[11px] font-bold flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {task.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parental Lock Advisory */}
            {isParentLocked && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>
                  O modo de proteção está ativo. Será solicitada a senha dos pais de 4 dígitos para confirmar.
                </span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-750 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            >
              Descartar
            </button>

            <button
              type="button"
              onClick={() => onApply(data)}
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Sim, Aplicar Rotina!</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
