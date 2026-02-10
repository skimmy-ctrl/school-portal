import { getStoredAccessToken } from './authService';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export interface ApiStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gradeLevel?: string | null;
  isActive: boolean;
  createdAt: string;
  class?: { id: string; name: string; gradeLevel?: string | null } | null;
  user?: { id: number; email: string } | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchStudents(): Promise<ApiStudent[]> {
  const token = getStoredAccessToken();
  const response = await fetch(`${API_BASE}/api/students`, {
    method: 'GET',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const payload = (await response.json()) as ApiResponse<{ students: ApiStudent[] }>;
  if (!response.ok) {
    throw new Error(payload?.message || 'Failed to load students');
  }

  return payload.data.students;
}
