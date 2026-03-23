import type { Role } from "../types/role.type";

export interface UserDto {
  id: string;
  username: string;
  color: string;
  role: Role;
  isMuted: boolean;
}

export interface UpdateUserStatusRequestDto {
  status: boolean;
}

export type GetOnlineUserResponseDto = UserDto;
