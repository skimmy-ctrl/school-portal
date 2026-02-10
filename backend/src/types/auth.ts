export type RoleName = "admin" | "teacher" | "student";

export type AuthJwtPayload = {
  userId: number;
};

export type AuthRequestUser = {
  userId: number;
  role: RoleName;
};
