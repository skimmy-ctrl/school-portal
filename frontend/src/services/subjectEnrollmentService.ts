import { getStoredAccessToken, getStoredUser } from './authService';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export type SubjectClassLevel = 'junior' | 'senior';

export interface SubjectOption {
  name: string;
  code: string;
}

export interface SubjectEnrollment {
  classLevel: SubjectClassLevel;
  className: 'JSS1' | 'JSS2' | 'JSS3' | 'SSS1' | 'SSS2' | 'SSS3';
  subjectCodes: string[];
  maxSubjects: number;
  availableSubjects: SubjectOption[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const MAX_SUBJECTS = 11;
const FALLBACK_SUBJECTS_BY_CLASS_LEVEL: Record<SubjectClassLevel, SubjectOption[]> = {
  junior: [
    { name: 'English', code: 'ENG' },
    { name: 'Mathematics', code: 'MTH' },
    { name: 'Cultural and Creative Art', code: 'CCA' },
    { name: 'History', code: 'HIS' },
    { name: 'Yoruba', code: 'YOR' },
    { name: 'Religious and National Value', code: 'RNV' },
    { name: 'PreVocational Studies', code: 'PVS' },
    { name: 'Basic Science and Technology', code: 'BST' },
    { name: 'Civic Education', code: 'CVE' },
    { name: 'Christian Religious Knowledge', code: 'CRK' },
    { name: 'Islamic Religious Knowledge', code: 'IRK' },
  ],
  senior: [
    { name: 'English', code: 'ENG' },
    { name: 'Mathematics', code: 'MTH' },
    { name: 'Yoruba', code: 'YOR' },
    { name: 'Christian Religious Knowledge', code: 'CRK' },
    { name: 'Citizenship and Heritage Study', code: 'CHS' },
    { name: 'Biology', code: 'BIO' },
    { name: 'Chemistry', code: 'CHM' },
    { name: 'Physics', code: 'PHY' },
    { name: 'Agricultural Science', code: 'AGR' },
    { name: 'Economics', code: 'ECO' },
    { name: 'Financial Accounting', code: 'FAC' },
    { name: 'Commerce', code: 'COM' },
    { name: 'Literature in English', code: 'LIT' },
    { name: 'Marketing', code: 'MKT' },
    { name: 'Government', code: 'GOV' },
  ],
};

function fallbackStorageKey(classLevel: SubjectClassLevel) {
  const user = getStoredUser();
  const userKey = user?.id ?? user?.email ?? 'guest';
  return `subject_enrollment_fallback:${String(userKey)}:${classLevel}`;
}

function readFallbackCodes(classLevel: SubjectClassLevel) {
  const raw = localStorage.getItem(fallbackStorageKey(classLevel));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFallbackCodes(classLevel: SubjectClassLevel, subjectCodes: string[]) {
  localStorage.setItem(fallbackStorageKey(classLevel), JSON.stringify(subjectCodes));
}

export function getFallbackSubjectEnrollment(classLevel: SubjectClassLevel): SubjectEnrollment {
  const className = classLevel === 'junior' ? 'JSS1' : 'SSS1';
  return {
    classLevel,
    className,
    subjectCodes: readFallbackCodes(classLevel),
    maxSubjects: MAX_SUBJECTS,
    availableSubjects: FALLBACK_SUBJECTS_BY_CLASS_LEVEL[classLevel],
  };
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

export async function fetchMySubjectEnrollment(classLevel?: SubjectClassLevel) {
  const requestedLevel = classLevel ?? 'junior';
  const query = classLevel ? `?classLevel=${classLevel}` : '';
  const response = await fetch(`${API_BASE}/api/students/me/enrollment${query}`, {
    method: 'GET',
    credentials: 'include',
    headers: authHeaders(),
  });

  const payload = (await response.json()) as ApiResponse<{ enrollment: SubjectEnrollment }>;
  if (!response.ok) {
    if (payload?.message?.toLowerCase().includes('student not found')) {
      return getFallbackSubjectEnrollment(requestedLevel);
    }
    throw new Error(payload?.message || 'Failed to load enrollment');
  }

  return payload.data.enrollment;
}

export async function saveMySubjectEnrollment(data: {
  classLevel: SubjectClassLevel;
  subjectCodes: string[];
}) {
  const response = await fetch(`${API_BASE}/api/students/me/enrollment`, {
    method: 'PUT',
    credentials: 'include',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  const payload = (await response.json()) as ApiResponse<{ enrollment: SubjectEnrollment }>;
  if (!response.ok) {
    if (payload?.message?.toLowerCase().includes('student not found')) {
      writeFallbackCodes(data.classLevel, data.subjectCodes);
      return getFallbackSubjectEnrollment(data.classLevel);
    }
    throw new Error(payload?.message || 'Failed to save enrollment');
  }

  return payload.data.enrollment;
}
