import LZString from 'lz-string';
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
interface CompactTaskLegacy {
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

// Version 3 Tuple Task:
// [title, time, icon, color, category, duration, endTime, soundAlert, voicePhrase, notes, img, subtasks]
type TupleTask = [
  string, // 0: title
  string, // 1: time
  string?, // 2: iconName
  string?, // 3: color
  string?, // 4: category
  number?, // 5: durationMinutes
  string?, // 6: endTime
  string?, // 7: soundAlert
  string?, // 8: voicePhrase
  string?, // 9: notes
  (string | number)?, // 10: img
  (string | [string, string?])[]? // 11: subtasks
];

interface CompactPayloadV3 {
  v: 3;
  p: 's' | 'w'; // 's' = single day, 'w' = all week
  d?: DayOfWeek;
  k?: TupleTask[]; // tasks for single day
  r?: Record<string, TupleTask[]>; // tasks for all week
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
  if (/^(https?:\/\/|\/assets\/)/i.test(str) && !/^(javascript|vbscript|data):/i.test(str)) {
    if (str.length <= 500) {
      return str;
    }
  }
  return undefined;
}

function sanitizeString(val: unknown, maxLen: number, fallback = ''): string {
  if (typeof val !== 'string') return fallback;
  return val.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, maxLen);
}

function sanitizeTime(val: unknown, fallback = '08:00'): string {
  if (typeof val === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(val.trim())) {
    return val.trim();
  }
  return fallback;
}

/**
 * Converts a RoutineTask to an ultra-compact array tuple.
 */
function taskToTuple(task: RoutineTask): TupleTask {
  const subtasksList = (task.subtasks || []).slice(0, 15).map((st) => {
    if (st.iconName && st.iconName !== 'Check') {
      return [sanitizeString(st.title, 80, 'Passo'), sanitizeString(st.iconName, 40)] as [string, string];
    }
    return sanitizeString(st.title, 80, 'Passo');
  });

  const tuple: TupleTask = [
    sanitizeString(task.title, 80, 'Atividade'),
    sanitizeTime(task.time, '08:00'),
    task.iconName !== 'Sparkles' ? sanitizeString(task.iconName, 40) : '',
    task.color !== 'indigo' ? sanitizeString(task.color, 20) : '',
    task.category && task.category !== 'other' ? sanitizeString(task.category, 30) : '',
    typeof task.durationMinutes === 'number' && !isNaN(task.durationMinutes)
      ? Math.min(Math.max(1, Math.round(task.durationMinutes)), 480)
      : ('' as unknown as number),
    task.endTime ? sanitizeTime(task.endTime) : '',
    task.soundAlert && task.soundAlert !== 'chime' ? sanitizeString(task.soundAlert, 30) : '',
    task.voicePhrase ? sanitizeString(task.voicePhrase, 180) : '',
    task.notes ? sanitizeString(task.notes, 300) : '',
    compressImageUrl(task.imageUrl) || '',
    subtasksList.length > 0 ? subtasksList : ([] as unknown as (string | [string, string?])[]),
  ];

  // Trim trailing empty items from tuple to save maximum characters
  while (
    tuple.length > 2 &&
    (tuple[tuple.length - 1] === '' ||
      tuple[tuple.length - 1] === undefined ||
      (Array.isArray(tuple[tuple.length - 1]) && (tuple[tuple.length - 1] as unknown[]).length === 0))
  ) {
    tuple.pop();
  }

  return tuple;
}

function tupleToTask(arr: unknown[], index: number): RoutineTask {
  const [title, time, icon, color, category, duration, endTime, sound, voice, notes, img, subtasks] = arr;

  const rawSubtasks = Array.isArray(subtasks) ? subtasks : [];
  const parsedSubtasks: SubTask[] = rawSubtasks.slice(0, 15).map((st, sIdx) => {
    if (Array.isArray(st)) {
      return {
        id: `sub-imported-${index}-${sIdx}-${Math.random().toString(36).substring(2, 6)}`,
        title: sanitizeString(st[0], 80, 'Passo'),
        completed: false,
        iconName: st[1] ? sanitizeString(st[1], 40) : undefined,
      };
    }
    return {
      id: `sub-imported-${index}-${sIdx}-${Math.random().toString(36).substring(2, 6)}`,
      title: sanitizeString(st, 80, 'Passo'),
      completed: false,
    };
  });

  return {
    id: `task-imported-${index + 1}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    title: sanitizeString(title, 80, 'Atividade'),
    time: sanitizeTime(time, '08:00'),
    endTime: endTime ? sanitizeTime(endTime) : undefined,
    iconName: icon ? sanitizeString(icon, 40, 'Sparkles') : 'Sparkles',
    color: (color as RoutineTask['color']) || 'indigo',
    category: (category as RoutineTask['category']) || 'other',
    completed: false,
    soundAlert: (sound as RoutineTask['soundAlert']) || 'chime',
    voicePhrase: voice ? sanitizeString(voice, 180) : undefined,
    durationMinutes:
      typeof duration === 'number' && !isNaN(duration) && duration > 0
        ? Math.min(Math.max(1, duration), 480)
        : undefined,
    notes: notes ? sanitizeString(notes, 300) : undefined,
    imageUrl: sanitizeImageUrl(img as string | number),
    subtasks: parsedSubtasks,
  };
}

function legacyCompactToTask(c: CompactTaskLegacy, index: number): RoutineTask {
  const subtasksList = Array.isArray(c.st) ? c.st.slice(0, 15) : [];
  return {
    id: `task-imported-${index + 1}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    title: sanitizeString(c.t, 80, 'Atividade'),
    time: sanitizeTime(c.h, '08:00'),
    endTime: c.e ? sanitizeTime(c.e) : undefined,
    iconName: sanitizeString(c.i, 40, 'Sparkles'),
    color: sanitizeString(c.c, 20, 'indigo') as RoutineTask['color'],
    category: (c.g as RoutineTask['category']) || 'other',
    completed: false,
    soundAlert: (c.s as RoutineTask['soundAlert']) || 'chime',
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
 * Encodes a routine into an ultra-compact LZString URL-safe string.
 */
export function encodeRoutine(payload: RoutinePayload): string {
  if (payload.type === 'single_day' && payload.tasks) {
    const compact: CompactPayloadV3 = {
      v: 3,
      p: 's',
      d: payload.dayOfWeek,
      k: payload.tasks.map(taskToTuple),
    };
    const jsonStr = JSON.stringify(compact);
    return LZString.compressToEncodedURIComponent(jsonStr);
  }

  if (payload.type === 'all_week' && payload.routines) {
    const rMap: Record<string, TupleTask[]> = {};
    for (const [dayKey, dayRoutine] of Object.entries(payload.routines)) {
      if (dayRoutine?.tasks) {
        rMap[dayKey] = dayRoutine.tasks.map(taskToTuple);
      }
    }
    const compact: CompactPayloadV3 = {
      v: 3,
      p: 'w',
      r: rMap,
    };
    const jsonStr = JSON.stringify(compact);
    return LZString.compressToEncodedURIComponent(jsonStr);
  }

  // Fallback
  const raw = JSON.stringify(payload);
  return LZString.compressToEncodedURIComponent(raw);
}

/**
 * Decodes a routine from string (supports Version 3 LZString, Version 2 compact base64, and Version 1 standard JSON).
 */
export function decodeRoutine(rawInput: string): RoutinePayload | null {
  if (!rawInput) return null;
  const clean = rawInput.trim();

  let parsedObj: any = null;

  // 1. Try modern Version 3 LZString decompression first
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(clean);
    if (decompressed) {
      parsedObj = JSON.parse(decompressed);
    }
  } catch {
    // continue
  }

  // 2. Fallback to raw JSON or Base64 (Version 1 & 2 legacy compatibility)
  if (!parsedObj) {
    try {
      parsedObj = JSON.parse(clean);
    } catch {
      try {
        const decodedStr = decodeURIComponent(escape(atob(clean)));
        parsedObj = JSON.parse(decodedStr);
      } catch {
        // continue
      }
    }
  }

  if (!parsedObj || typeof parsedObj !== 'object') {
    return null;
  }

  // Version 3 (Ultra-Compact Tuple format)
  if (parsedObj.v === 3) {
    if (parsedObj.p === 's' && Array.isArray(parsedObj.k)) {
      const dNum = Number(parsedObj.d);
      const dayOfWeek = (dNum >= 0 && dNum <= 6 ? dNum : 1) as DayOfWeek;
      const tasks = parsedObj.k.slice(0, 40).map((item: unknown[], idx: number) => tupleToTask(item, idx));
      return {
        app: 'SynapsisKids',
        version: '3.0',
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
          tasks: rawTasks.map((item: unknown[], idx: number) => tupleToTask(item, idx)),
          isCustomized: true,
        };
      }
      return {
        app: 'SynapsisKids',
        version: '3.0',
        type: 'all_week',
        routines,
      };
    }
  }

  // Version 2 (Legacy Compact Object format)
  if (parsedObj.v === 2) {
    if (parsedObj.p === 's' && Array.isArray(parsedObj.k)) {
      const dNum = Number(parsedObj.d);
      const dayOfWeek = (dNum >= 0 && dNum <= 6 ? dNum : 1) as DayOfWeek;
      const tasks = parsedObj.k
        .slice(0, 40)
        .map((item: CompactTaskLegacy, idx: number) => legacyCompactToTask(item, idx));
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
          tasks: rawTasks.map((item: CompactTaskLegacy, idx: number) => legacyCompactToTask(item, idx)),
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

  // Version 1 (Standard JSON payload)
  const sanitizeStandardTask = (t: any, idx: number): RoutineTask => {
    const subtasks = Array.isArray(t.subtasks) ? t.subtasks.slice(0, 15) : [];
    return {
      id: `task-imported-${idx + 1}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      title: sanitizeString(t.title, 80, 'Atividade'),
      time: sanitizeTime(t.time, '08:00'),
      endTime: t.endTime ? sanitizeTime(t.endTime) : undefined,
      iconName: sanitizeString(t.iconName, 40, 'Sparkles'),
      color: sanitizeString(t.color, 20, 'indigo') as RoutineTask['color'],
      category: (t.category as RoutineTask['category']) || 'other',
      completed: false,
      soundAlert: (t.soundAlert as RoutineTask['soundAlert']) || 'chime',
      voicePhrase: t.voicePhrase ? sanitizeString(t.voicePhrase, 180) : undefined,
      durationMinutes:
        typeof t.durationMinutes === 'number' && !isNaN(t.durationMinutes)
          ? Math.min(Math.max(1, t.durationMinutes), 480)
          : undefined,
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
}
