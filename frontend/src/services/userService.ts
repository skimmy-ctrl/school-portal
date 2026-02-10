import type { User } from '../types';

const USERS_KEY = 'appUsers_v1';

export type AppUser = User & { roleSpecific?: any };

function seed() {
  const users: AppUser[] = [
    {
      id: 'STU001',
      name: 'Alex Johnson',
      email: 'student@school.com',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      registrationNumber: 'STU-2024-001',
    },
    {
      id: 'TCH001',
      name: 'Dr. Sarah Smith',
      email: 'teacher@school.com',
      role: 'teacher',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      employeeId: 'TCH-2024-001',
    },
    {
      id: 'ADM001',
      name: 'Mark Wilson',
      email: 'admin@school.com',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark',
      employeeId: 'ADM-2024-001',
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return users;
}

export function getAllUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as AppUser[];
  } catch (e) {
    return seed();
  }
}

export function setAllUsers(users: AppUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUsersByRole(role: 'student' | 'teacher' | 'admin') {
  return getAllUsers().filter((u) => u.role === role);
}

export function addUser(user: AppUser) {
  const users = getAllUsers();
  users.push(user);
  setAllUsers(users);
}

export function deleteUserByEmail(email: string) {
  const users = getAllUsers().filter((u) => u.email !== email);
  setAllUsers(users);
}
