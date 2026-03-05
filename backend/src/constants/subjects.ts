export type SubjectClassLevelApi = "junior" | "senior";

export interface SubjectOption {
  name: string;
  code: string;
}

export const MAX_SUBJECTS = 11;

export const SUBJECTS_BY_CLASS_LEVEL: Record<SubjectClassLevelApi, SubjectOption[]> = {
  junior: [
    { name: "English", code: "ENG" },
    { name: "Mathematics", code: "MTH" },
    { name: "Cultural and Creative Art", code: "CCA" },
    { name: "History", code: "HIS" },
    { name: "Yoruba", code: "YOR" },
    { name: "Religious and National Value", code: "RNV" },
    { name: "PreVocational Studies", code: "PVS" },
    { name: "Basic Science and Technology", code: "BST" },
    { name: "Civic Education", code: "CVE" },
    { name: "Christian Religious Knowledge", code: "CRK" },
    { name: "Islamic Religious Knowledge", code: "IRK" },
  ],
  senior: [
    { name: "English", code: "ENG" },
    { name: "Mathematics", code: "MTH" },
    { name: "Yoruba", code: "YOR" },
    { name: "Christian Religious Knowledge", code: "CRK" },
    { name: "Citizenship and Heritage Study", code: "CHS" },
    { name: "Biology", code: "BIO" },
    { name: "Chemistry", code: "CHM" },
    { name: "Physics", code: "PHY" },
    { name: "Agricultural Science", code: "AGR" },
    { name: "Economics", code: "ECO" },
    { name: "Financial Accounting", code: "FAC" },
    { name: "Commerce", code: "COM" },
    { name: "Literature in English", code: "LIT" },
    { name: "Marketing", code: "MKT" },
    { name: "Government", code: "GOV" },
  ],
};

export const ALL_SUBJECT_OPTIONS: SubjectOption[] = Array.from(
  new Map(
    [...SUBJECTS_BY_CLASS_LEVEL.junior, ...SUBJECTS_BY_CLASS_LEVEL.senior].map((subject) => [
      subject.code,
      subject,
    ])
  ).values()
);

export const ALL_SUBJECT_CODES = new Set(ALL_SUBJECT_OPTIONS.map((subject) => subject.code));

export function normalizeClassLevel(value: string): SubjectClassLevelApi {
  return value.toLowerCase() === "senior" ? "senior" : "junior";
}

export function inferClassLevelFromText(raw: string | null | undefined): SubjectClassLevelApi {
  if (!raw) {
    return "junior";
  }

  const value = raw.toLowerCase();
  if (value.includes("senior") || value.includes("sss") || /\bss\d\b/.test(value)) {
    return "senior";
  }

  return "junior";
}
