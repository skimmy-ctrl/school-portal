export const STANDARD_CLASSES = [
  "JSS1",
  "JSS2",
  "JSS3",
  "SSS1",
  "SSS2",
  "SSS3",
] as const;

export type StandardClassName = (typeof STANDARD_CLASSES)[number];

export const DEFAULT_STUDENT_CLASS: StandardClassName = "JSS1";

export function normalizeClassName(value: string): string {
  return value.trim().toUpperCase();
}

export function isStandardClassName(value: string): value is StandardClassName {
  return (STANDARD_CLASSES as readonly string[]).includes(normalizeClassName(value));
}

export function isJuniorClassName(value: string): boolean {
  const normalized = normalizeClassName(value);
  return normalized.startsWith("JSS");
}

export function classNameToGradeLevel(className: string): "junior" | "senior" {
  return isJuniorClassName(className) ? "junior" : "senior";
}
