import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { RoutineTask } from '../types';
import { TaskIcon, COLOR_THEMES } from './TaskIcon';

interface FirstThenCardProps {
  currentTask?: RoutineTask;
  nextTask?: RoutineTask;
  onOpenCurrentTask?: () => void;
}

export const FirstThenCard: React.FC<FirstThenCardProps> = ({
  currentTask,
  nextTask,
  onOpenCurrentTask,
}) => {
  if (!currentTask) {
    return (
      <div className="bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 rounded-2xl p-3.5 text-center text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Todas as tarefas concluídas!</span>
        </div>
        <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5 font-medium">
          A rotina deste dia foi realizada com sucesso.
        </p>
      </div>
    );
  }

  const currentTheme = COLOR_THEMES[currentTask.color] || COLOR_THEMES.indigo;
  const nextTheme = nextTask ? COLOR_THEMES[nextTask.color] || COLOR_THEMES.emerald : null;

  return (
    <div
      className="bg-stone-50 dark:bg-stone-850 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-3"
      id="first-then-card"
    >
      <div className="flex items-center justify-between text-[10px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 px-0.5">
        <span>Guia: Primeiro / Depois</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-bold">Foco atual</span>
      </div>

      <div className="grid grid-cols-2 gap-2 items-stretch">
        {/* FIRST (Primeiro) */}
        <div
          onClick={onOpenCurrentTask}
          className="bg-white dark:bg-stone-800 border border-indigo-200 dark:border-indigo-800/80 rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors shadow-2xs"
          title="Toque para ver os passos"
        >
          <div
            className={`w-9 h-9 rounded-lg ${
              currentTask.imageUrl
                ? 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700'
                : `${currentTheme.bg} text-white`
            } flex items-center justify-center shrink-0`}
          >
            {currentTask.imageUrl ? (
              <img
                src={currentTask.imageUrl}
                alt={currentTask.title}
                className="w-8 h-8 object-contain p-0.5"
              />
            ) : (
              <TaskIcon name={currentTask.iconName} className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
              1º Agora • {currentTask.time}
            </span>
            <p className="text-xs font-bold text-stone-800 dark:text-stone-100 truncate leading-snug">
              {currentTask.title}
            </p>
          </div>
        </div>

        {/* THEN (Depois) */}
        {nextTask ? (
          <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
            <div
              className={`w-9 h-9 rounded-lg ${
                nextTask.imageUrl
                  ? 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700'
                  : `${nextTheme?.bg || 'bg-stone-300 dark:bg-stone-700'} text-white`
              } flex items-center justify-center shrink-0 opacity-90`}
            >
              {nextTask.imageUrl ? (
                <img
                  src={nextTask.imageUrl}
                  alt={nextTask.title}
                  className="w-8 h-8 object-contain p-0.5"
                />
              ) : (
                <TaskIcon name={nextTask.iconName} className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                2º Depois • {nextTask.time}
              </span>
              <p className="text-xs font-semibold text-stone-700 dark:text-stone-200 truncate leading-snug">
                {nextTask.title}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 rounded-xl p-2.5 flex items-center gap-2 text-stone-700 dark:text-stone-300 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider block text-stone-500 dark:text-stone-400">
                2º Depois
              </span>
              <p className="text-xs font-semibold text-stone-800 dark:text-stone-100 truncate">Descanso livre</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
