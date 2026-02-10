import { getStoredAccessToken } from './authService';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminUser {
  id: number;
  email: string;
  displayName?: string | null;
  fullName?: string | null;
  title?: string | null;
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

export async function fetchUsersByRole(role: 'student' | 'teacher' | 'admin') {
  const token = getStoredAccessToken();
  const response = await fetch(`${API_BASE}/api/admin/users?role=${role}`, {
    method: 'GET',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const payload = (await response.json()) as ApiResponse<{ users: AdminUser[] }>;
  if (!response.ok) {
    throw new Error(payload?.message || 'Failed to load users');
  }

  return payload.data.users;
}

export async function deleteUserById(userId: number) {
  const token = getStoredAccessToken();
  const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const payload = (await response.json()) as ApiResponse<{ deleted: boolean }>;
  if (!response.ok) {
    throw new Error(payload?.message || 'Failed to delete user');
  }

  return payload.data.deleted;
}

export async function assignTeacherByEmail(email: string) {
  const token = getStoredAccessToken();
  const response = await fetch(`${API_BASE}/api/admin/users/assign-teacher`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ email }),
  });

  const payload = (await response.json()) as ApiResponse<{ user: AdminUser }>;
  if (!response.ok) {
    throw new Error(payload?.message || 'Failed to assign teacher role');
  }

  return payload.data.user;
}
