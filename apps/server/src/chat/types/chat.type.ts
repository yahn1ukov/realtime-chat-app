import { Role } from "@chat/shared";

export interface OnlineUser {
  id: string;
  username: string;
  color: string;
  role: Role;
  isBanned: boolean;
  isMuted: boolean;
}

export interface CreateMessagePayload {
  content: string;
}

export interface UpdateUserStatusPayload {
  userId: string;
  status?: boolean;
}
