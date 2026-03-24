import type { AuthResponseDto } from "@chat/shared";
import { API_ENDPOINT, EVENT } from "@chat/shared";
import { Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { AuthGuard } from "./guards/auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import type { SessionPayload } from "./types/auth.type";

@Controller(API_ENDPOINT.AUTH.INDEX)
export class AuthController {
  constructor(
    private readonly event: EventEmitter2,
    private readonly service: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async auth(@Req() req: Request): Promise<AuthResponseDto> {
    await this.service.createSession(req.user!.id, req.sessionID);

    return {
      id: req.user!.id,
      role: req.user!.role,
    };
  }

  @UseGuards(AuthGuard)
  @Get(API_ENDPOINT.AUTH.ME)
  async getMe(@CurrentUser() user: SessionPayload): Promise<AuthResponseDto> {
    return {
      id: user.id,
      role: user.role,
    };
  }

  @UseGuards(AuthGuard)
  @Post(API_ENDPOINT.AUTH.LOGOUT)
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
