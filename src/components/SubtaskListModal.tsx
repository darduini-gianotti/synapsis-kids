import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  X,
  Sparkles,
  Volume2,
  Plus,
  Trash2,
  Pencil,
  Check,
  Settings2,
  Lock,
} from 'lucide-react';
import { RoutineTask, SubTask } from '../types';
import { TaskIcon, COLOR_THEMES } from './TaskIcon';
import { soundManager } from '../utils/audio';

interface SubtaskListModalProps {
  task: RoutineTask;
  isOpen: boolean;
  onClose: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onCompleteAll: () => void;
  onAddSubtask: (title: string) => void;
  onUpdateSubtask?: (subtaskId: string, newTitle: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onEditTaskDetails?: (task: RoutineTask) => void;
  isLocked?: boolean;
  onRequestUnlock?: () => void;
}

export const SubtaskListModal: React.FC<SubtaskListModalProps> = ({
  task,
  isOpen,
  onClose,
  onToggleSubtask,
  onCompleteAll,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  onEditTaskDetails,
  isLocked = false,
  onRequestUnlock,
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  if (!isOpen) return null;

  const total = task.subtasks.length;
  const completedCount = task.subtasks.filter((s) => s.completed).length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const allCompleted = total > 0 && completedCount === total;
  const theme = COLOR_THEMES[task.color] || COLOR_THEMES.indigo;

  const handleSpeak = () => {
    if (task.audioRecording) {
      soundManager.playRecording(task.audioRecording);
      return;
    }
    if (task.voicePhrase) {
      soundManager.speak(task.voicePhrase);
    } else {
      soundManager.speak(
        `Passos de: ${task.title}. ${completedCount} de ${total} passos concluídos.`
      );
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleStartEdit = (subtask: SubTask) => {
    setEditingSubtaskId(subtask.id);
    setEditingTitle(subtask.title);
  };

  const handleSaveEdit = (subtaskId: string) => {
    if (editingTitle.trim() && onUpdateSubtask) {
      onUpdateSubtask(subtaskId, editingTitle.trim());
    }
    setEditingSubtaskId(null);
    setEditingTitle('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden border border-stone-200 dark:border-stone-800"
          id="subtask-list-modal"
        >
          {/* Header */}
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/80">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl ${theme.bg} text-white flex items-center justify-center shrink-0 shadow-xs`}
                >
                  <TaskIcon name={task.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-stone-500 dark:text-stone-400">
                      {task.time} • Passos da Tarefa
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 leading-snug">
                    {task.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  id="speak-subtasks-btn"
                  onClick={handleSpeak}
                  className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 transition-colors"
                  aria-label="Ouvir instrução"
                  title="Ouvir áudio da tarefa"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {onEditTaskDetails && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isLocked && onRequestUnlock) {
                        onRequestUnlock();
                        return;
                      }
                      onClose();
                      onEditTaskDetails(task);
                    }}
                    className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 transition-colors"
                    title={isLocked ? 'Edição bloqueada por senha' : 'Editar informações completas da tarefa'}
                  >
                    {isLocked ? <Lock className="w-4 h-4 text-amber-500" /> : <Settings2 className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  id="close-subtasks-btn"
                  onClick={onClose}
                  className="p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                <span>
                  Progresso: <strong>{completedCount} de {total}</strong> concluídos
                </span>
                <span className={allCompleted ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-stone-500 dark:text-stone-400'}>
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${allCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                  initial={false}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* Subtasks items List */}
          <div className="p-4 overflow-y-auto space-y-2 flex-1 overscroll-contain">
            {task.notes && (
              <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 rounded-xl p-2.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <span className="font-semibold">Nota: </span>
                {task.notes}
              </div>
            )}

            {task.subtasks.length === 0 ? (
              <div className="text-center py-6 text-stone-400 dark:text-stone-500">
                <p className="text-sm font-medium">Nenhum passo adicionado ainda.</p>
                <p className="text-xs mt-1">Use o campo abaixo para adicionar os passos da tarefa.</p>
              </div>
            ) : (
              task.subtasks.map((subtask, index) => {
                const isChecked = subtask.completed;
                const isEditing = editingSubtaskId === subtask.id;

                return (
                  <div
                    key={subtask.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isChecked
                        ? 'bg-stone-50 dark:bg-stone-850 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500'
                        : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700/80 text-stone-800 dark:text-stone-100'
                    }`}
                    id={`subtask-item-${subtask.id}`}
                  >
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleSubtask(subtask.id)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-emerald-500 text-white shadow-2xs'
                          : 'bg-stone-100 dark:bg-stone-700/60 text-stone-300 dark:text-stone-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-stone-200 dark:border-stone-600'
                      }`}
                      aria-label={isChecked ? 'Desmarcar' : 'Marcar como feito'}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    {/* Step Title or Inline Edit Input */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(subtask.id);
                              if (e.key === 'Escape') setEditingSubtaskId(null);
                            }}
                            autoFocus
                            className="w-full px-3 py-1.5 text-base bg-stone-100 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 text-stone-900 dark:text-stone-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(subtask.id)}
                            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            title="Salvar alteração"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => onToggleSubtask(subtask.id)}
                          className="cursor-pointer"
                        >
                          <span className="text-xs sm:text-sm font-extrabold text-stone-500 dark:text-stone-400 uppercase tracking-wide block">
                            Passo {index + 1}
                          </span>
                          <p
                            className={`text-base sm:text-lg font-bold leading-snug break-words ${
                              isChecked ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-800 dark:text-stone-100'
                            }`}
                          >
                            {subtask.title}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions: Edit text & Delete */}
                    {!isEditing && !isLocked && (
                      <div className="flex items-center gap-0.5 shrink-0">
                        {onUpdateSubtask && (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(subtask)}
                            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700/60 transition-colors"
                            title="Renomear passo"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDeleteSubtask(subtask.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remover passo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Celebration box when all finished */}
            {allCompleted && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center text-emerald-900 dark:text-emerald-200 mt-2"
              >
                <div className="w-9 h-9 mx-auto mb-1 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm">Muito bem! Todos os passos concluídos!</h4>
              </motion.div>
            )}
          </div>

          {/* Add Subtask Input Form or Locked Notice */}
          <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800">
            {isLocked ? (
              <div className="flex items-center justify-between py-0.5">
                <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Edição de passos bloqueada pelos pais
                </span>
                {onRequestUnlock && (
                  <button
                    type="button"
                    onClick={onRequestUnlock}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Desbloquear
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleAddSubmit} className="flex gap-2">
                <input
                  type="text"
                  id="new-step-input"
                  placeholder="Novo passo (ex: Guardar sapatos)..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-base bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500"
                />
                <button
                  type="submit"
                  id="add-step-btn"
                  disabled={!newSubtaskTitle.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm disabled:opacity-40 flex items-center gap-1 active:scale-95 transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
              </form>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 flex gap-2">
            <button
              type="button"
              id="confirm-all-subtasks-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (!task.completed) {
                  onCompleteAll();
                }
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl font-extrabold text-white flex items-center justify-center gap-2 active:scale-98 transition-all text-sm bg-emerald-600 hover:bg-emerald-700 shadow-md"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{task.completed ? 'Voltar às Rotinas' : 'Concluir Tarefa e Fechar'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
