import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, X, Check, AlertCircle } from 'lucide-react';
import { DayOfWeek } from '../types';
import { DAY_NAMES } from '../utils/storage';

interface CopyRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceDay: DayOfWeek;
  onCopyRoutine: (sourceDay: DayOfWeek, targetDays: DayOfWeek[]) => void;
}

export const CopyRoutineModal: React.FC<CopyRoutineModalProps> = ({
  isOpen,
  onClose,
  sourceDay,
  onCopyRoutine,
}) => {
  const [selectedTargets, setSelectedTargets] = useState<DayOfWeek[]>([]);

  if (!isOpen) return null;

  const allDays: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];
  const otherDays = allDays.filter((d) => d !== sourceDay);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedTargets((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const selectWeekdays = () => {
    const weekdays: DayOfWeek[] = [1, 2, 3, 4, 5].filter((d) => d !== sourceDay) as DayOfWeek[];
    setSelectedTargets(weekdays);
  };

  const selectWeekend = () => {
    const weekend: DayOfWeek[] = [6, 0].filter((d) => d !== sourceDay) as DayOfWeek[];
    setSelectedTargets(weekend);
  };

  const selectAll = () => {
    setSelectedTargets(otherDays);
  };

  const handleConfirm = () => {
    if (selectedTargets.length === 0) return;
    onCopyRoutine(sourceDay, selectedTargets);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          className="w-full max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800 max-h-[90vh]"
          id="copy-routine-modal"
        >
          {/* Header */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Copy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base leading-snug">
                  Copiar Rotina
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Origem: <strong>{DAY_NAMES[sourceDay].full}</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto space-y-3.5 text-sm">
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Deseja duplicar as tarefas de{' '}
              <strong className="text-stone-900 dark:text-stone-100">{DAY_NAMES[sourceDay].full}</strong> para quais dias?
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={selectWeekdays}
                className="px-2.5 py-1 text-xs font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg transition-colors"
              >
                Dias Úteis (Seg a Sex)
              </button>
              <button
                type="button"
                onClick={selectWeekend}
                className="px-2.5 py-1 text-xs font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg transition-colors"
              >
                Fim de Semana
              </button>
              <button
                type="button"
                onClick={selectAll}
                className="px-2.5 py-1 text-xs font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg transition-colors"
              >
                Todos
              </button>
            </div>

            {/* Day checklist */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Copiar para:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {otherDays.map((day) => {
                  const isSelected = selectedTargets.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-semibold'
                          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-750'
                      }`}
                    >
                      <span className="text-xs font-medium">{DAY_NAMES[day].full}</span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-amber-900 dark:text-amber-200 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p>
                As tarefas existentes nos dias de destino selecionados serão substituídas pela rotina de {DAY_NAMES[sourceDay].full}.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 rounded-xl font-medium text-xs text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedTargets.length === 0}
              className="flex-1 py-2 px-3 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar ({selectedTargets.length})</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
