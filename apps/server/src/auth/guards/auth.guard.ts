import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import type { Request } from "express";
import type { Socket } from "socket.io";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    let request: Request;
    const type = ctx.getType();

    if (type === "ws") {
      const client = ctx.switchToWs().getClient<Socket>();
      request = client.request as Request;
    } else {
      request = ctx.switchToHttp().getRequest();
    }

    return request.isAuthenticated();
  }
}
