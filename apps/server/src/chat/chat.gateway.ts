import { EVENT, WS_EVENT } from "@chat/shared";
import { UseGuards, UseInterceptors } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {
  ConnectedSocket,
  MessageBody,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import type { Request } from "express";
import type { Server, Socket } from "socket.io";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { ChatService } from "./chat.service";
import { CreateChatMessageRequestDto } from "./dto/message.dto";
import { WsRateLimitInterceptor } from "./interceptors/ws-rate-limit.interceptor";
import type { UpdateUserStatusPayload } from "./types/chat.type";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly service: ChatService) {}

  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    const request = client.request as Request;

    const sessionId = request.sessionID;
    const user = request.user;
    if (!user) {
      client.disconnect(true);
      return;
    }

    const result = await this.service.addOnlineUser(user.id);
    if (!result) {
      client.disconnect(true);
      return;
    }

    await client.join(user.id);

    if (sessionId) {
      await client.join(sessionId);
    }

    if (result.isNew) {
      this.server.emit(WS_EVENT.SYSTEM.JOINED, {
        username: result.user.username,
        color: result.user.color,
      });
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
    const request = client.request as Request;

    const userId = request.user?.id;
    if (!userId) {
      return;
    }

    const sockets = await this.server.in(userId).fetchSockets();
    if (!sockets.length) {
      const offlineUser = await this.service.removeOnlineUser(userId);
      if (offlineUser) {
        this.server.emit(WS_EVENT.SYSTEM.LEFT, {
          username: offlineUser.username,
          color: offlineUser.color,
        });
      }
    }
  }

  @OnEvent(EVENT.SESSION.REVOKED)
  handleSessionRevoked(oldSessionId: string): void {
    this.server.to(oldSessionId).emit(WS_EVENT.SYSTEM.DUPLICATE_SESSION);
    this.server.in(oldSessionId).disconnectSockets(true);
  }

  @OnEvent(EVENT.USER.BANNED)
  handleUserBanned(payload: UpdateUserStatusPayload): void {
    this.server.to(payload.userId).emit(WS_EVENT.SYSTEM.BANNED);
    this.server.in(payload.userId).disconnectSockets(true);
  }

  @OnEvent(EVENT.USER.MUTED)
  async handleUserMuted(payload: UpdateUserStatusPayload): Promise<void> {
    await this.service.updateOnlineUserMute(payload.userId, payload.status!);

    this.server.to(payload.userId).emit(WS_EVENT.SYSTEM.MUTED, payload.status!);
  }

  @OnEvent(EVENT.USER.LOGOUT)
  handleUserLogout(userId: string): void {
    this.server.in(userId).disconnectSockets(true);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(WsRateLimitInterceptor)
  @SubscribeMessage(WS_EVENT.MESSAGE)
  async handleMessage(
    @CurrentUser("id") authorId: string,
    @MessageBody() dto: CreateChatMessageRequestDto,
  ): Promise<void> {
    const message = await this.service.createMessage(authorId, dto);

    this.server.emit(WS_EVENT.MESSAGE, message);
  }
}
