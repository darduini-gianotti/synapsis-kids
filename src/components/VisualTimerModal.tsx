import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { RoutineTask } from '../types';
import { TaskIcon, COLOR_THEMES } from './TaskIcon';
import { soundManager } from '../utils/audio';

interface VisualTimerModalProps {
  task: RoutineTask;
  isOpen: boolean;
  onClose: () => void;
  onFinishTask?: () => void;
}

export const VisualTimerModal: React.FC<VisualTimerModalProps> = ({
  task,
  isOpen,
  onClose,
  onFinishTask,
}) => {
  const initialDuration = (task.durationMinutes || 10) * 60;
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft((task.durationMinutes || 10) * 60);
      setIsRunning(false);
    }
  }, [isOpen, task.durationMinutes]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            soundManager.playSuccess();
            soundManager.speak(`Tempo concluído para ${task.title}! Muito bem!`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, task.title]);

  if (!isOpen) return null;

  const totalTime = (task.durationMinutes || 10) * 60;
  const progressRatio = totalTime > 0 ? timeLeft / totalTime : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const theme = COLOR_THEMES[task.color] || COLOR_THEMES.indigo;

  const strokeDashoffset = 283 * (1 - progressRatio);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-2xl shadow-xl overflow-hidden border border-stone-200 dark:border-stone-800 flex flex-col items-center p-5 text-center"
          id="visual-timer-modal"
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl ${theme.bg} text-white flex items-center justify-center`}>
                <TaskIcon name={task.iconName} className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Temporizador Visual
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-0.5 leading-snug">
            {task.title}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-5 font-medium">
            Acompanhe o tempo visualmente
          </p>

          {/* Time Timer Circular Graphic */}
          <div className="relative w-48 h-48 flex items-center justify-center my-1">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-stone-100 dark:stroke-stone-800 fill-stone-50 dark:fill-stone-850"
                strokeWidth="7"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className={theme.text}
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>

            {/* Inner Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-stone-800 dark:text-stone-100 tracking-tight font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mt-1">
                {timeLeft === 0 ? 'Concluído!' : isRunning ? 'Em andamento' : 'Pausado'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2.5 mt-5">
            <button
              type="button"
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(totalTime);
              }}
              className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 transition-all"
              title="Reiniciar tempo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="toggle-timer-run-btn"
              onClick={() => {
                if (timeLeft === 0) setTimeLeft(totalTime);
                setIsRunning(!isRunning);
              }}
              className={`px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white flex items-center gap-2 active:scale-95 transition-all ${
                isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{timeLeft === 0 ? 'Recomeçar' : 'Iniciar'}</span>
                </>
              )}
            </button>

            {onFinishTask && (
              <button
                type="button"
                onClick={() => {
                  onFinishTask();
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 active:scale-95 transition-all"
                title="Concluir tarefa"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
