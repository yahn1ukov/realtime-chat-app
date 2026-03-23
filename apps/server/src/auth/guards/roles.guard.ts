import type { Role } from "@chat/shared";
import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { ROLE_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [ctx.getClass(), ctx.getHandler()]);
    if (!role) {
      return true;
    }

    const request = ctx.switchToHttp().getRequest<Request>();

    return request.user?.role === role;
  }
}
