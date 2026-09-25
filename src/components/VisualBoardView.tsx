import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Volume2,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Maximize2,
  Clock,
  Mic,
} from 'lucide-react';
import { RoutineTask } from '../types';
import { COLOR_THEMES } from './TaskIcon';
import { PecsIllustration } from './PecsIllustration';
import { soundManager } from '../utils/audio';

interface VisualBoardViewProps {
  tasks: RoutineTask[];
  onSelectTask: (task: RoutineTask) => void;
  onToggleComplete: (taskId: string) => void;
  viewSubtype: 'board' | 'first-then';
  onSetSubtype: (subtype: 'board' | 'first-then') => void;
}

export const VisualBoardView: React.FC<VisualBoardViewProps> = ({
  tasks,
  onSelectTask,
  onToggleComplete,
  viewSubtype,
  onSetSubtype,
}) => {
  const uncompleted = tasks.filter((t) => !t.completed);
  const firstTask = uncompleted[0];
  const thenTask = uncompleted[1];

  const handleCardClick = (e: React.MouseEvent, task: RoutineTask) => {
    e.stopPropagation();
    soundManager.playTaskAudio(task.title, task.voicePhrase, task.audioRecording);
    onSelectTask(task);
  };

  const handleQuickAudio = (e: React.MouseEvent, task: RoutineTask) => {
    e.stopPropagation();
    soundManager.playTaskAudio(task.title, task.voicePhrase, task.audioRecording);
  };

  return (
    <div className="space-y-3.5">
      {/* Streamlined View Switcher Bar (Prancha vs Primeiro/Depois) */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div
          data-help-id="board-switcher"
          className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 shadow-2xs"
        >
          <button
            type="button"
            onClick={() => onSetSubtype('board')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewSubtype === 'board'
                ? 'bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Prancha de Cartões
          </button>
          <button
            type="button"
            onClick={() => onSetSubtype('first-then')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewSubtype === 'first-then'
                ? 'bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Primeiro / Depois
          </button>
        </div>

        <div
          data-help-id="tea-mode-badge"
          className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-800/60 px-2.5 py-1 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-[11px] font-bold text-stone-600 dark:text-stone-300"
        >
          <div className="flex items-center -space-x-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span>Modo TEA</span>
        </div>
      </div>

      {/* VIEW 1: PRIMEIRO / DEPOIS GIGANTE */}
      {viewSubtype === 'first-then' ? (
        <div className="p-4 bg-stone-50 dark:bg-stone-850 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Prancha de Transição Terapêutica
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Foco nas duas atividades imediatas para a criança
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center relative">
            {/* 1. PRIMEIRO */}
            {firstTask ? (
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleCardClick(e, firstTask)}
                className="bg-white dark:bg-stone-900 p-5 rounded-3xl border-2 border-indigo-500 dark:border-indigo-400 shadow-md flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[11px] uppercase tracking-wider">
                    1º Primeiro
                  </span>
                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {firstTask.time}
                  </span>
                </div>

                <div className="my-3 flex items-center justify-center">
                  <PecsIllustration
                    iconName={firstTask.iconName}
                    imageUrl={firstTask.imageUrl}
                    size={112}
                    className="w-28 h-28"
                  />
                </div>

                <h4 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 mb-2">
                  {firstTask.title}
                </h4>

                <div className="w-full flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={(e) => handleQuickAudio(e, firstTask)}
                    className={`p-2 rounded-xl transition-colors ${
                      firstTask.audioRecording
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/80'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
                    }`}
                    title={firstTask.audioRecording ? 'Ouvir voz gravada dos pais' : 'Ouvir voz'}
                  >
                    {firstTask.audioRecording ? (
                      <Mic className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(firstTask.id);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Concluir</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-dashed border-stone-300 dark:border-stone-700 text-center flex flex-col items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-500 mb-2" />
                <h4 className="font-bold text-stone-700 dark:text-stone-200 text-sm">
                  Todas as tarefas de hoje concluídas!
                </h4>
              </div>
            )}

            {/* 2. DEPOIS */}
            {thenTask ? (
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleCardClick(e, thenTask)}
                className="bg-white dark:bg-stone-900 p-5 rounded-3xl border-2 border-emerald-500 dark:border-emerald-400 shadow-md flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] uppercase tracking-wider">
                    2º Depois
                  </span>
                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {thenTask.time}
                  </span>
                </div>

                <div className="my-3 flex items-center justify-center">
                  <PecsIllustration
                    iconName={thenTask.iconName}
                    imageUrl={thenTask.imageUrl}
                    size={112}
                    className="w-28 h-28"
                  />
                </div>

                <h4 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 mb-2">
                  {thenTask.title}
                </h4>

                <div className="w-full flex items-center justify-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={(e) => handleQuickAudio(e, thenTask)}
                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Ouvir Atividade</span>
                  </button>
                </div>
              </motion.div>
            ) : firstTask ? (
              <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 text-center flex flex-col items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-500 mb-2" />
                <h4 className="font-bold text-stone-700 dark:text-stone-200 text-sm">
                  Depois é Momento Livre!
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Ao terminar a primeira tarefa, o dia estará completo!
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* VIEW 2: PRANCHA COMPLETA DE CARTÕES GRANDES (ESTILO PECS / CAA PROFISSIONAL) */
        <div className="grid grid-cols-2 gap-3 sm:gap-4" id="pecs-cards-grid">
          {tasks.map((task, idx) => {
            const isCompleted = task.completed;
            const autismPalette = [
              { accent: 'bg-blue-500', badge: 'text-blue-600 dark:text-blue-400', borderHover: 'hover:border-blue-400 dark:hover:border-blue-500' },
              { accent: 'bg-amber-400', badge: 'text-amber-600 dark:text-amber-400', borderHover: 'hover:border-amber-400 dark:hover:border-amber-500' },
              { accent: 'bg-rose-500', badge: 'text-rose-600 dark:text-rose-400', borderHover: 'hover:border-rose-400 dark:hover:border-rose-500' },
              { accent: 'bg-emerald-500', badge: 'text-emerald-600 dark:text-emerald-400', borderHover: 'hover:border-emerald-400 dark:hover:border-emerald-500' },
            ];
            const autismTheme = autismPalette[idx % autismPalette.length];

            return (
              <motion.div
                key={task.id}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleCardClick(e, task)}
                className={`p-3.5 rounded-3xl border-2 flex flex-col items-center justify-between text-center cursor-pointer transition-all shadow-2xs ${
                  isCompleted
                    ? 'bg-stone-100/90 dark:bg-stone-850/60 border-stone-200 dark:border-stone-700 opacity-65'
                    : `bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-700/80 ${autismTheme.borderHover} hover:shadow-md`
                }`}
              >
                {/* Top Colored Accent Strip (Autism Spectrum Touch) */}
                <div className={`h-1.5 w-12 ${autismTheme.accent} rounded-full mb-2 shrink-0`} />

                {/* Top card bar: Time pill + Audio quick button */}
                <div className="w-full flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                    {task.time}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleQuickAudio(e, task)}
                    className={`p-1.5 rounded-full transition-colors ${
                      task.audioRecording
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 ring-1 ring-amber-300 dark:ring-amber-700'
                        : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                    }`}
                    title={task.audioRecording ? 'Ouvir voz gravada dos pais' : 'Ouvir voz da atividade'}
                  >
                    {task.audioRecording ? (
                      <Mic className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Big Visual Drawing on Crisp White Canvas */}
                <div className="my-2 flex items-center justify-center">
                  <PecsIllustration
                    iconName={task.iconName}
                    imageUrl={task.imageUrl}
                    size={96}
                    className="w-24 h-24"
                  />
                </div>

                {/* High Contrast Bold Title */}
                <h4
                  className={`text-base sm:text-lg md:text-xl font-black leading-snug tracking-tight my-2 line-clamp-2 px-1 ${
                    isCompleted
                      ? 'line-through text-stone-400 dark:text-stone-500'
                      : 'text-stone-900 dark:text-stone-100'
                  }`}
                >
                  {task.title}
                </h4>

                {/* Bottom Complete Button (Clear and Inviting) */}
                <div className="w-full pt-2 border-t border-stone-100 dark:border-stone-700/80">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(task.id);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 ${
                      isCompleted
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-stone-100 dark:bg-stone-700/80 text-stone-800 dark:text-stone-100 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 border border-stone-200/80 dark:border-stone-600'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Feito!</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-stone-400 dark:text-stone-400" />
                        <span>Concluir</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
