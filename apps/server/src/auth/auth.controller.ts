import { EVENT } from "@chat/shared";
import { Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { AuthGuard } from "./guards/auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly event: EventEmitter2,
    private readonly service: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async auth(@Req() req: Request): Promise<void> {
    return this.service.createSession(req.user!.id, req.sessionID);
  }

  @UseGuards(AuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @CurrentUser("id") userId: string, @Res({ passthrough: true }) res: Response) {
    await new Promise<void>((resolve, reject) => {
      req.logout((error: unknown) => {
        if (error) {
          return reject(error);
        }

        req.session.destroy((error: unknown) => {
          if (error) {
            return reject(error);
          }

          resolve();
        });
      });
    });

    res.clearCookie("connect.sid");

    await this.service.deleteSession(userId);

    this.event.emit(EVENT.USER.LOGOUT, userId);
  }
}
