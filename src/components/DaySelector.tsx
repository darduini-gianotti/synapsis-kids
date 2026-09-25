import React from 'react';
import { Calendar, Copy, RotateCcw, Bell, Sparkles, Share2 } from 'lucide-react';
import { DayOfWeek } from '../types';
import { DAY_NAMES } from '../utils/storage';

interface DaySelectorProps {
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  todayDayOfWeek: DayOfWeek;
  taskStatsByDay: Record<DayOfWeek, { total: number; completed: number }>;
  onOpenCopyModal: () => void;
  onResetDayToDefault?: () => void;
  onOpenExportModal?: () => void;
  onOpenClinicalTemplates?: () => void;
  onOpenShareModal?: () => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDay,
  onSelectDay,
  todayDayOfWeek,
  taskStatsByDay,
  onOpenCopyModal,
  onResetDayToDefault,
  onOpenExportModal,
  onOpenClinicalTemplates,
  onOpenShareModal,
}) => {
  const days: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0]; // Seg -> Dom

  return (
    <div className="w-full bg-white dark:bg-stone-900 border-b border-stone-200/80 dark:border-stone-800 px-4 py-2.5 space-y-2" id="day-selector-bar">
      {/* Top row: Current day name + Primary clinical/share actions */}
      <div className="flex items-center justify-between gap-1 flex-wrap">
        <div className="flex items-center gap-1.5 min-w-0">
          <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <h2 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 tracking-tight truncate">
            {DAY_NAMES[selectedDay].full}
            {selectedDay === todayDayOfWeek && (
              <span className="ml-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Hoje
              </span>
            )}
          </h2>
        </div>

        {/* Action buttons toolbar */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {onOpenClinicalTemplates && (
            <button
              type="button"
              id="open-clinical-templates-btn"
              data-help-id="clinical-templates"
              onClick={onOpenClinicalTemplates}
              className="px-2 py-1 text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300/80 dark:border-amber-800 rounded-lg flex items-center gap-1 transition-all shadow-2xs"
              title="Carregar modelos clínicos (Desfralde, Rotina Matinal, Terapia, Sono)"
            >
              <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Modelos</span>
            </button>
          )}

          {onOpenShareModal && (
            <button
              type="button"
              id="open-share-routine-btn"
              data-help-id="share-routine"
              onClick={onOpenShareModal}
              className="px-2 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center gap-1 transition-all shadow-2xs"
              title="Compartilhar rotina via WhatsApp ou importar do consultório"
            >
              <Share2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span>Enviar / Importar</span>
            </button>
          )}

          {onOpenExportModal && (
            <button
              type="button"
              id="open-export-calendar-btn"
              data-help-id="calendar-export"
              onClick={onOpenExportModal}
              className="p-1.5 text-stone-500 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              title="Sincronizar alarmes no Calendário do Celular (iOS/Android)"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            id="open-copy-routine-modal-btn"
            data-help-id="copy-routine"
            onClick={onOpenCopyModal}
            className="p-1.5 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            title="Copiar rotina deste dia para outros dias"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {onResetDayToDefault && (
            <button
              type="button"
              onClick={onResetDayToDefault}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              title="Restaurar tarefas padrão deste dia"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Weekday Pills row */}
      <div className="grid grid-cols-7 gap-1.5" data-help-id="day-selector">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = todayDayOfWeek === day;
          const stats = taskStatsByDay[day] || { total: 0, completed: 0 };
          const isAllDone = stats.total > 0 && stats.completed === stats.total;

          return (
            <button
              key={day}
              type="button"
              id={`day-tab-${day}`}
              onClick={() => onSelectDay(day)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all select-none ${
                isSelected
                  ? 'bg-stone-900 text-white dark:bg-indigo-600 dark:text-white font-bold shadow-2xs'
                  : isToday
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 font-semibold'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/80 font-medium'
              }`}
            >
              <span className="text-xs uppercase tracking-tight">
                {DAY_NAMES[day].short}
              </span>

              {/* Progress mini indicator */}
              {stats.total > 0 && (
                <span
                  className={`text-[10px] mt-0.5 ${
                    isSelected
                      ? 'text-stone-300 dark:text-indigo-200'
                      : isAllDone
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-stone-400 dark:text-stone-500'
                  }`}
                >
                  {isAllDone ? '✓' : `${stats.completed}/${stats.total}`}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
