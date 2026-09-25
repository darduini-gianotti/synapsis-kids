import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  Volume2,
  Plus,
  Trash2,
  Check,
  Play,
  ListChecks,
  Image as ImageIcon,
  Search,
  Mic,
  Square,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { RoutineTask, SoundAlert, TaskCategory, SubTask } from '../types';
import { TaskIcon, AVAILABLE_ICONS, COLOR_THEMES } from './TaskIcon';
import { soundManager } from '../utils/audio';
import { ArasaacPickerModal } from './ArasaacPickerModal';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: RoutineTask) => void;
  initialTask?: RoutineTask | null;
  dayName: string;
  isInspectorMode?: boolean;
  onToggleInspectorMode?: () => void;
}

const CATEGORIES: { id: TaskCategory; label: string }[] = [
  { id: 'chores', label: 'Tarefas da Casa' },
  { id: 'hygiene', label: 'Higiene' },
  { id: 'meals', label: 'Alimentação' },
  { id: 'school', label: 'Escola' },
  { id: 'play', label: 'Brincar / Lazer' },
  { id: 'sleep', label: 'Dormir / Noite' },
  { id: 'therapy', label: 'Terapia' },
  { id: 'exercise', label: 'Exercício' },
  { id: 'other', label: 'Outro' },
];

const SOUNDS: { id: SoundAlert; label: string }[] = [
  { id: 'bell', label: 'Sino Zen' },
  { id: 'chime', label: 'Campainha Suave' },
  { id: 'harp', label: 'Harpa Relaxante' },
  { id: 'marimba', label: 'Marimba Amigável' },
  { id: 'none', label: 'Sem Som' },
];

const QUICK_STEP_SUGGESTIONS = [
  'Guardar brinquedos',
  'Arrumar a cama',
  'Guardar o prato na pia',
  'Guardar os sapatos',
  'Escovar os dentes',
  'Lavar as mãos',
  'Organizar a mochila',
  'Tomar banho',
];

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  dayName,
  isInspectorMode,
  onToggleInspectorMode,
}) => {
  const isEditing = Boolean(initialTask);

  const [title, setTitle] = useState(initialTask?.title || '');
  const [time, setTime] = useState(initialTask?.time || '08:30');
  const [durationMinutes, setDurationMinutes] = useState<number>(initialTask?.durationMinutes || 20);
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category || 'chores');
  const [iconName, setIconName] = useState(initialTask?.iconName || 'CheckSquare');
  const [color, setColor] = useState(initialTask?.color || 'indigo');
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialTask?.imageUrl);
  const [isArasaacModalOpen, setIsArasaacModalOpen] = useState(false);
  const [soundAlert, setSoundAlert] = useState<SoundAlert>(initialTask?.soundAlert || 'bell');
  const [voicePhrase, setVoicePhrase] = useState(initialTask?.voicePhrase || '');
  const [notes, setNotes] = useState(initialTask?.notes || '');
  const [subtasks, setSubtasks] = useState<SubTask[]>(
    initialTask?.subtasks ? JSON.parse(JSON.stringify(initialTask.subtasks)) : []
  );
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  if (!isOpen) return null;

  const handleAddSubtask = (text?: string) => {
    const titleToAdd = (text || newSubtaskInput).trim();
    if (!titleToAdd) return;
    const newStep: SubTask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: titleToAdd,
      completed: false,
      iconName: 'Check',
    };
    setSubtasks((prev) => [...prev, newStep]);
    if (!text) setNewSubtaskInput('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const [audioRecording, setAudioRecording] = useState<string | undefined>(initialTask?.audioRecording);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [isPlayingRecording, setIsPlayingRecording] = useState<boolean>(false);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const timerIntervalRef = React.useRef<any>(null);

  const startRecording = async () => {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        alert('Seu navegador não possui suporte para gravar áudio.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mimeType = typeof MediaRecorder !== 'undefined'
        ? MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : ''
        : '';

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setAudioRecording(base64Audio);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingDuration(0);

      const interval = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 10) {
            stopRecording();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
      timerIntervalRef.current = interval;
    } catch {
      alert('Por favor, permita o acesso ao microfone nas permissões do navegador para gravar sua voz.');
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const playRecordedAudio = () => {
    if (!audioRecording) return;
    setIsPlayingRecording(true);
    soundManager.playRecording(audioRecording)
      .then(() => setIsPlayingRecording(false))
      .catch(() => setIsPlayingRecording(false));
  };

  const removeRecording = () => {
    setAudioRecording(undefined);
  };

  const handleTestSound = (sound: SoundAlert) => {
    soundManager.playSound(sound);
  };

  const handleTestVoice = () => {
    if (voicePhrase.trim()) {
      soundManager.speak(voicePhrase);
    } else {
      soundManager.speak(`Hora de: ${title || 'esta tarefa'}!`);
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const taskToSave: RoutineTask = {
      id: initialTask?.id || `task-${Date.now()}`,
      title: title.trim(),
      time,
      category,
      iconName,
      color,
      completed: initialTask?.completed || false,
      subtasks,
      soundAlert,
      voicePhrase: voicePhrase.trim() || undefined,
      audioRecording: audioRecording || undefined,
      durationMinutes: durationMinutes > 0 ? durationMinutes : undefined,
      notes: notes.trim() || undefined,
      imageUrl: imageUrl || undefined,
    };

    onSave(taskToSave);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col max-h-[92vh] overflow-hidden border border-stone-200 dark:border-stone-800"
          id="edit-task-modal"
        >
          {/* Header */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <TaskIcon name={iconName} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base leading-tight">
                  {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {dayName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {onToggleInspectorMode && (
                <button
                  type="button"
                  id="task-edit-toggle-inspector-btn"
                  onClick={onToggleInspectorMode}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    isInspectorMode
                      ? 'bg-teal-500 text-stone-950 font-black ring-2 ring-teal-400'
                      : 'text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50'
                  }`}
                  title={isInspectorMode ? 'Sair do Modo Ajuda' : 'Ativar Modo Inspetor (Explicar Botões)'}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Ajuda</span>
                </button>
              )}
              <button
                type="button"
                id="close-edit-task-modal-btn"
                onClick={onClose}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-sm overscroll-contain">
            {/* Title & Time */}
            <div className="space-y-3">
              <div data-help-id="task-edit-title">
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1">
                  Nome da Tarefa *
                </label>
                <input
                  type="text"
                  id="task-title-input"
                  placeholder="Ex: Tarefas da Casa, Lição, Escovar os Dentes..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div data-help-id="task-edit-time">
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Horário
                  </label>
                  <input
                    type="time"
                    id="task-time-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div data-help-id="task-edit-duration">
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1">
                    Duração estimada
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={240}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400">min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PASSOS DA TAREFA (Subtasks) - Highlighted and easy! */}
            <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl space-y-2.5" data-help-id="task-edit-subtasks">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                    Passos da Tarefa ({subtasks.length})
                  </label>
                </div>
                <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
                  Checklist passo a passo
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Divida atividades compostas como <em>Tarefas da Casa</em> em passos pequenos e visuais.
              </p>

              {/* Existing Subtasks List */}
              {subtasks.length > 0 && (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {subtasks.map((st, idx) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between gap-2 px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-2xs text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-stone-800 dark:text-stone-100 truncate">
                          {st.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(st.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors"
                        title="Remover passo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Subtask Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Novo passo (ex: Arrumar a cama)..."
                  value={newSubtaskInput}
                  onChange={(e) => setNewSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddSubtask()}
                  disabled={!newSubtaskInput.trim()}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40 flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="pt-1">
                <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-1">
                  Sugestões rápidas:
                </span>
                <div className="flex flex-wrap gap-1">
                  {QUICK_STEP_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleAddSubtask(sug)}
                      className="text-[11px] px-2 py-0.5 bg-white dark:bg-stone-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-stone-600 dark:text-stone-300 hover:text-indigo-700 dark:hover:text-indigo-300 border border-stone-200 dark:border-stone-700 rounded-md transition-colors"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ARASAAC Pictogram Selection Section (CAA) */}
            <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl space-y-2.5" data-help-id="task-edit-arasaac">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                    Desenho Terapêutico (ARASAAC / CAA)
                  </label>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Autismo & Fono
                </span>
              </div>

              {imageUrl ? (
                <div className="flex items-center justify-between gap-3 p-2.5 bg-white dark:bg-stone-800 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-white border border-stone-200 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={imageUrl}
                        alt="Pictograma selecionado"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block truncate">
                        Pictograma ARASAAC Ativo
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        Aparecerá nos cartões grandes e agenda
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsArasaacModalOpen(true)}
                      className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                    >
                      Trocar
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl(undefined)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                      title="Remover e voltar ao ícone vetorial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 bg-white/70 dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                  <p className="text-xs text-stone-500 dark:text-stone-400 pr-2">
                    Ilustrações oficiais para crianças não-verbais e pranchas visuais.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsArasaacModalOpen(true)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 shadow-2xs active:scale-95 transition-all"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Buscar ARASAAC</span>
                  </button>
                </div>
              )}
            </div>

            {/* Icon Picker */}
            <div data-help-id="task-edit-icon">
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                Ícone Visual Alternativo (Se não usar ARASAAC)
              </label>
              <div className="grid grid-cols-6 gap-1.5 max-h-32 overflow-y-auto p-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                {AVAILABLE_ICONS.map((ic) => (
                  <button
                    key={ic.name}
                    type="button"
                    onClick={() => setIconName(ic.name)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                      iconName === ic.name
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-600 border border-stone-200/60 dark:border-stone-600'
                    }`}
                    title={ic.label}
                  >
                    <TaskIcon name={ic.name} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div data-help-id="task-edit-category">
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                Categoria
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                      category === cat.id
                        ? 'bg-stone-800 dark:bg-indigo-600 text-white border-stone-800 dark:border-indigo-600'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div data-help-id="task-edit-color">
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                Cor Visual
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(COLOR_THEMES).map((cKey) => {
                  const themeObj = COLOR_THEMES[cKey];
                  const isSel = color === cKey;
                  return (
                    <button
                      key={cKey}
                      type="button"
                      onClick={() => setColor(cKey)}
                      className={`w-7 h-7 rounded-full ${themeObj.bg} flex items-center justify-center transition-transform ${
                        isSel ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      {isSel && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sound & Voice Reminders */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-3">
              <div data-help-id="task-edit-sound">
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                  Som de Lembrete
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {SOUNDS.map((snd) => (
                    <div
                      key={snd.id}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                        soundAlert === snd.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 font-semibold'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSoundAlert(snd.id)}
                        className="text-left flex-1"
                      >
                        {snd.label}
                      </button>
                      {snd.id !== 'none' && (
                        <button
                          type="button"
                          onClick={() => handleTestSound(snd.id)}
                          className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-stone-700"
                          title="Testar som"
                        >
                          <Play className="w-2.5 h-2.5 fill-indigo-600 dark:fill-indigo-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div data-help-id="task-edit-voice-phrase">
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Frase Falada (Opcional)</span>
                  <button
                    type="button"
                    onClick={handleTestVoice}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs flex items-center gap-1 font-medium"
                  >
                    <Volume2 className="w-3 h-3" />
                    Ouvir prévia
                  </button>
                </label>
                <input
                  type="text"
                  placeholder='Ex: "Hora das tarefas da casa! Vamos organizar tudo?"'
                  value={voicePhrase}
                  onChange={(e) => setVoicePhrase(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Gravação da Voz do Papai / Mamãe / Terapeuta (Voice Memo) */}
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl space-y-2" data-help-id="task-edit-voice-memo">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎙️</span>
                    <div>
                      <h5 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                        Voz do Papai / Mamãe / Terapeuta
                      </h5>
                      <p className="text-[10px] text-amber-800/80 dark:text-amber-400">
                        Grave sua voz real com afeto para a criança ouvir nesta atividade.
                      </p>
                    </div>
                  </div>
                </div>

                {audioRecording ? (
                  <div className="flex items-center justify-between bg-white dark:bg-stone-900 p-2.5 rounded-xl border border-amber-300/80 dark:border-amber-800 shadow-2xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={playRecordedAudio}
                        className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-all shadow-xs shrink-0"
                        title="Ouvir áudio gravado"
                      >
                        {isPlayingRecording ? (
                          <span className="w-2.5 h-2.5 bg-white rounded-xs animate-pulse" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-white" />
                        )}
                      </button>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1">
                          ✓ Voz gravada com sucesso!
                        </span>
                        <span className="text-[10px] text-stone-400 truncate">
                          Sua voz real substituirá o sintetizador nesta tarefa.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-[11px] font-semibold rounded-lg transition-colors"
                      >
                        Regravar
                      </button>
                      <button
                        type="button"
                        onClick={removeRecording}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                        title="Remover áudio gravado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : isRecording ? (
                  <div className="flex items-center justify-between bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-300 dark:border-rose-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                        Gravando sua voz... ({recordingDuration}s / 10s)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1"
                    >
                      <Square className="w-3 h-3 fill-white" />
                      <span>Concluir</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="w-full py-2 px-3 bg-white dark:bg-stone-900 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 border border-amber-300 dark:border-amber-700/80 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2 transition-all shadow-2xs group"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500 group-hover:scale-125 transition-transform" />
                    <span>Gravar Minha Voz para Esta Tarefa (até 10s)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              id="save-task-btn"
              data-help-id="task-edit-save"
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ARASAAC Pictogram Picker Modal */}
      {isArasaacModalOpen && (
        <ArasaacPickerModal
          isOpen={isArasaacModalOpen}
          onClose={() => setIsArasaacModalOpen(false)}
          onSelect={(selectedUrl) => {
            setImageUrl(selectedUrl);
          }}
          currentImageUrl={imageUrl}
          defaultSearchQuery={title || ''}
        />
      )}
    </AnimatePresence>
  );
};
