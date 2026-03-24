import { Role } from "../types/role.type";

export interface AuthRequestDto {
  username: string;
  password: string;
}

export interface AuthResponseDto {
  id: string;
  role: Role;
}
