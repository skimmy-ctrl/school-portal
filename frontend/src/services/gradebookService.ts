import { getStoredAccessToken } from './authService';

export interface GradebookSubject {
  code: string;
  name: string;
}

export interface GradebookStudent {
  id: string;
  name: string;
  email: string;
  enrollmentId: string;
}

export interface ScoreEntry {
  test1?: number;
  test2?: number;
  exam?: number;
  updatedAt?: string;
}

export const TEST_SCORE_MAX = 20;
export const EXAM_SCORE_MAX = 60;

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const SUBJECT_CATALOG: GradebookSubject[] = [
  { name: 'English', code: 'ENG' },
  { name: 'Mathematics', code: 'MTH' },
  { name: 'Biology', code: 'BIO' },
  { name: 'Chemistry', code: 'CHM' },
  { name: 'Physics', code: 'PHY' },
  { name: 'Economics', code: 'ECO' },
  { name: 'Government', code: 'GOV' },
  { name: 'Literature in English', code: 'LIT' },
];

const FALLBACK_SUBJECT_CODES = ['MTH', 'ENG', 'BIO', 'CHM'];

const FALLBACK_STUDENTS: GradebookStudent[] = [
  {
    id: 'stu-001',
    name: 'Alex Johnson',
    email: 'alex.johnson@school.com',
    enrollmentId: 'STU-001',
  },
  {
    id: 'stu-002',
    name: 'Sarah Williams',
    email: 'sarah.williams@school.com',
    enrollmentId: 'STU-002',
  },
  {
    id: 'stu-003',
    name: 'Michael Brown',
    email: 'michael.brown@school.com',
    enrollmentId: 'STU-003',
  },
  {
    id: 'stu-004',
    name: 'Emma Davis',
    email: 'emma.davis@school.com',
    enrollmentId: 'STU-004',
  },
  {
    id: 'stu-005',
    name: 'David Patel',
    email: 'david.patel@school.com',
    enrollmentId: 'STU-005',
  },
  {
    id: 'stu-006',
    name: 'Nora Okafor',
    email: 'nora.okafor@school.com',
    enrollmentId: 'STU-006',
  },
];

const FALLBACK_ROSTERS: Record<string, GradebookStudent[]> = {
  ENG: FALLBACK_STUDENTS.slice(0, 4),
  MTH: FALLBACK_STUDENTS.slice(1, 6),
  BIO: FALLBACK_STUDENTS.slice(0, 5),
  CHM: FALLBACK_STUDENTS.slice(2, 6),
  PHY: FALLBACK_STUDENTS.slice(0, 3),
  ECO: FALLBACK_STUDENTS.slice(3, 6),
  GOV: FALLBACK_STUDENTS.slice(0, 4),
  LIT: FALLBACK_STUDENTS.slice(1, 5),
};

function teacherSubjectsKey(teacherEmail?: string) {
  return `teacher_assigned_subjects:${teacherEmail || 'default'}`;
}

function subjectScoreKey(subjectCode: string) {
  return `gradebook_scores:${subjectCode}`;
}

export function listSubjectCatalog() {
  return [...SUBJECT_CATALOG];
}

export function getTeacherAssignedSubjects(teacherEmail?: string): GradebookSubject[] {
  const raw = localStorage.getItem(teacherSubjectsKey(teacherEmail));
  let subjectCodes: string[] | null = null;

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        subjectCodes = parsed;
      }
    } catch {
      subjectCodes = null;
    }
  }

  const codes = subjectCodes ?? FALLBACK_SUBJECT_CODES;
  const catalog = new Map(SUBJECT_CATALOG.map((subject) => [subject.code, subject.name]));

  return codes.map((code) => ({
    code,
    name: catalog.get(code) || code,
  }));
}

function authHeaders() {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchTeacherAssignedSubjects(): Promise<GradebookSubject[]> {
  const response = await fetch(`${API_BASE}/api/teachers/me/subjects`, {
    method: 'GET',
    credentials: 'include',
    headers: authHeaders(),
  });

  const payload = (await response.json()) as ApiResponse<{ subjects: GradebookSubject[] }>;
  if (!response.ok) {
    throw new Error(payload?.message || 'Failed to load subjects');
  }

  return payload.data.subjects ?? [];
}

export function setTeacherAssignedSubjects(teacherEmail: string, subjectCodes: string[]) {
  localStorage.setItem(teacherSubjectsKey(teacherEmail), JSON.stringify(subjectCodes));
}

export function getSubjectRoster(subjectCode: string): GradebookStudent[] {
  const roster = FALLBACK_ROSTERS[subjectCode];
  if (roster) return roster;
  return FALLBACK_STUDENTS.slice(0, 4);
}

export async function fetchSubjectGradebook(subjectCode: string): Promise<{
  students: GradebookStudent[];
  scores: Record<string, ScoreEntry>;
}> {
  const response = await fetch(`${API_BASE}/api/teachers/me/subjects/${encodeURIComponent(subjectCode)}/students`, {
    method: 'GET',
    credentials: 'include',
    headers: authHeaders(),
  });

  const payload = (await response.json()) as ApiResponse<{
    students: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      score?: {
        test1?: number | null;
        test2?: number | null;
        exam?: number | null;
        updatedAt?: string;
      } | null;
    }>;
  }>;

  if (!response.ok) {
    throw new Error(payload?.message || 'Failed to load students');
  }

  const students = (payload.data.students ?? []).map((student) => ({
    id: student.id,
    name: `${student.firstName} ${student.lastName}`.trim(),
    email: student.email,
    enrollmentId: student.id,
  }));

  const scores = (payload.data.students ?? []).reduce<Record<string, ScoreEntry>>((acc, student) => {
    if (student.score) {
      acc[student.id] = {
        test1: student.score.test1 ?? undefined,
        test2: student.score.test2 ?? undefined,
        exam: student.score.exam ?? undefined,
        updatedAt: student.score.updatedAt,
      };
    }
    return acc;
  }, {});

  return { students, scores };
}

export async function saveSubjectScore(
  subjectCode: string,
  studentId: string,
  scoreUpdate: ScoreEntry
) {
  const response = await fetch(
    `${API_BASE}/api/teachers/me/subjects/${encodeURIComponent(subjectCode)}/students/${encodeURIComponent(studentId)}/score`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: authHeaders(),
      body: JSON.stringify({
        test1: scoreUpdate.test1 ?? null,
        test2: scoreUpdate.test2 ?? null,
        exam: scoreUpdate.exam ?? null,
      }),
    }
  );

  const payload = (await response.json()) as ApiResponse<{
    score: { test1: number | null; test2: number | null; exam: number | null; updatedAt?: string };
  }>;

  if (!response.ok) {
    throw new Error(payload?.message || 'Failed to save score');
  }

  return {
    test1: payload.data.score.test1 ?? undefined,
    test2: payload.data.score.test2 ?? undefined,
    exam: payload.data.score.exam ?? undefined,
    updatedAt: payload.data.score.updatedAt,
  } satisfies ScoreEntry;
}

export async function fetchMySubjectScores(): Promise<Record<string, ScoreEntry>> {
  try {
    const response = await fetch(`${API_BASE}/api/students/me/scores`, {
      method: 'GET',
      credentials: 'include',
      headers: authHeaders(),
    });

    const payload = (await response.json()) as ApiResponse<{
      scores: Array<{
        subjectCode: string;
        test1: number | null;
        test2: number | null;
        exam: number | null;
        updatedAt?: string;
      }>;
    }>;

    if (!response.ok) {
      throw new Error(payload?.message || 'Failed to load scores');
    }

    return (payload.data.scores ?? []).reduce<Record<string, ScoreEntry>>((acc, score) => {
      acc[score.subjectCode] = {
        test1: score.test1 ?? undefined,
        test2: score.test2 ?? undefined,
        exam: score.exam ?? undefined,
        updatedAt: score.updatedAt,
      };
      return acc;
    }, {});
  } catch {
    return {};
  }
}

export function getSubjectScores(subjectCode: string): Record<string, ScoreEntry> {
  const raw = localStorage.getItem(subjectScoreKey(subjectCode));
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, ScoreEntry>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function getStudentScore(subjectCode: string, studentEmail: string): ScoreEntry | null {
  const scores = getSubjectScores(subjectCode);
  return scores[studentEmail] ?? null;
}

export function setSubjectScore(
  subjectCode: string,
  studentEmail: string,
  scoreUpdate: ScoreEntry
): ScoreEntry {
  const currentScores = getSubjectScores(subjectCode);
  const existing = currentScores[studentEmail] || {};
  const next = {
    ...existing,
    ...scoreUpdate,
    updatedAt: new Date().toISOString(),
  };

  currentScores[studentEmail] = next;
  localStorage.setItem(subjectScoreKey(subjectCode), JSON.stringify(currentScores));
  return next;
}

export function computeTotal(score?: ScoreEntry | null): number | null {
  if (!score) return null;
  const hasAny = score.test1 != null || score.test2 != null || score.exam != null;
  if (!hasAny) return null;

  return (score.test1 ?? 0) + (score.test2 ?? 0) + (score.exam ?? 0);
}

export function computeGrade(total?: number | null): string | null {
  if (total == null) return null;
  if (total >= 70) return 'A';
  if (total >= 60) return 'B';
  if (total >= 50) return 'C';
  if (total >= 45) return 'D';
  if (total >= 40) return 'E';
  return 'F';
}

export function clampScore(value: number, max: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), max);
}
