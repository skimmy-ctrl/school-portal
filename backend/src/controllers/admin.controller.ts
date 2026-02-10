import type { Request, Response, NextFunction } from "express";
import { assignTeacherRoleByEmail, createUserAsAdmin, deleteUserById, listUsersByRole } from "../services/admin.service";
import { sendSuccess } from "../utils/apiResponse";
import { badRequest } from "../utils/errors";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, role } = req.body as {
      email: string;
      password: string;
      role: "teacher" | "student";
    };

    const user = await createUserAsAdmin(email, password, role);

    return sendSuccess(res, { user }, "User created", 201);
  } catch (error) {
    return next(error);
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const role = (req.query.role as string | undefined)?.toLowerCase();
    if (!role) {
      throw badRequest("Role query param is required");
    }

    if (role !== "student" && role !== "teacher" && role !== "admin") {
      throw badRequest("Invalid role");
    }

    const users = await listUsersByRole(role as any);
    return sendSuccess(res, { users });
  } catch (error) {
    return next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      throw badRequest("Invalid user id");
    }

    await deleteUserById(id);
    return sendSuccess(res, { deleted: true }, "User deleted");
  } catch (error) {
    return next(error);
  }
}

export async function assignTeacherRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body as { email: string };
    const user = await assignTeacherRoleByEmail(email);
    return sendSuccess(res, { user }, "Teacher role assigned");
  } catch (error) {
    return next(error);
  }
}
