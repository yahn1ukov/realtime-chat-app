import type { Role } from "@chat/shared";
import { SetMetadata } from "@nestjs/common";

export const ROLE_KEY = "role";

export const Roles = (role: Role) => SetMetadata(ROLE_KEY, role);
