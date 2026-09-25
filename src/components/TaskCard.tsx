import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  Volume2,
  ListChecks,
  ChevronRight,
  Pencil,
  Trash2,
  Clock,
  Timer,
  Plus,
  Lock,
  Mic,
} from 'lucide-react';
import { RoutineTask } from '../types';
import { TaskIcon, COLOR_THEMES } from './TaskIcon';
import { soundManager } from '../utils/audio';

interface TaskCardProps {
  task: RoutineTask;
  isNext?: boolean;
  onToggleComplete: (taskId: string) => void;
  onOpenSubtasks: (task: RoutineTask) => void;
  onOpenTimer?: (task: RoutineTask) => void;
  onEditTask?: (task: RoutineTask) => void;
  onDeleteTask?: (taskId: string) => void;
  isLocked?: boolean;
  onRequestUnlock?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isNext = false,
  onToggleComplete,
  onOpenSubtasks,
  onOpenTimer,
  onEditTask,
  onDeleteTask,
  isLocked = false,
  onRequestUnlock,
}) => {
  const isCompleted = task.completed;
  const theme = COLOR_THEMES[task.color] || COLOR_THEMES.indigo;

  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const hasSubtasks = totalSubtasks > 0;

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playTaskAudio(task.title, task.voicePhrase, task.audioRecording);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      id={`task-card-${task.id}`}
      className={`relative rounded-2xl p-3.5 sm:p-4 transition-all border ${
        isCompleted
          ? 'bg-stone-50/90 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 opacity-75'
          : isNext
          ? 'bg-white dark:bg-stone-800 border-indigo-300 dark:border-indigo-500 ring-2 ring-indigo-50 dark:ring-indigo-950/60 shadow-sm'
          : 'bg-white dark:bg-stone-800 border-stone-200/90 dark:border-stone-700/80 shadow-2xs hover:border-stone-300 dark:hover:border-stone-600'
      }`}
    >
      {/* "Agora / Próxima" subtle indicator */}
      {isNext && !isCompleted && (
        <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-[10px] rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
          <span>Agora</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Visual Icon Badge */}
        <div
          onClick={() => hasSubtasks && onOpenSubtasks(task)}
          className={`w-12 h-12 rounded-xl ${
            isCompleted
              ? 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500'
              : task.imageUrl
              ? 'bg-white dark:bg-stone-800 border-2 border-indigo-200 dark:border-indigo-800 shadow-2xs'
              : `${theme.bg} text-white`
          } flex items-center justify-center shrink-0 transition-colors ${
            hasSubtasks ? 'cursor-pointer hover:opacity-95' : ''
          }`}
          title={hasSubtasks ? 'Ver passos' : task.title}
        >
          {task.imageUrl ? (
            <img
              src={task.imageUrl}
              alt={task.title}
              className="w-10 h-10 object-contain p-0.5"
              loading="lazy"
            />
          ) : (
            <TaskIcon name={task.iconName} className="w-6 h-6" />
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Top metadata line: Time pill, duration, and utility buttons */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  isCompleted ? 'bg-stone-100 dark:bg-stone-700/60 text-stone-500 dark:text-stone-400' : theme.badge
                }`}
              >
                <Clock className="w-3 h-3" />
                {task.time}
              </span>

              {task.durationMinutes && (
                <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-700/60 px-1.5 py-0.5 rounded-md">
                  {task.durationMinutes} min
                </span>
              )}
            </div>

            {/* Quick action buttons (Always available directly!) */}
            <div className="flex items-center gap-0.5">
              {/* Audio button */}
              <button
                type="button"
                data-help-id="task-audio"
                onClick={handlePlaySound}
                className={`p-1 rounded-md transition-colors ${
                  task.audioRecording
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 ring-1 ring-amber-300/80 dark:ring-amber-700'
                    : 'text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-stone-100 dark:hover:bg-stone-700/60'
                }`}
                title={task.audioRecording ? 'Ouvir voz gravada dos pais' : 'Ouvir lembrete sonoro'}
                aria-label="Tocar som da tarefa"
              >
                {task.audioRecording ? (
                  <Mic className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Timer button */}
              {onOpenTimer && task.durationMinutes && !isCompleted && (
                <button
                  type="button"
                  data-help-id="task-timer"
                  onClick={() => onOpenTimer(task)}
                  className="p-1 rounded-md text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                  title="Abrir temporizador visual"
                  aria-label="Temporizador visual"
                >
                  <Timer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </button>
              )}

              {/* Edit task button */}
              {onEditTask && (
                <button
                  type="button"
                  id={`edit-task-btn-${task.id}`}
                  data-help-id="task-edit"
                  onClick={() => {
                    if (isLocked && onRequestUnlock) {
                      onRequestUnlock();
                    } else {
                      onEditTask(task);
                    }
                  }}
                  className={`p-1 rounded-md transition-colors ${
                    isLocked
                      ? 'text-amber-500/80 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                      : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/60'
                  }`}
                  title={isLocked ? 'Edição bloqueada por senha dos pais' : 'Editar tarefa e passos'}
                  aria-label={isLocked ? 'Edição protegida' : 'Editar tarefa'}
                >
                  {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                </button>
              )}

              {/* Delete task button */}
              {onDeleteTask && (
                <button
                  type="button"
                  id={`delete-task-btn-${task.id}`}
                  data-help-id="task-delete"
                  onClick={() => {
                    if (isLocked && onRequestUnlock) {
                      onRequestUnlock();
                    } else {
                      onDeleteTask(task.id);
                    }
                  }}
                  className={`p-1 rounded-md transition-colors ${
                    isLocked
                      ? 'text-stone-300 dark:text-stone-600 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-700/60'
                      : 'text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                  }`}
                  title={isLocked ? 'Exclusão bloqueada por senha dos pais' : 'Excluir tarefa'}
                  aria-label="Excluir tarefa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => hasSubtasks && onOpenSubtasks(task)}
            className={`text-base font-bold leading-snug tracking-tight ${
              hasSubtasks ? 'cursor-pointer' : ''
            } ${
              isCompleted
                ? 'line-through text-stone-400 dark:text-stone-500'
                : 'text-stone-800 dark:text-stone-100 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {task.title}
          </h3>

          {/* Subtasks (Passos) Badge / Button */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {hasSubtasks ? (
              <button
                type="button"
                id={`open-subtasks-btn-${task.id}`}
                data-help-id="task-subtasks"
                onClick={() => onOpenSubtasks(task)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                  completedSubtasks === totalSubtasks
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80'
                    : 'bg-stone-100 dark:bg-stone-700/60 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-200 dark:hover:border-indigo-700'
                }`}
                title="Clique para ver ou gerenciar os passos desta tarefa"
              >
                <ListChecks className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {completedSubtasks}/{totalSubtasks} passos
                </span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>
            ) : (
              <button
                type="button"
                id={`add-steps-btn-${task.id}`}
                data-help-id="task-subtasks"
                onClick={() => onOpenSubtasks(task)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-stone-100 dark:hover:bg-stone-700/60 px-2 py-0.5 rounded-md transition-colors"
                title="Dividir esta tarefa em passos (ex: Guardar brinquedos, Arrumar cama)"
              >
                <Plus className="w-3 h-3" />
                <span>Adicionar passos</span>
              </button>
            )}
          </div>
        </div>

        {/* Big Tactile Checkbox Button */}
        <button
          type="button"
          id={`toggle-complete-btn-${task.id}`}
          data-help-id="task-check"
          onClick={() => onToggleComplete(task.id)}
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-90 ${
            isCompleted
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'bg-stone-50 dark:bg-stone-700/50 text-stone-300 dark:text-stone-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-stone-200 dark:border-stone-600'
          }`}
          aria-label={isCompleted ? 'Tarefa concluída' : 'Marcar como concluída'}
          title={isCompleted ? 'Concluído!' : 'Marcar como feito'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>
      </div>
    </motion.div>
  );
};

