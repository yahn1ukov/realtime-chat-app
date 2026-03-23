import type { UserDto } from "@chat/shared";

export interface CreateMessagePayload {
  content: string;
}

export interface UpdateUserStatusPayload {
  userId: string;
  status?: boolean;
}

export type OnlineUserPayload = UserDto;
