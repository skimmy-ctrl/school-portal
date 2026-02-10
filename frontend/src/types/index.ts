// User Types
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  fullName?: string | null;
  title?: string | null;
  phone?: string | null;
  address?: string | null;
  registrationNumber?: string; // For students
  employeeId?: string; // For teachers/admins
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, role: UserRole) => Promise<User>;
  updateProfile: (data: { displayName?: string; fullName?: string; title?: string; phone?: string; address?: string; avatarFile?: File | null }) => Promise<User>;
  logout: () => Promise<void>;
}

// Student Types
export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  description: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  submissionStatus: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

export interface Grade {
  id: string;
  courseId: string;
  courseName: string;
  midterm: number;
  finals: number;
  assignments: number;
  gpa: number;
}

export interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  courseId: string;
  courseName: string;
  instructor: string;
  location: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'low' | 'normal' | 'high';
  audience: UserRole[];
}

// Teacher Types
export interface StudentClass {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  schedule: string;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  assignmentTitle: string;
  submittedAt: string;
  status: 'pending' | 'graded';
  grade?: number;
  feedback?: string;
}

// Admin Types
export interface ClassInfo {
  id: string;
  name: string;
  code: string;
  instructor: string;
  studentCount: number;
  createdAt: string;
}

export interface Statistics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeUsers: number;
  announcements: number;
}
