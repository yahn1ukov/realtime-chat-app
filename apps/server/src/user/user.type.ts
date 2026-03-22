import { Role } from "@chat/shared";

export interface CreateUserPayload {
  username: string;
  password: string;
  role: Role;
  color: string;
}

export type UpdateUserPayload = Partial<CreateUserPayload & { isBanned: boolean; isMuted: boolean }>;
