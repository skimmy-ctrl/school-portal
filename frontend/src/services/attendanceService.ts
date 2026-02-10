export const ATTENDANCE_KEY = 'attendanceRecords';

export interface AttendanceRecord {
  present: number;
  total: number;
}

export type AttendanceMap = Record<string, AttendanceRecord>; // keyed by student email

export function getAttendanceMap(): AttendanceMap {
  try {
    const raw = localStorage.getItem(ATTENDANCE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function setAttendanceMap(map: AttendanceMap) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(map));
}

export function markAttendanceBatch(entries: { email: string; present: boolean }[]) {
  const map = getAttendanceMap();
  entries.forEach(({ email, present }) => {
    const cur = map[email] || { present: 0, total: 0 };
    cur.total = (cur.total || 0) + 1;
    if (present) cur.present = (cur.present || 0) + 1;
    map[email] = cur;
  });
  setAttendanceMap(map);
}

export function getAttendancePercent(email: string): number | null {
  const map = getAttendanceMap();
  const rec = map[email];
  if (!rec || rec.total === 0) return null;
  return Math.round((rec.present / rec.total) * 100);
}
