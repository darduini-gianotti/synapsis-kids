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

export interface TimeZoneInfo {
  timeZone: string;
  offsetString: string;
  tzName: string;
}

/**
 * Detects the user device's IANA time zone (e.g. America/Sao_Paulo) and standard UTC offset
 */
export function getDeviceTimeZoneInfo(): TimeZoneInfo {
  let timeZone = 'America/Sao_Paulo';
  let tzName = 'BRT';

  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected) timeZone = detected;
  } catch {
    // fallback
  }

  // Offset in minutes between local and UTC
  const offsetMinutes = -new Date().getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absMin = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absMin / 60)).padStart(2, '0');
  const mins = String(absMin % 60).padStart(2, '0');
  const offsetString = `${sign}${hours}${mins}`;

  try {
    const parts = new Intl.DateTimeFormat('pt-BR', { timeZoneName: 'short' }).formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    if (tzPart && tzPart.value) {
      tzName = tzPart.value.replace(/[^A-Za-z0-9]/g, '') || 'BRT';
    }
  } catch {
    // fallback
  }

  return { timeZone, offsetString, tzName };
}

/**
 * Formats a Date object as local YYYYMMDDTHHMMSS
 */
function formatIcsLocal(date: Date): string {
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
 * Formats a Date object as UTC YYYYMMDDTHHMMSSZ (RFC 5545 required for DTSTAMP)
 */
function formatIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
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
 * Splits lines longer than 74 octets using RFC 5545 line folding (\r\n followed by a space)
 * Prevents Apple Calendar on iOS from dropping events with long descriptions/subtasks.
 */
function foldIcsLine(line: string, maxBytes = 74): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= maxBytes) {
    return line;
  }

  const parts: string[] = [];
  let currentPart = '';
  let currentBytes = 0;

  for (const char of line) {
    const charBytes = encoder.encode(char).length;
    // Continuation lines start with a single whitespace character
    const limit = parts.length === 0 ? maxBytes : maxBytes - 1;

    if (currentBytes + charBytes > limit) {
      parts.push(currentPart);
      currentPart = char;
      currentBytes = charBytes;
    } else {
      currentPart += char;
      currentBytes += charBytes;
    }
  }

  if (currentPart.length > 0) {
    parts.push(currentPart);
  }

  return parts.join('\r\n ');
}

/**
 * Calculates the calendar Date instance for a given day of the week, anchored
 * to the current calendar week (Monday through Sunday).
 */
function getCalendarDateForDayOfWeek(targetDay: DayOfWeek, isRecurring: boolean): Date {
  const now = new Date();
  const currentDay = now.getDay(); // 0=Dom, 1=Seg, 2=Ter...
  const currentDayIndex = currentDay === 0 ? 6 : currentDay - 1;
  const targetDayIndex = targetDay === 0 ? 6 : targetDay - 1;
  let diffDays = targetDayIndex - currentDayIndex;

  // If non-recurring and target day already passed in current week, move to upcoming week
  if (!isRecurring && diffDays < 0) {
    diffDays += 7;
  }

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffDays);
}

/**
 * Builds the content of an RFC 5545 .ics file with native VTIMEZONE and line folding
 */
export function generateIcsContent(
  routines: Record<DayOfWeek, DayRoutine>,
  options: CalendarExportOptions
): string {
  const { scope, selectedDay, alertAtStart, alert5MinBefore, recurringWeekly } = options;
  const { timeZone, offsetString, tzName } = getDeviceTimeZoneInfo();

  const daysToExport: DayOfWeek[] =
    scope === 'day' ? [selectedDay] : [1, 2, 3, 4, 5, 6, 0];

  const nowUtcStamp = formatIcsUtc(new Date());

  const calendarLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Synapsis Kids//Rotina Visual Infantil//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Rotina Visual • Synapsis Kids',
    `X-WR-TIMEZONE:${timeZone}`,
    'BEGIN:VTIMEZONE',
    `TZID:${timeZone}`,
    `X-LIC-LOCATION:${timeZone}`,
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    `TZOFFSETFROM:${offsetString}`,
    `TZOFFSETTO:${offsetString}`,
    `TZNAME:${tzName}`,
    'END:STANDARD',
    'END:VTIMEZONE',
  ];

  daysToExport.forEach((dayOfWeek) => {
    const routine = routines[dayOfWeek];
    if (!routine || !routine.tasks || routine.tasks.length === 0) return;

    const baseDate = getCalendarDateForDayOfWeek(dayOfWeek, recurringWeekly);
    const dayCode = ICS_DAY_CODES[dayOfWeek];

    routine.tasks.forEach((task: RoutineTask) => {
      const [hoursStr, minutesStr] = task.time.split(':');
      const startHour = parseInt(hoursStr, 10) || 8;
      const startMin = parseInt(minutesStr, 10) || 0;

      const startDate = new Date(baseDate);
      startDate.setHours(startHour, startMin, 0, 0);

      const durationMinutes = task.durationMinutes || 20;
      const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

      const dtStart = formatIcsLocal(startDate);
      const dtEnd = formatIcsLocal(endDate);
      const uid = `synapsis-${dayOfWeek}-${task.id}-${task.time.replace(':', '')}@synapsisclinico.com.br`;

      let description = `Atividade da Rotina Visual: ${task.title}`;
      if (task.subtasks && task.subtasks.length > 0) {
        description += '\n\nPassos a concluir:';
        task.subtasks.forEach((st, idx) => {
          description += `\n${idx + 1}. ${st.title}`;
        });
      }
      if (task.notes) {
        description += `\n\nObservação: ${task.notes}`;
      }

      calendarLines.push('BEGIN:VEVENT');
      calendarLines.push(`UID:${uid}`);
      calendarLines.push(`DTSTAMP:${nowUtcStamp}`);
      calendarLines.push(`DTSTART;TZID=${timeZone}:${dtStart}`);
      calendarLines.push(`DTEND;TZID=${timeZone}:${dtEnd}`);
      calendarLines.push(`SUMMARY:${escapeIcsText(task.title)}`);
      calendarLines.push(`DESCRIPTION:${escapeIcsText(description)}`);

      // Weekly recurring rule
      if (recurringWeekly) {
        calendarLines.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayCode}`);
      }

      // Alarms (Reminders)
      if (alertAtStart) {
        calendarLines.push('BEGIN:VALARM');
        calendarLines.push('ACTION:DISPLAY');
        calendarLines.push(`DESCRIPTION:Hora de: ${escapeIcsText(task.title)}`);
        calendarLines.push('TRIGGER:PT0S');
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

  // Enforce strict RFC 5545 line folding (<= 75 octets) across all lines
  return calendarLines.map((line) => foldIcsLine(line)).join('\r\n');
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
