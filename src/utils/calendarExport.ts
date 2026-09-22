import { RoutineTask, DayOfWeek, DayRoutine } from '../types';
import { DAY_NAMES } from './storage';

export interface CalendarExportOptions {
  scope: 'day' | 'week';
  selectedDay: DayOfWeek;
  alertAtStart: boolean;
  alert5MinBefore: boolean;
  recurringWeekly: boolean;
}

const ICS_DAY_CODES: Record<DayOfWeek, string> = {
  0: 'SU',
  1: 'MO',
  2: 'TU',
  3: 'WE',
  4: 'TH',
  5: 'FR',
  6: 'SA',
};

/**
 * Formats a Date object as YYYYMMDDTHHMMSS (local floating time for reliable device scheduling)
 */
function formatIcsDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Escapes text according to RFC 5545 specifications
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Calculates the next calendar Date instance for a given day of the week (0=Dom, 1=Seg, ...)
 */
function getNextDateForDayOfWeek(targetDay: DayOfWeek): Date {
  const now = new Date();
  const currentDay = now.getDay();
  let daysDiff = targetDay - currentDay;
  if (daysDiff < 0) {
    daysDiff += 7;
  }
  const result = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysDiff);
  return result;
}

/**
 * Builds the content of an RFC 5545 .ics file from the application's routines
 */
export function generateIcsContent(
  routines: Record<DayOfWeek, DayRoutine>,
  options: CalendarExportOptions
): string {
  const { scope, selectedDay, alertAtStart, alert5MinBefore, recurringWeekly } = options;

  const daysToExport: DayOfWeek[] =
    scope === 'day' ? [selectedDay] : [1, 2, 3, 4, 5, 6, 0];

  const calendarLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Rotina Visual//Rotina Infantil TEA//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Rotina Visual',
  ];

  const nowStamp = formatIcsDateTime(new Date());

  daysToExport.forEach((dayOfWeek) => {
    const routine = routines[dayOfWeek];
    if (!routine || !routine.tasks || routine.tasks.length === 0) return;

    const baseDate = getNextDateForDayOfWeek(dayOfWeek);
    const dayCode = ICS_DAY_CODES[dayOfWeek];

    routine.tasks.forEach((task: RoutineTask) => {
      const [hoursStr, minutesStr] = task.time.split(':');
      const startHour = parseInt(hoursStr, 10) || 8;
      const startMin = parseInt(minutesStr, 10) || 0;

      const startDate = new Date(baseDate);
      startDate.setHours(startHour, startMin, 0, 0);

      const durationMinutes = task.durationMinutes || 20;
      const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

      const dtStart = formatIcsDateTime(startDate);
      const dtEnd = formatIcsDateTime(endDate);
      const uid = `rotina-${dayOfWeek}-${task.id}-${task.time.replace(':', '')}@rotinavisual.app`;

      let descriptionText = `Atividade da Rotina Visual: ${task.title}`;
      if (task.subtasks && task.subtasks.length > 0) {
        descriptionText += `\\n\\nPassos a concluir:`;
        task.subtasks.forEach((st, idx) => {
          descriptionText += `\\n${idx + 1}. ${st.title}`;
        });
      }
      if (task.notes) {
        descriptionText += `\\n\\nObservação: ${task.notes}`;
      }

      calendarLines.push('BEGIN:VEVENT');
      calendarLines.push(`UID:${uid}`);
      calendarLines.push(`DTSTAMP:${nowStamp}`);
      calendarLines.push(`DTSTART:${dtStart}`);
      calendarLines.push(`DTEND:${dtEnd}`);
      calendarLines.push(`SUMMARY:${escapeIcsText(task.title)}`);
      calendarLines.push(`DESCRIPTION:${descriptionText}`);

      // If weekly recurring is enabled
      if (recurringWeekly) {
        calendarLines.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayCode}`);
      }

      // Alarms
      if (alertAtStart) {
        calendarLines.push('BEGIN:VALARM');
        calendarLines.push('ACTION:DISPLAY');
        calendarLines.push(`DESCRIPTION:Hora de: ${escapeIcsText(task.title)}`);
        calendarLines.push('TRIGGER:-PT0M');
        calendarLines.push('END:VALARM');
      }

      if (alert5MinBefore) {
        calendarLines.push('BEGIN:VALARM');
        calendarLines.push('ACTION:DISPLAY');
        calendarLines.push(`DESCRIPTION:Em 5 minutos: ${escapeIcsText(task.title)}`);
        calendarLines.push('TRIGGER:-PT5M');
        calendarLines.push('END:VALARM');
      }

      calendarLines.push('END:VEVENT');
    });
  });

  calendarLines.push('END:VCALENDAR');
  return calendarLines.join('\r\n');
}

/**
 * Generates and triggers download/opening of the .ics calendar file
 */
export function downloadCalendarIcs(
  routines: Record<DayOfWeek, DayRoutine>,
  options: CalendarExportOptions
): void {
  const icsString = generateIcsContent(routines, options);
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const fileName =
    options.scope === 'day'
      ? `rotina-${DAY_NAMES[options.selectedDay].short.toLowerCase()}.ics`
      : `rotina-semana-completa.ics`;

  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
