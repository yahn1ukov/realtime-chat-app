import type { ROLE } from "../constants/role.constant";

export type Role = (typeof ROLE)[keyof typeof ROLE];
