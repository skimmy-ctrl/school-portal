export const TEACHER_ROLES_KEY = 'teacherRoles';

export type TeacherRoleRecord = Record<string, { isClassTeacher?: boolean }>;

export function getTeacherRoles(): TeacherRoleRecord {
  try {
    const raw = localStorage.getItem(TEACHER_ROLES_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function setTeacherRole(emailOrId: string, data: { isClassTeacher?: boolean }) {
  const roles = getTeacherRoles();
  roles[emailOrId] = { ...(roles[emailOrId] || {}), ...data };
  localStorage.setItem(TEACHER_ROLES_KEY, JSON.stringify(roles));
}

export function isClassTeacher(emailOrId: string) {
  const roles = getTeacherRoles();
  return !!(roles[emailOrId] && roles[emailOrId].isClassTeacher);
}
