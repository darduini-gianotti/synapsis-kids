/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Settings,
  Volume2,
  VolumeX,
  ListTodo,
  Sparkles,
  Sun,
  Moon,
  Lock,
  Unlock,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react';

import {
  RoutineTask,
  DayOfWeek,
  DayRoutine,
  AppSettings,
  SubTask,
} from './types';
import {
  loadRoutines,
  saveRoutines,
  loadSettings,
  saveSettings,
  loadDateCompletions,
  saveDateCompletions,
  getTodayDateKey,
  getInitialRoutines,
  DAY_NAMES,
} from './utils/storage';
import { soundManager } from './utils/audio';

import { TaskCard } from './components/TaskCard';
import { SubtaskListModal } from './components/SubtaskListModal';
import { EditTaskModal } from './components/EditTaskModal';
import { CopyRoutineModal } from './components/CopyRoutineModal';
import { VisualTimerModal } from './components/VisualTimerModal';
import { SettingsModal } from './components/SettingsModal';
import { DaySelector } from './components/DaySelector';
import { FirstThenCard } from './components/FirstThenCard';
import { ParentPinModal } from './components/ParentPinModal';
import { ExportCalendarModal } from './components/ExportCalendarModal';
import { VisualBoardView } from './components/VisualBoardView';
import { LargeCardFocusModal } from './components/LargeCardFocusModal';
import { ClinicalTemplatesModal } from './components/ClinicalTemplatesModal';
import { ShareRoutineModal } from './components/ShareRoutineModal';
import { IncomingRoutineModal, IncomingRoutineData } from './components/IncomingRoutineModal';
import { decodeRoutine } from './utils/routineCodec';

export default function App() {
  // Current real date & day
  const todayDate = useMemo(() => new Date(), []);
  const todayDayOfWeek = todayDate.getDay() as DayOfWeek;
  const todayDateKey = useMemo(() => getTodayDateKey(), []);

  // Application State
  const [routines, setRoutines] = useState<Record<DayOfWeek, DayRoutine>>(loadRoutines);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDayOfWeek);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // View Mode for Non-verbal / PECS ('list' = agenda normal | 'board' = cartões grandes)
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [boardSubtype, setBoardSubtype] = useState<'board' | 'first-then'>('board');
  const [focusedLargeTask, setFocusedLargeTask] = useState<RoutineTask | null>(null);

  // Active Modals State
  const [activeSubtaskTask, setActiveSubtaskTask] = useState<RoutineTask | null>(null);
  const [activeTimerTask, setActiveTimerTask] = useState<RoutineTask | null>(null);
  const [editingTask, setEditingTask] = useState<RoutineTask | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isClinicalTemplatesOpen, setIsClinicalTemplatesOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [incomingRoutineData, setIncomingRoutineData] = useState<IncomingRoutineData | null>(null);

  // Listen for WhatsApp 1-Click Magic Link (#r=... or #rotina=... or #import=...)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (!hash || (!hash.startsWith('#rotina=') && !hash.startsWith('#import=') && !hash.startsWith('#r='))) {
        return;
      }
      try {
        const raw = hash.replace(/^#(rotina|import|r)=/, '');
        const clean = decodeURIComponent(raw);
        const parsed = decodeRoutine(clean) as IncomingRoutineData;
        if (parsed) {
          setIncomingRoutineData(parsed);
          soundManager.playSound('chime', 0.6);
        }
      } catch (err) {
        console.warn('Erro ao processar rotina recebida por URL:', err);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Parental Lock State
  const [isParentUnlocked, setIsParentUnlocked] = useState<boolean>(() => !settings.childLockEnabled);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinModalTitle, setPinModalTitle] = useState('Área dos Pais');
  const [pinModalDescription, setPinModalDescription] = useState('Digite a senha de 4 dígitos para liberar a edição da rotina.');
  const [pendingActionAfterPin, setPendingActionAfterPin] = useState<(() => void) | null>(null);

  const isEditLocked = Boolean(settings.childLockEnabled && !isParentUnlocked);

  const handleRequirePin = (action: () => void, title?: string, description?: string) => {
    if (!isEditLocked) {
      action();
      return;
    }
    setPendingActionAfterPin(() => action);
    if (title) setPinModalTitle(title);
    if (description) setPinModalDescription(description);
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    setIsParentUnlocked(true);
    if (pendingActionAfterPin) {
      const act = pendingActionAfterPin;
      setPendingActionAfterPin(null);
      act();
    }
  };

  const handleToggleLockStatus = () => {
    if (!settings.childLockEnabled) {
      setIsSettingsOpen(true);
      return;
    }
    if (isEditLocked) {
      handleRequirePin(() => {}, 'Desbloquear Edição', 'Digite a senha dos pais para liberar as alterações.');
    } else {
      setIsParentUnlocked(false);
      soundManager.playSound('bell', 0.4);
    }
  };

  // Time filter tab ('all' | 'morning' | 'afternoon' | 'night')
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'night'>('all');

  // Daily task completion persistence
  const [completions, setCompletions] = useState(() => loadDateCompletions(todayDateKey));

  // Keep storage updated
  useEffect(() => {
    saveRoutines(routines);
  }, [routines]);

  useEffect(() => {
    saveSettings(settings);
    soundManager.setVoicePreferences(
      settings.selectedVoiceURI,
      settings.voicePitch,
      settings.voiceRate,
      settings.voiceStyle || 'mascot'
    );
  }, [settings]);

  useEffect(() => {
    saveDateCompletions(todayDateKey, completions);
  }, [todayDateKey, completions]);

  // Apply dark mode class to root HTML element
  useEffect(() => {
    const theme = settings.themeMode || 'light';
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applySystemTheme = () => {
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      applySystemTheme();
      mediaQuery.addEventListener('change', applySystemTheme);
      return () => mediaQuery.removeEventListener('change', applySystemTheme);
    }
  }, [settings.themeMode]);

  // Determine current active dark mode status
  const isDarkMode = useMemo(() => {
    if (settings.themeMode === 'dark') return true;
    if (settings.themeMode === 'system' && typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }, [settings.themeMode]);

  const handleToggleTheme = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    setSettings((s) => ({ ...s, themeMode: nextTheme }));
  };

  // Current Day Tasks with completions merged
  const currentDayTasks = useMemo(() => {
    const dayRoutine = routines[selectedDay];
    if (!dayRoutine) return [];

    return dayRoutine.tasks
      .map((task) => {
        const isToday = selectedDay === todayDayOfWeek;
        const isCompleted = isToday
          ? Boolean(completions.tasks[task.id])
          : Boolean(task.completed);

        const mergedSubtasks = task.subtasks.map((st) => {
          const stCompleted = isToday
            ? Boolean(completions.subtasks[st.id])
            : Boolean(st.completed);
          return { ...st, completed: stCompleted };
        });

        return {
          ...task,
          completed: isCompleted,
          subtasks: mergedSubtasks,
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [routines, selectedDay, todayDayOfWeek, completions]);

  // Filtered tasks by period
  const displayedTasks = useMemo(() => {
    if (timeFilter === 'all') return currentDayTasks;

    return currentDayTasks.filter((task) => {
      const hour = parseInt(task.time.split(':')[0], 10);
      if (timeFilter === 'morning') return hour < 12;
      if (timeFilter === 'afternoon') return hour >= 12 && hour < 18;
      if (timeFilter === 'night') return hour >= 18;
      return true;
    });
  }, [currentDayTasks, timeFilter]);

  // Next upcoming uncompleted task for "Primeiro / Depois" visual guide
  const uncompletedTasks = useMemo(() => {
    return currentDayTasks.filter((t) => !t.completed);
  }, [currentDayTasks]);

  const currentFocusTask = uncompletedTasks[0];
  const nextFocusTask = uncompletedTasks[1];

  // Stats for all days (completed vs total)
  const taskStatsByDay = useMemo(() => {
    const stats: Record<DayOfWeek, { total: number; completed: number }> = {
      0: { total: 0, completed: 0 },
      1: { total: 0, completed: 0 },
      2: { total: 0, completed: 0 },
      3: { total: 0, completed: 0 },
      4: { total: 0, completed: 0 },
      5: { total: 0, completed: 0 },
      6: { total: 0, completed: 0 },
    };

    for (let day = 0; day <= 6; day++) {
      const d = day as DayOfWeek;
      const tasks = routines[d]?.tasks || [];
      const total = tasks.length;
      let completed = 0;

      if (d === todayDayOfWeek) {
        completed = tasks.filter((t) => completions.tasks[t.id]).length;
      } else {
        completed = tasks.filter((t) => t.completed).length;
      }

      stats[d] = { total, completed };
    }
    return stats;
  }, [routines, todayDayOfWeek, completions]);

  const totalDayTasks = currentDayTasks.length;
  const completedDayTasks = currentDayTasks.filter((t) => t.completed).length;
  const dayProgressPercent =
    totalDayTasks > 0 ? Math.round((completedDayTasks / totalDayTasks) * 100) : 0;

  // Toggle Task Completion
  const handleToggleTaskComplete = (taskId: string) => {
    const task = currentDayTasks.find((t) => t.id === taskId);
    if (!task) return;

    const willBeCompleted = !task.completed;

    if (selectedDay === todayDayOfWeek) {
      setCompletions((prev) => {
        const nextTasks = { ...prev.tasks };
        const nextSubtasks = { ...prev.subtasks };

        if (willBeCompleted) {
          nextTasks[taskId] = true;
          task.subtasks.forEach((st) => {
            nextSubtasks[st.id] = true;
          });
        } else {
          delete nextTasks[taskId];
        }
        return { tasks: nextTasks, subtasks: nextSubtasks };
      });
    } else {
      setRoutines((prev) => {
        const dayRoutine = prev[selectedDay];
        if (!dayRoutine) return prev;
        const updatedTasks = dayRoutine.tasks.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              completed: willBeCompleted,
              subtasks: t.subtasks.map((st) => ({
                ...st,
                completed: willBeCompleted,
              })),
            };
          }
          return t;
        });
        return {
          ...prev,
          [selectedDay]: { ...dayRoutine, tasks: updatedTasks },
        };
      });
    }

    if (willBeCompleted) {
      // Check if this was the last remaining uncompleted task of the day
      const remainingUncompleted = currentDayTasks.filter(
        (t) => t.id !== taskId && !t.completed
      );
      const isAllDayDone = remainingUncompleted.length === 0 && currentDayTasks.length > 0;

      if (isAllDayDone) {
        soundManager.playGrandCelebration(settings.soundVolume);
      } else {
        soundManager.playSuccess(settings.soundVolume);
      }

      if (settings.voiceEnabled) {
        soundManager.speakEncouragement(task.title, isAllDayDone, settings.soundVolume);
      }
    } else {
      soundManager.playSound('chime', settings.soundVolume);
    }
  };

  // Toggle Subtask Completion
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const task = currentDayTasks.find((t) => t.id === taskId);
    if (!task) return;

    const targetSubtask = task.subtasks.find((s) => s.id === subtaskId);
    if (!targetSubtask) return;

    const willBeCompleted = !targetSubtask.completed;

    if (selectedDay === todayDayOfWeek) {
      setCompletions((prev) => {
        const nextSubtasks = { ...prev.subtasks };
        if (willBeCompleted) {
          nextSubtasks[subtaskId] = true;
        } else {
          delete nextSubtasks[subtaskId];
        }

        const willAllSubtasksBeDone = task.subtasks.every((st) =>
          st.id === subtaskId ? willBeCompleted : Boolean(nextSubtasks[st.id])
        );

        const nextTasks = { ...prev.tasks };
        if (willAllSubtasksBeDone && task.subtasks.length > 0) {
          nextTasks[taskId] = true;
        }

        return { tasks: nextTasks, subtasks: nextSubtasks };
      });
    } else {
      setRoutines((prev) => {
        const dayRoutine = prev[selectedDay];
        if (!dayRoutine) return prev;
        const updatedTasks = dayRoutine.tasks.map((t) => {
          if (t.id === taskId) {
            const updatedSubtasks = t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, completed: willBeCompleted } : s
            );
            const allDone =
              updatedSubtasks.length > 0 &&
              updatedSubtasks.every((s) => s.completed);
            return {
              ...t,
              completed: allDone,
              subtasks: updatedSubtasks,
            };
          }
          return t;
        });
        return {
          ...prev,
          [selectedDay]: { ...dayRoutine, tasks: updatedTasks },
        };
      });
    }

    if (willBeCompleted) {
      soundManager.playSound('marimba', settings.soundVolume);
    } else {
      soundManager.playSound('chime', settings.soundVolume);
    }

    setActiveSubtaskTask((prev) => {
      if (!prev || prev.id !== taskId) return prev;
      return {
        ...prev,
        subtasks: prev.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: willBeCompleted } : st
        ),
      };
    });
  };

  // Complete All Subtasks in a task
  const handleCompleteAllSubtasks = (taskId: string) => {
    handleToggleTaskComplete(taskId);
  };

  // Add Subtask from modal
  const handleAddSubtaskToTask = (taskId: string, title: string) => {
    const newStep: SubTask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      completed: false,
      iconName: 'Check',
    };

    setRoutines((prev) => {
      const dayRoutine = prev[selectedDay];
      if (!dayRoutine) return prev;
      const updatedTasks = dayRoutine.tasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, subtasks: [...t.subtasks, newStep] };
        }
        return t;
      });
      return {
        ...prev,
        [selectedDay]: { ...dayRoutine, tasks: updatedTasks },
      };
    });

    setActiveSubtaskTask((prev) => {
      if (!prev || prev.id !== taskId) return prev;
      return { ...prev, subtasks: [...prev.subtasks, newStep] };
    });

    soundManager.playSound('chime', settings.soundVolume);
  };

  // Update Subtask Title from modal
  const handleUpdateSubtaskTitle = (
    taskId: string,
    subtaskId: string,
    newTitle: string
  ) => {
    setRoutines((prev) => {
      const dayRoutine = prev[selectedDay];
      if (!dayRoutine) return prev;
      const updatedTasks = dayRoutine.tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, title: newTitle } : st
            ),
          };
        }
        return t;
      });
      return {
        ...prev,
        [selectedDay]: { ...dayRoutine, tasks: updatedTasks },
      };
    });

    setActiveSubtaskTask((prev) => {
      if (!prev || prev.id !== taskId) return prev;
      return {
        ...prev,
        subtasks: prev.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, title: newTitle } : st
        ),
      };
    });
  };

  // Delete Subtask from modal
  const handleDeleteSubtaskFromTask = (taskId: string, subtaskId: string) => {
    setRoutines((prev) => {
      const dayRoutine = prev[selectedDay];
      if (!dayRoutine) return prev;
      const updatedTasks = dayRoutine.tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
          };
        }
        return t;
      });
      return {
        ...prev,
        [selectedDay]: { ...dayRoutine, tasks: updatedTasks },
      };
    });

    setActiveSubtaskTask((prev) => {
      if (!prev || prev.id !== taskId) return prev;
      return {
        ...prev,
        subtasks: prev.subtasks.filter((s) => s.id !== subtaskId),
      };
    });
  };

  // Save / Update Task for current selected day
  const handleSaveTask = (task: RoutineTask) => {
    setRoutines((prev) => {
      const dayRoutine = prev[selectedDay] || {
        dayOfWeek: selectedDay,
        tasks: [],
      };

      const existingIndex = dayRoutine.tasks.findIndex((t) => t.id === task.id);
      let newTasks: RoutineTask[];

      if (existingIndex >= 0) {
        newTasks = [...dayRoutine.tasks];
        newTasks[existingIndex] = task;
      } else {
        newTasks = [...dayRoutine.tasks, task];
      }

      newTasks.sort((a, b) => a.time.localeCompare(b.time));

      return {
        ...prev,
        [selectedDay]: {
          ...dayRoutine,
          tasks: newTasks,
          isCustomized: true,
        },
      };
    });

    soundManager.playSound('chime', settings.soundVolume);
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    if (!confirm('Deseja excluir esta tarefa deste dia?')) return;

    setRoutines((prev) => {
      const dayRoutine = prev[selectedDay];
      if (!dayRoutine) return prev;
      return {
        ...prev,
        [selectedDay]: {
          ...dayRoutine,
          tasks: dayRoutine.tasks.filter((t) => t.id !== taskId),
          isCustomized: true,
        },
      };
    });
  };

  // Copy Routine from one day to other days
  const handleCopyRoutine = (sourceDay: DayOfWeek, targetDays: DayOfWeek[]) => {
    setRoutines((prev) => {
      const sourceRoutine = prev[sourceDay];
      if (!sourceRoutine) return prev;

      const updated = { ...prev };
      targetDays.forEach((targetDay) => {
        const clonedTasks: RoutineTask[] = JSON.parse(
          JSON.stringify(sourceRoutine.tasks)
        ).map((t: RoutineTask) => ({
          ...t,
          completed: false,
          subtasks: t.subtasks.map((st) => ({ ...st, completed: false })),
        }));

        updated[targetDay] = {
          dayOfWeek: targetDay,
          tasks: clonedTasks,
          isCustomized: true,
        };
      });

      return updated;
    });

    soundManager.playSuccess(settings.soundVolume);
    if (settings.voiceEnabled) {
      soundManager.speak(
        `Rotina de ${DAY_NAMES[sourceDay].full} copiada com sucesso!`,
        settings.soundVolume
      );
    }
  };

  // Apply Clinical Routine Template (Toilet training, morning, bedtime, therapy)
  const handleApplyClinicalTemplate = (
    tasks: RoutineTask[],
    target: 'current-day' | 'weekdays' | 'all-week',
    mode: 'replace' | 'append'
  ) => {
    setRoutines((prev) => {
      const updated = { ...prev };
      const daysToUpdate: DayOfWeek[] =
        target === 'current-day'
          ? [selectedDay]
          : target === 'weekdays'
          ? [1, 2, 3, 4, 5]
          : [0, 1, 2, 3, 4, 5, 6];

      daysToUpdate.forEach((day) => {
        const existingTasks = updated[day]?.tasks || [];
        const clonedTemplateTasks: RoutineTask[] = JSON.parse(JSON.stringify(tasks)).map(
          (t: RoutineTask, idx: number) => ({
            ...t,
            id: `task-${day}-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
            completed: false,
            subtasks: t.subtasks.map((st, sIdx) => ({
              ...st,
              id: `st-${day}-${Date.now()}-${idx}-${sIdx}`,
              completed: false,
            })),
          })
        );

        const finalTasks =
          mode === 'replace' ? clonedTemplateTasks : [...existingTasks, ...clonedTemplateTasks];

        updated[day] = {
          dayOfWeek: day,
          tasks: finalTasks,
          isCustomized: true,
        };
      });

      return updated;
    });

    soundManager.playSound('marimba', settings.soundVolume);
  };

  // Import Routine from WhatsApp message or JSON file
  const handleImportRoutine = (
    importedData: {
      type: 'single' | 'all';
      tasks?: RoutineTask[];
      routines?: Record<DayOfWeek, DayRoutine>;
    },
    targetDay: DayOfWeek
  ) => {
    if (importedData.type === 'all' && importedData.routines) {
      setRoutines(importedData.routines);
      soundManager.playSound('marimba', settings.soundVolume);
      return;
    }

    if (importedData.tasks) {
      setRoutines((prev) => ({
        ...prev,
        [targetDay]: {
          dayOfWeek: targetDay,
          tasks: importedData.tasks!,
          isCustomized: true,
        },
      }));
      setSelectedDay(targetDay);
      soundManager.playSound('marimba', settings.soundVolume);
    }
  };

  // Handle Apply Incoming Routine (From WhatsApp 1-Click Magic Link)
  const handleApplyIncomingRoutine = (data: IncomingRoutineData) => {
    const performApply = () => {
      if (data.type === 'all_week' && data.routines) {
        handleImportRoutine({ type: 'all', routines: data.routines }, selectedDay);
      } else if (data.tasks) {
        const targetDay = data.dayOfWeek ?? selectedDay;
        handleImportRoutine({ type: 'single', tasks: data.tasks }, targetDay);
        setSelectedDay(targetDay);
      }

      // Clear hash from URL cleanly without reloading
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setIncomingRoutineData(null);
      soundManager.playSound('marimba', settings.soundVolume);
    };

    if (isEditLocked) {
      handleRequirePin(
        performApply,
        'Carregar Rotina Recebida',
        'Digite a senha dos pais para autorizar o carregamento da nova rotina no celular.'
      );
    } else {
      performApply();
    }
  };

  const handleCloseIncomingRoutine = () => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setIncomingRoutineData(null);
  };

  // Reset current day to default template
  const handleResetDayToDefault = () => {
    if (
      !confirm(
        `Deseja restaurar as tarefas padrão de ${DAY_NAMES[selectedDay].full}?`
      )
    ) {
      return;
    }

    const initial = getInitialRoutines();
    setRoutines((prev) => ({
      ...prev,
      [selectedDay]: initial[selectedDay],
    }));

    soundManager.playSound('chime', settings.soundVolume);
  };

  // Reset all to factory
  const handleResetAllToFactory = () => {
    const initial = getInitialRoutines();
    setRoutines(initial);
    setCompletions({ tasks: {}, subtasks: {} });
    saveDateCompletions(todayDateKey, { tasks: {}, subtasks: {} });
    soundManager.playSound('chime', settings.soundVolume);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex justify-center text-stone-800 dark:text-stone-100 antialiased transition-colors duration-200">
      {/* Centered Minimalist Application Shell */}
      <div
        className={`w-full max-w-lg bg-white dark:bg-stone-900 min-h-screen flex flex-col border-x border-stone-200/80 dark:border-stone-800 shadow-xs relative transition-colors duration-200 ${
          viewMode === 'board'
            ? 'ring-1 ring-indigo-200/50 dark:ring-indigo-900/40'
            : ''
        }`}
        id="app-shell"
      >
        {/* Minimalist Top App Bar with iOS Safe Area Inset Support */}
        <header className="header-safe-top px-3.5 pb-2.5 sm:px-4 sm:pb-3 border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs sticky top-0 z-30 flex flex-col gap-2.5 transition-colors">
          {/* Linha 1: Identidade da Marca (Esquerda) + Progresso de Tarefas (Direita) */}
          <div className="flex items-center justify-between gap-2">
            {/* Esquerda: Logo Oficial Synapsis Kids em Destaque */}
            <div className="flex items-center gap-2 min-w-0">
              <a href="/" className="inline-flex items-center gap-1.5 shrink-0 focus:outline-hidden" title="Synapsis Kids">
                {/* Logo para Modo Claro (Texto escuro) */}
                <img
                  src="/assets/synapsis_kids_light.png"
                  alt="Synapsis Kids"
                  className="h-10 sm:h-11 md:h-12 w-auto object-contain dark:hidden drop-shadow-xs"
                />
                {/* Logo para Modo Escuro (Texto branco) */}
                <img
                  src="/assets/synapsis_kids_dark.png"
                  alt="Synapsis Kids"
                  className="h-10 sm:h-11 md:h-12 w-auto object-contain hidden dark:block drop-shadow-xs"
                />

                {viewMode === 'board' && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800 shrink-0 self-center shadow-2xs">
                    TEA
                  </span>
                )}
              </a>
            </div>

            {/* Direita: "xx de xx tarefas feitas (x%)" */}
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-200 block">
                {completedDayTasks} de {totalDayTasks} feitas
              </span>
              <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60 inline-block mt-0.5">
                {dayProgressPercent}% concluído
              </span>
            </div>
          </div>

          {/* Linha 2: Botão Nova Tarefa + Botões de Utilidade (Tema, Som, Trava, Configurações) */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 dark:border-stone-800/60">
            {/* Botão Nova Tarefa em destaque */}
            <button
              type="button"
              id="header-new-task-btn"
              onClick={() =>
                handleRequirePin(
                  () => setIsNewTaskModalOpen(true),
                  'Criar Nova Tarefa',
                  'Digite a senha de 4 dígitos para adicionar uma nova tarefa à programação.'
                )
              }
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-xs"
              title={
                isEditLocked
                  ? 'Adicionar nova tarefa (requer senha dos pais)'
                  : 'Adicionar nova tarefa a este dia'
              }
            >
              {isEditLocked ? (
                <Lock className="w-3.5 h-3.5 opacity-80" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Nova Tarefa</span>
            </button>

            {/* Ações de Utilidade agrupadas à direita */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Quick theme toggle button */}
              <button
                type="button"
                id="quick-theme-toggle-btn"
                onClick={handleToggleTheme}
                className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                aria-label="Alternar tema claro/escuro"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-600" />
                )}
              </button>

              {/* Quick sound toggle */}
              <button
                type="button"
                onClick={() => {
                  const nextVol = settings.soundVolume > 0 ? 0 : 0.8;
                  setSettings((s) => ({ ...s, soundVolume: nextVol }));
                  if (nextVol > 0) soundManager.playSound('chime', 0.8);
                }}
                className={`p-2 rounded-xl transition-colors ${
                  settings.soundVolume > 0
                    ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                    : 'text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title={settings.soundVolume > 0 ? 'Som ativado' : 'Som desativado'}
              >
                {settings.soundVolume > 0 ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              {/* Parental Lock Status Button */}
              <button
                type="button"
                id="parent-lock-status-btn"
                onClick={handleToggleLockStatus}
                className={`p-2 rounded-xl flex items-center gap-1 transition-all ${
                  settings.childLockEnabled
                    ? isEditLocked
                      ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800'
                      : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title={
                  settings.childLockEnabled
                    ? isEditLocked
                      ? 'Edição Bloqueada por Senha (Toque para liberar)'
                      : 'Edição Liberada (Toque para bloquear para a criança)'
                    : 'Ativar Bloqueio de Edição com Senha nas Configurações'
                }
              >
                {settings.childLockEnabled ? (
                  isEditLocked ? (
                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Unlock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )
                ) : (
                  <Lock className="w-4 h-4 opacity-40" />
                )}
              </button>

              {/* Settings button */}
              <button
                type="button"
                id="open-settings-modal-btn"
                onClick={() =>
                  handleRequirePin(
                    () => setIsSettingsOpen(true),
                    'Configurações dos Pais',
                    'Digite a senha para acessar as configurações e gerenciar o bloqueio.'
                  )
                }
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Configurações de som e rotina"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Autism Spectrum / Neurodiversity Awareness Top Strip when in Large Cards mode */}
        {viewMode === 'board' && (
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-amber-400 via-rose-500 to-emerald-500 shrink-0 shadow-2xs" />
        )}

        {/* Reassuring Parental Lock status banner */}
        {settings.childLockEnabled && (
          <div
            className={`mx-4 mt-2 px-3 py-1.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
              isEditLocked
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-900/50 text-amber-800 dark:text-amber-300'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {isEditLocked ? (
                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              <span className="truncate">
                {isEditLocked
                  ? 'Modo Criança: Edição de horários e tarefas protegida por senha.'
                  : 'Modo Pais: Edição liberada. Toque em Bloquear quando terminar.'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleLockStatus}
              className="font-bold shrink-0 ml-2 text-xs underline hover:opacity-80"
            >
              {isEditLocked ? 'Desbloquear' : 'Bloquear Agora'}
            </button>
          </div>
        )}

        {/* Day Selector (Seg, Ter, Qua, Qui, Sex, Sáb, Dom) */}
        <DaySelector
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          todayDayOfWeek={todayDayOfWeek}
          taskStatsByDay={taskStatsByDay}
          onOpenExportModal={() =>
            handleRequirePin(
              () => setIsExportModalOpen(true),
              'Lembretes no Celular',
              'Digite a senha dos pais para sincronizar os alarmes com o Calendário.'
            )
          }
          onOpenClinicalTemplates={() =>
            handleRequirePin(
              () => setIsClinicalTemplatesOpen(true),
              'Modelos Clínicos de Rotina',
              'Digite a senha dos pais para carregar rotinas terapêuticas estruturadas.'
            )
          }
          onOpenShareModal={() =>
            handleRequirePin(
              () => setIsShareModalOpen(true),
              'Compartilhar / Importar Rotinas',
              'Digite a senha dos pais para exportar ou importar rotinas.'
            )
          }
          onOpenCopyModal={() =>
            handleRequirePin(
              () => setIsCopyModalOpen(true),
              'Copiar Programação',
              'Digite a senha dos pais para copiar tarefas para outros dias.'
            )
          }
          onResetDayToDefault={() =>
            handleRequirePin(
              () => handleResetDayToDefault(),
              'Restaurar Rotina do Dia',
              'Digite a senha dos pais para restaurar as tarefas padrão deste dia.'
            )
          }
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 space-y-3.5 pb-20">
          {/* Mode Switcher: 📋 Modo Agenda vs 🖼️ Cartões Grandes (PECS/CAA) - Só aparece se habilitado */}
          {settings.enableLargeCards !== false && (
            <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border border-stone-200/80 dark:border-stone-700/60 shadow-2xs">
              <button
                type="button"
                id="view-mode-list-btn"
                onClick={() => setViewMode('list')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>Agenda com Horários</span>
              </button>

              <button
                type="button"
                id="view-mode-board-btn"
                onClick={() => {
                  setViewMode('board');
                  soundManager.playSound('chime', 0.4);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'board'
                    ? 'bg-white dark:bg-stone-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Cartões Grandes (CAA)</span>
              </button>
            </div>
          )}

          {settings.enableLargeCards !== false && viewMode === 'board' ? (
            /* NON-VERBAL / PECS LARGE CARDS VIEW */
            <VisualBoardView
              tasks={currentDayTasks}
              onSelectTask={(task) => setFocusedLargeTask(task)}
              onToggleComplete={handleToggleTaskComplete}
              viewSubtype={boardSubtype}
              onSetSubtype={setBoardSubtype}
            />
          ) : (
            /* STANDARD SCHEDULE AGENDA VIEW */
            <>
              {/* Guide "Primeiro / Depois" (Compact & Minimalist) */}
              <FirstThenCard
                currentTask={currentFocusTask}
                nextTask={nextFocusTask}
                onOpenCurrentTask={() => {
                  if (currentFocusTask?.subtasks && currentFocusTask.subtasks.length > 0) {
                    setActiveSubtaskTask(currentFocusTask);
                  }
                }}
              />

              {/* Clean Time Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                <button
                  type="button"
                  onClick={() => setTimeFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    timeFilter === 'all'
                      ? 'bg-stone-900 dark:bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/80 hover:bg-stone-100 dark:hover:bg-stone-700/60'
                  }`}
                >
                  Todas ({currentDayTasks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter('morning')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    timeFilter === 'morning'
                      ? 'bg-stone-900 dark:bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/80 hover:bg-stone-100 dark:hover:bg-stone-700/60'
                  }`}
                >
                  Manhã
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter('afternoon')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    timeFilter === 'afternoon'
                      ? 'bg-stone-900 dark:bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/80 hover:bg-stone-100 dark:hover:bg-stone-700/60'
                  }`}
                >
                  Tarde
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFilter('night')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    timeFilter === 'night'
                      ? 'bg-stone-900 dark:bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/80 hover:bg-stone-100 dark:hover:bg-stone-700/60'
                  }`}
                >
                  Noite
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5" id="task-card-list">
                {displayedTasks.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-800">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-700/60 text-stone-500 dark:text-stone-400 mx-auto flex items-center justify-center mb-2">
                      <ListTodo className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-stone-700 dark:text-stone-200 text-sm">
                      Nenhuma tarefa neste período
                    </h3>
                    <p className="text-xs text-stone-400 dark:text-stone-400 mt-1 mb-3">
                      Adicione uma atividade para organizar a rotina deste dia.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleRequirePin(
                          () => setIsNewTaskModalOpen(true),
                          'Adicionar Tarefa',
                          'Digite a senha para adicionar uma nova tarefa.'
                        )
                      }
                      className="px-3.5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center gap-1 shadow-2xs"
                    >
                      {isEditLocked ? <Lock className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>Adicionar Tarefa</span>
                    </button>
                  </div>
                ) : (
                  displayedTasks.map((task) => {
                    const isNext = currentFocusTask?.id === task.id;
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        isNext={isNext}
                        onToggleComplete={handleToggleTaskComplete}
                        onOpenSubtasks={(t) => setActiveSubtaskTask(t)}
                        onOpenTimer={(t) => setActiveTimerTask(t)}
                        onEditTask={(t) =>
                          handleRequirePin(
                            () => setEditingTask(t),
                            'Editar Tarefa',
                            'Digite a senha dos pais para alterar as informações desta tarefa.'
                          )
                        }
                        onDeleteTask={(taskId) =>
                          handleRequirePin(
                            () => handleDeleteTask(taskId),
                            'Excluir Tarefa',
                            'Digite a senha dos pais para remover esta tarefa da rotina.'
                          )
                        }
                        isLocked={isEditLocked}
                        onRequestUnlock={() =>
                          handleRequirePin(
                            () => {},
                            'Desbloquear Edição',
                            'Digite a senha dos pais para liberar a edição das tarefas.'
                          )
                        }
                      />
                    );
                  })
                )}
              </div>

              {/* Bottom "+ Adicionar Tarefa" Action Bar (Always directly accessible) */}
              {displayedTasks.length > 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    id="bottom-new-task-btn"
                    onClick={() =>
                      handleRequirePin(
                        () => setIsNewTaskModalOpen(true),
                        'Criar Nova Tarefa',
                        'Digite a senha dos pais para adicionar uma tarefa a este dia.'
                      )
                    }
                    className="w-full py-3 px-4 bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {isEditLocked ? <Lock className="w-3.5 h-3.5 opacity-70" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>+ Adicionar Tarefa em {DAY_NAMES[selectedDay].full}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* MODALS */}
        {/* 1. Subtasks Modal (e.g. for "Tarefas da Casa") */}
        {activeSubtaskTask && (
          <SubtaskListModal
            task={activeSubtaskTask}
            isOpen={Boolean(activeSubtaskTask)}
            onClose={() => setActiveSubtaskTask(null)}
            onToggleSubtask={(subtaskId) =>
              handleToggleSubtask(activeSubtaskTask.id, subtaskId)
            }
            onCompleteAll={() => handleCompleteAllSubtasks(activeSubtaskTask.id)}
            onAddSubtask={(title) =>
              handleAddSubtaskToTask(activeSubtaskTask.id, title)
            }
            onUpdateSubtask={(subtaskId, newTitle) =>
              handleUpdateSubtaskTitle(activeSubtaskTask.id, subtaskId, newTitle)
            }
            onDeleteSubtask={(subtaskId) =>
              handleDeleteSubtaskFromTask(activeSubtaskTask.id, subtaskId)
            }
            onEditTaskDetails={(taskToEdit) =>
              handleRequirePin(
                () => setEditingTask(taskToEdit),
                'Editar Detalhes da Tarefa',
                'Digite a senha dos pais para modificar os detalhes desta tarefa.'
              )
            }
            isLocked={isEditLocked}
            onRequestUnlock={() =>
              handleRequirePin(
                () => {},
                'Desbloquear Passos',
                'Digite a senha dos pais para gerenciar os passos desta tarefa.'
              )
            }
          />
        )}

        {/* 2. Visual Timer Modal */}
        {activeTimerTask && (
          <VisualTimerModal
            task={activeTimerTask}
            isOpen={Boolean(activeTimerTask)}
            onClose={() => setActiveTimerTask(null)}
            onFinishTask={() => handleToggleTaskComplete(activeTimerTask.id)}
          />
        )}

        {/* 3. Edit / Create Task Modal */}
        {(editingTask || isNewTaskModalOpen) && (
          <EditTaskModal
            isOpen={Boolean(editingTask || isNewTaskModalOpen)}
            onClose={() => {
              setEditingTask(null);
              setIsNewTaskModalOpen(false);
            }}
            onSave={handleSaveTask}
            initialTask={editingTask}
            dayName={DAY_NAMES[selectedDay].full}
          />
        )}

        {/* 4. Copy / Duplicate Routine Modal */}
        {isCopyModalOpen && (
          <CopyRoutineModal
            isOpen={isCopyModalOpen}
            onClose={() => setIsCopyModalOpen(false)}
            sourceDay={selectedDay}
            onCopyRoutine={handleCopyRoutine}
          />
        )}

        {/* 5. Settings & Sound Modal */}
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onSaveSettings={(newSettings) => {
              setSettings(newSettings);
              if (!newSettings.childLockEnabled) {
                setIsParentUnlocked(true);
              }
            }}
            onResetAllToFactory={handleResetAllToFactory}
            onOpenExportCalendar={() => setIsExportModalOpen(true)}
          />
        )}

        {/* 6. Parent PIN Security Modal */}
        <ParentPinModal
          isOpen={isPinModalOpen}
          correctPin={settings.parentPin || '1234'}
          title={pinModalTitle}
          description={pinModalDescription}
          onSuccess={handlePinSuccess}
          onClose={() => {
            setIsPinModalOpen(false);
            setPendingActionAfterPin(null);
          }}
          onResetPinToDefault={() => {
            setSettings((s) => ({ ...s, parentPin: '1234' }));
          }}
        />

        {/* 7. Export Calendar & Alarms Modal (iOS & Android) */}
        {isExportModalOpen && (
          <ExportCalendarModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            selectedDay={selectedDay}
            routines={routines}
          />
        )}

        {/* 8. Large Card Focus Modal (PECS / CAA Fullscreen Focus) */}
        {focusedLargeTask && (
          <LargeCardFocusModal
            task={focusedLargeTask}
            isOpen={Boolean(focusedLargeTask)}
            onClose={() => setFocusedLargeTask(null)}
            onToggleComplete={(taskId) => {
              handleToggleTaskComplete(taskId);
              setFocusedLargeTask((prev) =>
                prev && prev.id === taskId ? { ...prev, completed: !prev.completed } : prev
              );
            }}
            onToggleSubtask={(taskId, subtaskId) => {
              handleToggleSubtask(taskId, subtaskId);
              setFocusedLargeTask((prev) => {
                if (!prev || prev.id !== taskId) return prev;
                return {
                  ...prev,
                  subtasks: prev.subtasks.map((st) =>
                    st.id === subtaskId ? { ...st, completed: !st.completed } : st
                  ),
                };
              });
            }}
            onOpenTimer={(task) => setActiveTimerTask(task)}
          />
        )}

        {/* 9. Clinical Routine Templates Modal */}
        {isClinicalTemplatesOpen && (
          <ClinicalTemplatesModal
            isOpen={isClinicalTemplatesOpen}
            onClose={() => setIsClinicalTemplatesOpen(false)}
            selectedDay={selectedDay}
            dayName={DAY_NAMES[selectedDay].full}
            onApplyTemplate={handleApplyClinicalTemplate}
          />
        )}

        {/* 10. Share & Import Routine Modal */}
        {isShareModalOpen && (
          <ShareRoutineModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            selectedDay={selectedDay}
            routines={routines}
            onImportRoutine={handleImportRoutine}
          />
        )}

        {/* 11. WhatsApp 1-Click Magic Link Incoming Routine Modal */}
        {incomingRoutineData && (
          <IncomingRoutineModal
            isOpen={Boolean(incomingRoutineData)}
            data={incomingRoutineData}
            onClose={handleCloseIncomingRoutine}
            onApply={handleApplyIncomingRoutine}
            isParentLocked={isEditLocked}
          />
        )}

        {/* Professional & Clinic Branding Footer (Synapsis Clínico & ARASAAC) */}
        <footer className="mt-auto px-4 pt-5 footer-safe-bottom border-t border-stone-200/80 dark:border-stone-800 text-center bg-stone-50/80 dark:bg-stone-900/60 space-y-2.5">
          <a
            href="https://synapsisclinico.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 p-2 px-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 shadow-2xs hover:border-teal-400 dark:hover:border-teal-500 transition-all group"
            title="Conhecer o ecossistema Synapsis Clínico"
          >
            <img
              src="/assets/synapsi_brain1.png"
              alt="Synapsis Clínico"
              className="w-5 h-5 object-contain"
            />
            <span className="text-xs font-black text-stone-800 dark:text-stone-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
              Synapsis Kids • Ecossistema Clínico
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800">
              Conhecer Plataforma
            </span>
          </a>

          <p className="text-[10px] text-stone-400 dark:text-stone-500 max-w-sm mx-auto leading-relaxed">
            Synapsis Kids • Rotina Visual & Apoio ao Neurodesenvolvimento Infantil • Comunicação Alternativa (CAA / ARASAAC)
          </p>
        </footer>
      </div>
    </div>
  );
}
