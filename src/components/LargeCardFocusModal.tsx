import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  CheckCircle2,
  Circle,
  Timer,
  Sparkles,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { RoutineTask } from '../types';
import { COLOR_THEMES } from './TaskIcon';
import { PecsIllustration } from './PecsIllustration';
import { soundManager } from '../utils/audio';

interface LargeCardFocusModalProps {
  task: RoutineTask | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete: (taskId: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onOpenTimer?: (task: RoutineTask) => void;
}

export const LargeCardFocusModal: React.FC<LargeCardFocusModalProps> = ({
  task,
  isOpen,
  onClose,
  onToggleComplete,
  onToggleSubtask,
  onOpenTimer,
}) => {
  if (!isOpen || !task) return null;

  const isCompleted = task.completed;
  const hasSubtasks = Boolean(task.subtasks && task.subtasks.length > 0);
  const allSubtasksDone = hasSubtasks && task.subtasks.every((s) => s.completed);
  const isDone = isCompleted || allSubtasksDone;

  const getCelebrateImage = () => {
    if (task.imageUrl?.includes('joao')) return '/mascots/joao_sorriso.jpg';
    if (task.imageUrl?.includes('gigi')) return '/mascots/gigi_sorriso.jpg';
    return '/mascots/panquecca_sorriso.jpg';
  };

  const theme = COLOR_THEMES[task.color] || COLOR_THEMES.indigo;

  const handleSpeak = () => {
    soundManager.playTaskAudio(task.title, task.voicePhrase, task.audioRecording);
  };

  const handleComplete = () => {
    onToggleComplete(task.id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/80 dark:bg-black/90 backdrop-blur-sm select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 flex flex-col max-h-[94vh]"
          id="large-card-focus-modal"
        >
          {/* Top Bar with gentle Back button */}
          <div className="p-3.5 px-4 bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200/70 border border-stone-200 dark:border-stone-700 text-xs font-bold transition-all active:scale-95 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar à Prancha</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-200/80 dark:bg-stone-700/80 text-stone-700 dark:text-stone-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {task.time}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Card Focus Body */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col items-center text-center space-y-3">
            {/* Animated Mascot / Illustration Card */}
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={handleSpeak}
              className={`w-full ${
                hasSubtasks ? 'max-w-[190px] sm:max-w-[210px]' : 'max-w-[270px]'
              } aspect-square rounded-3xl overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all border-4 shadow-md relative ${
                isDone
                  ? 'bg-stone-100 dark:bg-stone-800/60 border-emerald-400 dark:border-emerald-600'
                  : 'bg-stone-50 dark:bg-stone-800/90 border-indigo-500/80 dark:border-indigo-400 hover:border-indigo-600 dark:hover:border-indigo-300'
              }`}
              title="Toque para ouvir a voz"
            >
              {task.videoUrl ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black/5 dark:bg-black/30">
                  {isDone ? (
                    <img
                      src={getCelebrateImage()}
                      alt="Mascote comemorando"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={task.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span className="bg-sky-500/90 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                      {isDone ? '✨ Parabéns!' : '🐾 Mascote Guia'}
                    </span>
                    <span className="bg-stone-900/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-sky-300" />
                      Ouvir
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-6 flex flex-col items-center justify-center">
                  <PecsIllustration
                    iconName={task.iconName}
                    imageUrl={task.imageUrl}
                    size={hasSubtasks ? 110 : 140}
                    className={`${hasSubtasks ? 'w-28 h-28' : 'w-36 h-36'} drop-shadow-xs`}
                  />
                  {/* Little sound prompt underneath */}
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold shadow-2xs">
                    <Volume2 className="w-3 h-3 animate-pulse" />
                    <span>Toque para Ouvir</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Big Activity Title */}
            <div>
              <h2
                className={`${
                  hasSubtasks ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl md:text-5xl'
                } font-black text-stone-900 dark:text-stone-100 tracking-tight leading-tight`}
              >
                {task.title}
              </h2>
              {task.notes && (
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-md font-semibold leading-relaxed">
                  {task.notes}
                </p>
              )}
            </div>

            {/* Subtasks / Steps Sequence (if available, e.g. for Bathroom or Brushing) */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="w-full pt-3 text-left">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-sm sm:text-base font-black text-stone-700 dark:text-stone-200 uppercase tracking-wide">
                    Passos desta atividade:
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {task.subtasks.filter(s => s.completed).length} de {task.subtasks.length} concluídos
                  </span>
                </div>

                <div className="space-y-2.5">
                  {task.subtasks.map((step, idx) => (
                    <motion.div
                      key={step.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onToggleSubtask && onToggleSubtask(task.id, step.id)}
                      className={`p-3.5 sm:p-4.5 rounded-2xl border-2 sm:border-3 flex items-center justify-between gap-3.5 cursor-pointer transition-all shadow-xs ${
                        step.completed
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 opacity-80'
                          : 'bg-white dark:bg-stone-800/90 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:border-indigo-400 dark:hover:border-indigo-500'
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <span className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-2xs ${
                          step.completed
                            ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                            : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className={`text-base sm:text-xl font-bold leading-snug break-words ${step.completed ? 'line-through opacity-75' : ''}`}>
                          {step.title}
                        </span>
                      </div>

                      <div className="shrink-0">
                        {step.completed ? (
                          <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-7 h-7 sm:w-8 sm:h-8 text-stone-300 dark:text-stone-600" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Timer button if activity has duration */}
            {task.durationMinutes && !isCompleted && onOpenTimer && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTimer(task);
                }}
                className="w-full max-w-xs py-2.5 px-4 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-300/80 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Timer className="w-4 h-4 text-amber-600" />
                <span>Abrir Temporizador ({task.durationMinutes} min)</span>
              </button>
            )}
          </div>

          {/* Bottom Huge Tactile Completion Bar */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800">
            {isCompleted ? (
              <div className="space-y-2">
                <button
                  type="button"
                  id="large-card-complete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onClose();
                  }}
                  className="w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-95 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 className="w-7 h-7" />
                  <span>Concluído! Voltar às Rotinas</span>
                </button>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleComplete}
                    className="text-xs text-stone-400 dark:text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 underline transition-colors py-1"
                  >
                    Desmarcar esta atividade
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                id="large-card-complete-btn"
                onClick={handleComplete}
                className="w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Sparkles className="w-7 h-7 text-amber-300" />
                <span>Tudo Feito! Concluir Atividade</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
