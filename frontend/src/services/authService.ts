import type { User, UserRole } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

interface ApiUser {
  id: number;
  email: string;
  role: UserRole;
  displayName?: string | null;
  fullName?: string | null;
  title?: string | null;
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthPayload {
  accessToken: string;
  user: ApiUser;
}

function displayNameFromEmail(email: string) {
  const localPart = email.split('@')[0] || 'User';
  return localPart
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildUser(apiUser: ApiUser): User {
  const displayName = apiUser.displayName || displayNameFromEmail(apiUser.email);
  const avatarUrl = apiUser.avatarUrl
    ? apiUser.avatarUrl.startsWith('http')
      ? apiUser.avatarUrl
      : `${API_BASE}${apiUser.avatarUrl}`
    : undefined;
  return {
    id: apiUser.id,
    email: apiUser.email,
    role: apiUser.role,
    name: displayName,
    fullName: apiUser.fullName ?? null,
    title: apiUser.title ?? null,
    phone: apiUser.phone ?? null,
    address: apiUser.address ?? null,
    avatar:
      avatarUrl ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        apiUser.email
      )}`,
  };
}

function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setStoredUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  withAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (withAuth) {
    const token = getStoredAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    const message = payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload as T;
}

export async function login(email: string, password: string) {
  const payload = await request<ApiResponse<AuthPayload>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setAccessToken(payload.data.accessToken);
  const user = buildUser(payload.data.user);
  setStoredUser(user);
  return user;
}

export async function register(
  email: string,
  password: string,
  role: UserRole
) {
  const payload = await request<ApiResponse<AuthPayload>>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  });

  setAccessToken(payload.data.accessToken);
  const user = buildUser(payload.data.user);
  setStoredUser(user);
  return user;
}

export async function refreshAccessToken() {
  const payload = await request<ApiResponse<AuthPayload>>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({}),
  });

  setAccessToken(payload.data.accessToken);
  const user = buildUser(payload.data.user);
  setStoredUser(user);
  return user;
}

export async function fetchMe() {
  const payload = await request<ApiResponse<{ user: ApiUser }>>('/api/auth/me', {
    method: 'GET',
  }, true);

  const user = buildUser(payload.data.user);
  setStoredUser(user);
  return user;
}

export async function logout() {
  await request<ApiResponse<{ loggedOut: boolean }>>('/api/auth/logout', {
    method: 'POST',
    body: JSON.stringify({}),
  });

  clearAccessToken();
  clearStoredUser();
}

export function clearAuthStorage() {
  clearAccessToken();
  clearStoredUser();
}

export async function updateProfile(data: {
  displayName?: string;
  fullName?: string;
  title?: string;
  phone?: string;
  address?: string;
  avatarFile?: File | null;
}) {
  const formData = new FormData();
  if (data.displayName) {
    formData.append('displayName', data.displayName);
  }
  if (data.fullName) {
    formData.append('fullName', data.fullName);
  }
  if (data.title) {
    formData.append('title', data.title);
  }
  if (data.phone) {
    formData.append('phone', data.phone);
  }
  if (data.address) {
    formData.append('address', data.address);
  }
  if (data.avatarFile) {
    formData.append('avatar', data.avatarFile);
  }

  const token = getStoredAccessToken();
  const response = await fetch(`${API_BASE}/api/users/me`, {
    method: 'PATCH',
    body: formData,
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const payload = (await response.json()) as ApiResponse<{ user: ApiUser }>;
  if (!response.ok) {
    throw new Error(payload?.message || 'Profile update failed');
  }

  const user = buildUser(payload.data.user);
  setStoredUser(user);
  return user;
}
