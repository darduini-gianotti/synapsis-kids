import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  X,
  Bell,
  Clock,
  Repeat,
  Download,
  CheckCircle2,
  Smartphone,
  Info,
} from 'lucide-react';
import { DayOfWeek, DayRoutine } from '../types';
import { DAY_NAMES } from '../utils/storage';
import { downloadCalendarIcs, CalendarExportOptions } from '../utils/calendarExport';
import { soundManager } from '../utils/audio';

interface ExportCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: DayOfWeek;
  routines: Record<DayOfWeek, DayRoutine>;
}

export const ExportCalendarModal: React.FC<ExportCalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDay,
  routines,
}) => {
  const [scope, setScope] = useState<'day' | 'week'>('week');
  const [alertAtStart, setAlertAtStart] = useState<boolean>(true);
  const [alert5MinBefore, setAlert5MinBefore] = useState<boolean>(true);
  const [recurringWeekly, setRecurringWeekly] = useState<boolean>(true);
  const [isExported, setIsExported] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentDayTasksCount = routines[selectedDay]?.tasks?.length || 0;
  const totalWeekTasksCount = (Object.values(routines) as DayRoutine[]).reduce(
    (acc: number, r: DayRoutine) => acc + (r.tasks?.length || 0),
    0
  );

  const handleExport = () => {
    const options: CalendarExportOptions = {
      scope,
      selectedDay,
      alertAtStart,
      alert5MinBefore,
      recurringWeekly,
    };

    downloadCalendarIcs(routines, options);
    soundManager.playSuccess(0.7);
    setIsExported(true);
    setTimeout(() => {
      setIsExported(false);
    }, 4000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 dark:bg-black/80 backdrop-blur-xs">
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="w-full max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-stone-200 dark:border-stone-800"
          id="export-calendar-modal"
        >
          {/* Header */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-tight">
                  Lembretes no Celular
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  Sincronização com Apple / Google
                </p>
              </div>
            </div>
            <button
              type="button"
              id="close-export-calendar-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto space-y-4">
            {/* Value Proposition Note */}
            <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
              <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Importe os horários para tocar <strong>com o celular bloqueado ou tela apagada</strong> no app nativo de Calendário e Lembretes do iPhone ou Android.
              </p>
            </div>

            {/* Scope Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                O que você deseja exportar?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScope('week')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    scope === 'week'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Semana Toda
                    </span>
                    <Repeat className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {totalWeekTasksCount} tarefas (Seg a Dom)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setScope('day')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    scope === 'day'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Apenas {DAY_NAMES[selectedDay].full}
                    </span>
                    <Clock className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {currentDayTasksCount} tarefas deste dia
                  </p>
                </button>
              </div>
            </div>

            {/* Alarm & Notification Options */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2.5">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                Configuração dos Alarmes
              </span>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={alertAtStart}
                  onChange={(e) => setAlertAtStart(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-stone-300 dark:border-stone-600"
                />
                <span>Alarme no horário exato de cada atividade</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={alert5MinBefore}
                  onChange={(e) => setAlert5MinBefore(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-stone-300 dark:border-stone-600"
                />
                <span>Aviso prévio 5 min antes (facilita a transição da criança)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700 dark:text-stone-300 pt-1 border-t border-stone-200 dark:border-stone-700/60">
                <input
                  type="checkbox"
                  checked={recurringWeekly}
                  onChange={(e) => setRecurringWeekly(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-stone-300 dark:border-stone-600"
                />
                <span>
                  {scope === 'week'
                    ? 'Repetir automaticamente toda semana (Seg a Dom)'
                    : `Repetir automaticamente toda ${DAY_NAMES[selectedDay].full}`}
                </span>
              </label>
            </div>

            {/* How to import instructions */}
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200 space-y-1.5">
              <div className="font-bold flex items-center gap-1 text-amber-800 dark:text-amber-300">
                <Info className="w-3.5 h-3.5" />
                Como adicionar ao celular:
              </div>
              <ul className="list-disc pl-4 space-y-1 text-stone-600 dark:text-stone-400">
                <li>
                  <strong>No iPhone (Safari):</strong> Ao baixar, toque na notificação de download do Safari e selecione <em>"Adicionar Todos"</em> no topo do Calendário da Apple.
                </li>
                <li>
                  <strong>No Android:</strong> Abra o arquivo baixado com o <em>Google Agenda</em> e confirme a sincronização.
                </li>
                <li>
                  <strong>Horário Fiel:</strong> Os alarmes tocam no minuto exato configurado na rotina, sincronizados com o relógio do seu celular.
                </li>
              </ul>
            </div>

            {/* Download Action Button */}
            <button
              type="button"
              id="confirm-calendar-export-btn"
              onClick={handleExport}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              {isExported ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Arquivo Gerado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar e Abrir no Calendário (.ics)</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
