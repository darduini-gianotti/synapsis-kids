import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Check,
  ChevronRight,
  Clock,
  ListChecks,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  CLINICAL_TEMPLATES,
  ClinicalRoutineTemplate,
} from '../utils/clinicalTemplates';
import { DayOfWeek, RoutineTask } from '../types';
import { soundManager } from '../utils/audio';

interface ClinicalTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: DayOfWeek;
  dayName: string;
  onApplyTemplate: (
    tasks: RoutineTask[],
    target: 'current-day' | 'weekdays' | 'all-week',
    mode: 'replace' | 'append'
  ) => void;
}

export const ClinicalTemplatesModal: React.FC<ClinicalTemplatesModalProps> = ({
  isOpen,
  onClose,
  selectedDay,
  dayName,
  onApplyTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ClinicalRoutineTemplate>(
    CLINICAL_TEMPLATES[0]
  );
  const [targetScope, setTargetScope] = useState<'current-day' | 'weekdays' | 'all-week'>(
    'current-day'
  );
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');

  if (!isOpen) return null;

  const handleApply = () => {
    // Generate complete RoutineTask instances with unique IDs
    const newTasks: RoutineTask[] = selectedTemplate.tasks.map((t, idx) => ({
      ...t,
      id: `task-template-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      completed: false,
      subtasks: t.subtasks.map((st, sIdx) => ({
        ...st,
        id: `st-${Date.now()}-${idx}-${sIdx}`,
        completed: false,
      })),
    }));

    onApplyTemplate(newTasks, targetScope, importMode);
    soundManager.playSound('marimba', 0.8);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/70 dark:bg-black/80 backdrop-blur-xs">
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-stone-200 dark:border-stone-800"
          id="clinical-templates-modal"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base sm:text-lg leading-tight flex items-center gap-2">
                  <span>Modelos Clínicos de Rotina</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Base Terapêutica
                  </span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Rotinas pré-estruturadas com foco em previsibilidade, desfralde e regulação sensorial
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 overscroll-contain">
            {/* Template Selection Pills/Cards */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                1. Escolha o Modelo Terapêutico:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CLINICAL_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplate.id === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tmpl)}
                      className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100">
                          {tmpl.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 shrink-0">
                          {tmpl.tasks.length} atividades
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                        {tmpl.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Preview Box */}
            <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                    Pré-visualização: {selectedTemplate.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Atividades incluídas com pictogramas ARASAAC e subpassos
                  </p>
                </div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded-lg">
                  {selectedTemplate.badge}
                </span>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {selectedTemplate.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {task.imageUrl ? (
                        <img
                          src={task.imageUrl}
                          alt={task.title}
                          className="w-9 h-9 object-contain rounded-lg p-0.5 bg-white shrink-0 border border-stone-100"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-stone-800 dark:text-stone-200 truncate block">
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400">
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {task.time}
                          </span>
                          {task.subtasks.length > 0 && (
                            <span className="flex items-center gap-0.5">
                              <ListChecks className="w-3 h-3" />
                              {task.subtasks.length} passos
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md shrink-0">
                      {task.durationMinutes} min
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Scope & Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                  2. Onde aplicar:
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'current-day', label: `Somente em ${dayName}` },
                    { id: 'weekdays', label: 'Segunda a Sexta (Dias Úteis)' },
                    { id: 'all-week', label: 'Toda a Semana (7 dias)' },
                  ].map((scope) => (
                    <label
                      key={scope.id}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                        targetScope === scope.id
                          ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold'
                          : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="targetScope"
                        checked={targetScope === scope.id}
                        onChange={() => setTargetScope(scope.id as any)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{scope.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                  3. Modo de inserção:
                </label>
                <div className="space-y-1.5">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                      importMode === 'replace'
                        ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span>Substituir rotina existente</span>
                      <span className="block text-[10px] font-normal text-stone-400">
                        Limpa as tarefas anteriores do dia escolhido
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                      importMode === 'append'
                        ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span>Adicionar ao final da rotina</span>
                      <span className="block text-[10px] font-normal text-stone-400">
                        Mantém as tarefas atuais e acrescenta o modelo
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 font-bold text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Aplicar Modelo ({selectedTemplate.title})</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
