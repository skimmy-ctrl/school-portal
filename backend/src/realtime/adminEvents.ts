import { EventEmitter } from "events";

export type UserCreatedEvent = {
  id: number;
  email: string;
  displayName?: string | null;
  fullName?: string | null;
  title?: string | null;
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  role: "student" | "teacher" | "admin";
};

const emitter = new EventEmitter();

export function onUserCreated(listener: (event: UserCreatedEvent) => void) {
  emitter.on("userCreated", listener);
  return () => emitter.off("userCreated", listener);
}

export function emitUserCreated(event: UserCreatedEvent) {
  emitter.emit("userCreated", event);
}
