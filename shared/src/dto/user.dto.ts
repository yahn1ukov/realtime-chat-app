import { Role } from "../types/role.type";

export interface UserDto {
  id: string;
  username: string;
  color: string;
  role: Role;
  isBanned: boolean;
  isMuted: boolean;
}

export type OnlineUserResponseDto = UserDto;

export interface UpdateUserStatusRequestDto {
  value: boolean;
}
