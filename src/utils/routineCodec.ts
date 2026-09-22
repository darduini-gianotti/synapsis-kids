import { DayOfWeek, DayRoutine, RoutineTask, SubTask } from '../types';
import { DAY_NAMES } from './storage';

export interface RoutinePayload {
  app?: string;
  version?: string;
  type: 'single_day' | 'all_week';
  dayOfWeek?: DayOfWeek;
  dayName?: string;
  tasks?: RoutineTask[];
  routines?: Record<DayOfWeek, DayRoutine>;
}

/**
 * Super-compact representation for short, URL-friendly WhatsApp links.
 */
interface CompactTask {
  t: string; // title
  h: string; // time (hora)
  e?: string; // endTime
  i: string; // iconName
  c: string; // color
  g?: string; // category
  s?: string; // soundAlert
  v?: string; // voicePhrase
  m?: number; // durationMinutes
  n?: string; // notes
  img?: string | number; // Arasaac ID or custom image URL
  st?: { t: string; i?: string }[]; // subtasks
}

interface CompactPayload {
  v: number; // version
  p: 's' | 'w'; // 's' = single day, 'w' = all week
  d?: DayOfWeek; // day of week
  k?: CompactTask[]; // tasks for single day
  r?: Record<string, CompactTask[]>; // tasks for all week
}

/**
 * Helper to compress image URLs, especially standard ARASAAC URLs
 */
function compressImageUrl(url?: string): string | number | undefined {
  if (!url) return undefined;
  const match = url.match(/static\.arasaac\.org\/pictograms\/(\d+)\//);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return sanitizeImageUrl(url);
}

/**
 * Helper to validate and restore safe image URLs.
 * Rejects javascript:, data:, vbscript:, and malicious schemes.
 */
function sanitizeImageUrl(img?: string | number): string | undefined {
  if (!img) return undefined;
  if (typeof img === 'number' || /^\d+$/.test(String(img))) {
    const numId = parseInt(String(img), 10);
    if (!isNaN(numId) && numId > 0 && numId < 1000000) {
      return `https://static.arasaac.org/pictograms/${numId}/${numId}_300.png`;
    }
  }
  const str = String(img).trim();
  // Safe protocols: https://, http://, or relative /assets/
  if (/^(https?:\/\/|\/assets\/)/i.test(str) && !/^(javascript|vbscript|data):/i.test(str)) {
    // Basic URL length sanity
    if (str.length <= 500) {
      return str;
    }
  }
  return undefined;
}

function sanitizeString(val: any, maxLen: number, fallback = ''): string {
  if (typeof val !== 'string') return fallback;
  // Remove control characters (except newline) and truncate
  return val.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, maxLen);
}

function sanitizeTime(val: any, fallback = '08:00'): string {
  if (typeof val === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(val.trim())) {
    return val.trim();
  }
  return fallback;
}

function taskToCompact(task: RoutineTask): CompactTask {
  const item: CompactTask = {
    t: sanitizeString(task.title, 80, 'Atividade'),
    h: sanitizeTime(task.time, '08:00'),
    i: sanitizeString(task.iconName, 40, 'Sparkles'),
    c: sanitizeString(task.color, 20, 'indigo'),
  };
  if (task.endTime) item.e = sanitizeTime(task.endTime);
  if (task.category && task.category !== 'other') item.g = sanitizeString(task.category, 30);
  if (task.soundAlert && task.soundAlert !== 'chime') item.s = sanitizeString(task.soundAlert, 30);
  if (task.voicePhrase) item.v = sanitizeString(task.voicePhrase, 180);
  if (typeof task.durationMinutes === 'number' && !isNaN(task.durationMinutes)) {
    item.m = Math.min(Math.max(1, Math.round(task.durationMinutes)), 480);
  }
  if (task.notes) item.n = sanitizeString(task.notes, 300);
  const compressedImg = compressImageUrl(task.imageUrl);
  if (compressedImg) item.img = compressedImg;
  if (task.subtasks && task.subtasks.length > 0) {
    item.st = task.subtasks.slice(0, 15).map((st) => ({
      t: sanitizeString(st.title, 80, 'Passo'),
      ...(st.iconName ? { i: sanitizeString(st.iconName, 40) } : {}),
    }));
  }
  return item;
}

function compactToTask(c: CompactTask, index: number): RoutineTask {
  const subtasksList = Array.isArray(c.st) ? c.st.slice(0, 15) : [];
  return {
    id: `task-imported-${index + 1}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    title: sanitizeString(c.t, 80, 'Atividade'),
    time: sanitizeTime(c.h, '08:00'),
    endTime: c.e ? sanitizeTime(c.e) : undefined,
    iconName: sanitizeString(c.i, 40, 'Sparkles'),
    color: sanitizeString(c.c, 20, 'indigo'),
    category: (c.g as any) || 'other',
    completed: false,
    soundAlert: (c.s as any) || 'chime',
    voicePhrase: c.v ? sanitizeString(c.v, 180) : undefined,
    durationMinutes: typeof c.m === 'number' && !isNaN(c.m) ? Math.min(Math.max(1, c.m), 480) : undefined,
    notes: c.n ? sanitizeString(c.n, 300) : undefined,
    imageUrl: sanitizeImageUrl(c.img),
    subtasks: subtasksList.map((st, sIdx) => ({
      id: `sub-imported-${index}-${sIdx}-${Math.random().toString(36).substring(2, 6)}`,
      title: sanitizeString(st.t, 80, 'Passo'),
      completed: false,
      iconName: st.i ? sanitizeString(st.i, 40) : undefined,
    })),
  };
}

/**
 * Encodes a routine into a compact Base64 URL-safe string.
 */
export function encodeRoutine(payload: RoutinePayload): string {
  if (payload.type === 'single_day' && payload.tasks) {
    const compact: CompactPayload = {
      v: 2,
      p: 's',
      d: payload.dayOfWeek,
      k: payload.tasks.map(taskToCompact),
    };
    const jsonStr = JSON.stringify(compact);
    return btoa(unescape(encodeURIComponent(jsonStr)));
  }

  if (payload.type === 'all_week' && payload.routines) {
    const rMap: Record<string, CompactTask[]> = {};
    for (const [dayKey, dayRoutine] of Object.entries(payload.routines)) {
      if (dayRoutine?.tasks) {
        rMap[dayKey] = dayRoutine.tasks.map(taskToCompact);
      }
    }
    const compact: CompactPayload = {
      v: 2,
      p: 'w',
      r: rMap,
    };
    const jsonStr = JSON.stringify(compact);
    return btoa(unescape(encodeURIComponent(jsonStr)));
  }

  // Fallback to standard JSON
  const raw = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(raw)));
}

/**
 * Decodes a routine from string (supports compact format, standard JSON, and base64).
 */
export function decodeRoutine(rawInput: string): RoutinePayload | null {
  try {
    let clean = rawInput.trim();

    // Check if it's base64 or JSON
    let parsedObj: any = null;
    try {
      parsedObj = JSON.parse(clean);
    } catch {
      const decodedStr = decodeURIComponent(escape(atob(clean)));
      parsedObj = JSON.parse(decodedStr);
    }

    if (!parsedObj || typeof parsedObj !== 'object') {
      return null;
    }

    // Version 2 (Compact format)
    if (parsedObj.v === 2) {
      if (parsedObj.p === 's' && Array.isArray(parsedObj.k)) {
        const dNum = Number(parsedObj.d);
        const dayOfWeek = (dNum >= 0 && dNum <= 6 ? dNum : 1) as DayOfWeek;
        const tasks = parsedObj.k.slice(0, 40).map((item: CompactTask, idx: number) => compactToTask(item, idx));
        return {
          app: 'SynapsisKids',
          version: '2.0',
          type: 'single_day',
          dayOfWeek,
          dayName: DAY_NAMES[dayOfWeek]?.full || 'Dia',
          tasks,
        };
      }

      if (parsedObj.p === 'w' && parsedObj.r) {
        const routines: Record<DayOfWeek, DayRoutine> = {} as any;
        for (let d = 0; d <= 6; d++) {
          const dKey = d as DayOfWeek;
          const rawTasks = Array.isArray(parsedObj.r[String(d)]) ? parsedObj.r[String(d)].slice(0, 40) : [];
          routines[dKey] = {
            dayOfWeek: dKey,
            tasks: rawTasks.map((item: CompactTask, idx: number) => compactToTask(item, idx)),
            isCustomized: true,
          };
        }
        return {
          app: 'SynapsisKids',
          version: '2.0',
          type: 'all_week',
          routines,
        };
      }
    }

    // Helper for legacy/standard JSON tasks
    const sanitizeStandardTask = (t: any, idx: number): RoutineTask => {
      const subtasks = Array.isArray(t.subtasks) ? t.subtasks.slice(0, 15) : [];
      return {
        id: `task-imported-${idx + 1}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        title: sanitizeString(t.title, 80, 'Atividade'),
        time: sanitizeTime(t.time, '08:00'),
        endTime: t.endTime ? sanitizeTime(t.endTime) : undefined,
        iconName: sanitizeString(t.iconName, 40, 'Sparkles'),
        color: sanitizeString(t.color, 20, 'indigo'),
        category: (t.category as any) || 'other',
        completed: false,
        soundAlert: (t.soundAlert as any) || 'chime',
        voicePhrase: t.voicePhrase ? sanitizeString(t.voicePhrase, 180) : undefined,
        durationMinutes: typeof t.durationMinutes === 'number' && !isNaN(t.durationMinutes) ? Math.min(Math.max(1, t.durationMinutes), 480) : undefined,
        notes: t.notes ? sanitizeString(t.notes, 300) : undefined,
        imageUrl: sanitizeImageUrl(t.imageUrl),
        subtasks: subtasks.map((st: any, sIdx: number) => ({
          id: `sub-imported-${idx}-${sIdx}-${Math.random().toString(36).substring(2, 6)}`,
          title: sanitizeString(st.title, 80, 'Passo'),
          completed: false,
          iconName: st.iconName ? sanitizeString(st.iconName, 40) : undefined,
        })),
      };
    };

    // Version 1 (Standard JSON payload)
    if (parsedObj.type === 'single_day' || Array.isArray(parsedObj.tasks)) {
      const dNum = Number(parsedObj.dayOfWeek);
      const dayOfWeek = (dNum >= 0 && dNum <= 6 ? dNum : 1) as DayOfWeek;
      const rawTasks = Array.isArray(parsedObj.tasks) ? parsedObj.tasks.slice(0, 40) : [];
      return {
        app: 'SynapsisKids',
        version: '1.0',
        type: 'single_day',
        dayOfWeek,
        dayName: DAY_NAMES[dayOfWeek]?.full || 'Dia',
        tasks: rawTasks.map(sanitizeStandardTask),
      };
    }

    if (parsedObj.type === 'all_week' || parsedObj.routines) {
      const routines: Record<DayOfWeek, DayRoutine> = {} as any;
      for (let d = 0; d <= 6; d++) {
        const dKey = d as DayOfWeek;
        const rawRoutine = parsedObj.routines?.[dKey] || parsedObj.routines?.[String(d)];
        const rawTasks = Array.isArray(rawRoutine?.tasks) ? rawRoutine.tasks.slice(0, 40) : [];
        routines[dKey] = {
          dayOfWeek: dKey,
          tasks: rawTasks.map(sanitizeStandardTask),
          isCustomized: true,
        };
      }
      return {
        app: 'SynapsisKids',
        version: '1.0',
        type: 'all_week',
        routines,
      };
    }

    return null;
  } catch (err) {
    console.error('Falha ao decodificar rotina:', err);
    return null;
  }
}
