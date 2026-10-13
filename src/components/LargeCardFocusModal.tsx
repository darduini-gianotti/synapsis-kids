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
import { TaskVisualTimer } from './TaskVisualTimer';
import { getTaskCelebrationDetails } from '../utils/mascotAssets';

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
  // Show celebration image if task is completed or all subtasks were done
  const showCelebrationImage = isCompleted || allSubtasksDone;
  const celebrationDetails = getTaskCelebrationDetails(task);

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

          {/* Main Card Focus Body: Fixed Media/Timer Top + Scrollable Compact Steps */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {/* 1. PINNED TOP HERO: Video/Mascot + Title + Compact Timer (Never scrolls out of view!) */}
            <div className="shrink-0 p-3 sm:p-4 pb-2 flex flex-col items-center text-center space-y-2 border-b border-stone-100 dark:border-stone-800/80">
              {/* Animated Mascot / Illustration Card */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={handleSpeak}
                className={`${
                  hasSubtasks ? 'w-36 h-36 sm:w-44 sm:h-44' : 'w-52 h-52 sm:w-60 sm:h-60'
                } shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all border-3 sm:border-4 shadow-md relative mx-auto ${
                  isCompleted
                    ? 'bg-stone-100 dark:bg-stone-800/60 border-emerald-400 dark:border-emerald-600'
                    : 'bg-stone-50 dark:bg-stone-800/90 border-indigo-500/80 dark:border-indigo-400 hover:border-indigo-600 dark:hover:border-indigo-300'
                }`}
                title="Toque para ouvir a voz"
              >
                {task.videoUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black/5 dark:bg-black/30">
                    {showCelebrationImage ? (
                      <img
                        src={celebrationDetails.image}
                        alt="Mascote comemorando"
                        onError={(e) => {
                          e.currentTarget.src = '/mascots/panquecca_sorriso.jpg';
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={task.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        ref={(el) => {
                          if (el) {
                            el.muted = true;
                            el.play().catch(() => {});
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                      <span className="bg-sky-500/90 backdrop-blur-xs text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                        {showCelebrationImage ? celebrationDetails.badge : '🐾 Mascote Guia'}
                      </span>
                      <span className="bg-stone-900/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Volume2 className="w-2.5 h-2.5 text-sky-300" />
                        Ouvir
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {showCelebrationImage && (task.imageUrl?.includes('mascot') || task.imageUrl?.includes('panquecca')) ? (
                      <div className="relative w-full h-full">
                        <img
                          src={celebrationDetails.image}
                          alt="Mascote comemorando"
                          onError={(e) => {
                            e.currentTarget.src = '/mascots/panquecca_sorriso.jpg';
                          }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                          <span className="bg-sky-500/90 backdrop-blur-xs text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                            {celebrationDetails.badge}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 flex flex-col items-center justify-center">
                        <PecsIllustration
                          iconName={task.iconName}
                          imageUrl={task.imageUrl}
                          size={hasSubtasks ? 90 : 120}
                          className={`${hasSubtasks ? 'w-20 h-20' : 'w-28 h-28'} drop-shadow-xs`}
                        />
                        {/* Little sound prompt underneath */}
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold shadow-2xs">
                          <Volume2 className="w-2.5 h-2.5 animate-pulse" />
                          <span>Toque para Ouvir</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Big Activity Title */}
              <div>
                <h2
                  className={`${
                    hasSubtasks ? 'text-lg sm:text-2xl' : 'text-2xl sm:text-3xl'
                  } font-black text-stone-900 dark:text-stone-100 tracking-tight leading-tight`}
                >
                  {task.title}
                </h2>
                {task.notes && (
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5 max-w-sm font-medium leading-tight">
                    {task.notes}
                  </p>
                )}
              </div>

              {/* Compact Integrated Visual Timer below video/title */}
              {task.durationMinutes && !isCompleted && (
                <div className="w-full max-w-sm">
                  <TaskVisualTimer
                    task={task}
                    variant="inline"
                    onFinishTask={handleComplete}
                  />
                </div>
              )}
            </div>

            {/* 2. SCROLLABLE COMPACT STEPS: Subtasks Sequence (Tight spacing & smaller font) */}
            {hasSubtasks ? (
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 w-full max-w-md mx-auto">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs sm:text-sm font-black text-stone-700 dark:text-stone-200 uppercase tracking-wide">
                    Passos da atividade:
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {task.subtasks.filter((s) => s.completed).length} de {task.subtasks.length} concluídos
                  </span>
                </div>

                <div className="space-y-1.5">
                  {task.subtasks.map((step, idx) => (
                    <motion.div
                      key={step.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onToggleSubtask && onToggleSubtask(task.id, step.id)}
                      className={`p-2 sm:p-2.5 px-3 rounded-xl border-2 flex items-center justify-between gap-2.5 cursor-pointer transition-all shadow-2xs ${
                        step.completed
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 opacity-80'
                          : 'bg-white dark:bg-stone-800/90 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:border-indigo-400 dark:hover:border-indigo-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                            step.completed
                              ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                              : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-bold leading-tight break-words ${
                            step.completed ? 'line-through opacity-75' : ''
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>

                      <div className="shrink-0">
                        {step.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : null}
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
