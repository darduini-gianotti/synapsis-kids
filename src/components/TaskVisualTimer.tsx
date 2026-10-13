import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, CheckCircle2, X, Plus, Minus, Sparkles } from 'lucide-react';
import { RoutineTask } from '../types';
import { COLOR_THEMES } from './TaskIcon';
import { soundManager } from '../utils/audio';

interface TaskVisualTimerProps {
  task: RoutineTask;
  variant?: 'inline' | 'embedded';
  onClose?: () => void;
  onFinishTask?: () => void;
  className?: string;
}

export const TaskVisualTimer: React.FC<TaskVisualTimerProps> = ({
  task,
  variant = 'inline',
  onClose,
  onFinishTask,
  className = '',
}) => {
  const initialDuration = Math.max(60, (task.durationMinutes || 10) * 60);
  const [totalTime, setTotalTime] = useState<number>(initialDuration);
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  // Re-sync if task duration changes
  useEffect(() => {
    const dur = Math.max(60, (task.durationMinutes || 10) * 60);
    setTotalTime(dur);
    setTimeLeft(dur);
    setIsRunning(false);
  }, [task.durationMinutes, task.id]);

  // Countdown timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
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

  const progressRatio = totalTime > 0 ? Math.max(0, Math.min(1, timeLeft / totalTime)) : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const theme = COLOR_THEMES[task.color] || COLOR_THEMES.indigo;

  // Add or subtract 1 minute
  const handleAdjustTime = (deltaSeconds: number) => {
    setTimeLeft((prev) => {
      const next = Math.max(0, prev + deltaSeconds);
      if (next > totalTime) setTotalTime(next);
      return next;
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const handleToggleRun = () => {
    if (timeLeft === 0) {
      setTimeLeft(totalTime);
    }
    setIsRunning((prev) => !prev);
  };

  // ==========================================
  // 1. INLINE VARIANT (Para Card da Agenda)
  // ==========================================
  if (variant === 'inline') {
    return (
      <div
        className={`w-full bg-stone-50/95 dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-700/80 rounded-xl p-2.5 shadow-2xs space-y-2 select-none ${className}`}
      >
        {/* Top bar: title + close */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-stone-700 dark:text-stone-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider">Temporizador Visual</span>
            <span className="text-[10px] font-medium text-stone-400">({Math.round(totalTime / 60)} min)</span>
          </div>

          <div className="flex items-center gap-1">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 transition-colors"
                title="Fechar temporizador"
                aria-label="Fechar temporizador"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Middle row: Mini Circular SVG + Big Countdown + Actions */}
        <div className="flex items-center justify-between gap-3">
          {/* Mini Ring & Numbers */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  className="stroke-stone-200 dark:stroke-stone-700 fill-none"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  className={theme.text}
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="none"
                  strokeDasharray="88"
                  strokeDashoffset={88 * (1 - progressRatio)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-stone-600 dark:text-stone-400">
                  {Math.round(progressRatio * 100)}%
                </span>
              </div>
            </div>

            <div>
              <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-stone-800 dark:text-stone-100">
                {timeFormatted}
              </span>
              <div className="text-[9px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                {timeLeft === 0 ? '✨ Concluído!' : isRunning ? 'Em andamento' : 'Pausado'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300/70 dark:hover:bg-stone-700 active:scale-95 transition-all"
              title="Reiniciar tempo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleToggleRun}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs text-white flex items-center gap-1.5 shadow-xs active:scale-95 transition-all ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{timeLeft === 0 ? 'Recomeçar' : 'Iniciar'}</span>
                </>
              )}
            </button>

            {onFinishTask && (
              <button
                type="button"
                onClick={onFinishTask}
                className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 active:scale-95 transition-all"
                title="Concluir tarefa agora"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom linear progress bar */}
        <div className="w-full bg-stone-200/80 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full ${theme.bg} transition-all duration-1000 ease-linear rounded-full`}
            style={{ width: `${progressRatio * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. EMBEDDED VARIANT (Para Modo Cartões Grandes)
  // ==========================================
  const strokeDashoffset = 283 * (1 - progressRatio);

  return (
    <div
      className={`w-full max-w-sm mx-auto bg-stone-50 dark:bg-stone-850 border-2 border-stone-200 dark:border-stone-700/80 rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-xs select-none ${className}`}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-[11px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          Tempo Restante
        </span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-200/70 dark:bg-stone-700 text-stone-700 dark:text-stone-200">
          {Math.round(totalTime / 60)} min total
        </span>
      </div>

      {/* Big Circular Time-Timer Graphic */}
      <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-stone-200 dark:stroke-stone-750 fill-white dark:fill-stone-900"
            strokeWidth="7"
          />
          {/* Colored Pie/Ring Progress */}
          <circle
            cx="50"
            cy="50"
            r="45"
            className={theme.text}
            stroke="currentColor"
            strokeWidth="7"
            fill="none"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        {/* Center Countdown & Status */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-mono">
            {timeFormatted}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-stone-400 dark:text-stone-400 uppercase tracking-wider mt-1">
            {timeLeft === 0 ? '✨ Concluído!' : isRunning ? 'Em andamento' : 'Pausado'}
          </span>
        </div>
      </div>

      {/* Quick +/- 1 min adjuster */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => handleAdjustTime(-60)}
          disabled={timeLeft <= 60}
          className="px-2 py-1 rounded-lg bg-stone-200/80 dark:bg-stone-750 text-stone-600 dark:text-stone-300 text-[11px] font-bold hover:bg-stone-300 dark:hover:bg-stone-700 disabled:opacity-40 transition-all flex items-center gap-0.5 active:scale-95"
          title="Diminuir 1 minuto"
        >
          <Minus className="w-3 h-3" />
          <span>1m</span>
        </button>
        <button
          type="button"
          onClick={() => handleAdjustTime(60)}
          className="px-2 py-1 rounded-lg bg-stone-200/80 dark:bg-stone-750 text-stone-600 dark:text-stone-300 text-[11px] font-bold hover:bg-stone-300 dark:hover:bg-stone-700 transition-all flex items-center gap-0.5 active:scale-95"
          title="Adicionar 1 minuto"
        >
          <Plus className="w-3 h-3" />
          <span>1m</span>
        </button>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center gap-2.5 w-full justify-center">
        <button
          type="button"
          onClick={handleReset}
          className="p-3 rounded-2xl bg-stone-200/80 dark:bg-stone-750 text-stone-700 dark:text-stone-300 hover:bg-stone-300/80 dark:hover:bg-stone-700 active:scale-95 transition-all shadow-2xs"
          title="Reiniciar tempo"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleToggleRun}
          className={`flex-1 max-w-[180px] py-3 px-5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
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
            onClick={onFinishTask}
            className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 active:scale-95 transition-all shadow-2xs"
            title="Concluir tarefa agora"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
