import { EVENT, ROLE } from "@chat/shared";
import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import type { RedisClientType } from "redis";
import { REDIS_TOKEN } from "src/cache/cache.module";
import type { UpdateUserStatusPayload } from "src/chat/types/chat.type";
import { UserRepository } from "src/user/user.repository";

@Injectable()
export class AdminService {
  constructor(
    private readonly event: EventEmitter2,
    @Inject(REDIS_TOKEN) private readonly redis: RedisClientType,
    private readonly userRepository: UserRepository,
  ) {}

  async toggleUserBan(userId: string, isBanned: boolean): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    if (user.role === ROLE.ADMIN) {
      throw new ForbiddenException("Cannot ban an admin.");
    }

    await this.userRepository.updateById(userId, { isBanned });

    if (isBanned) {
      const sessionId = await this.redis.get(`auth:session:${userId}`);
      if (sessionId) {
        await this.redis.del(`sess:${sessionId}`);
        await this.redis.del(`auth:session:${userId}`);
        this.event.emit(EVENT.USER.BANNED, { userId } as UpdateUserStatusPayload);
      }
    }
  }

  async toggleUserMute(userId: string, isMuted: boolean): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    if (user.role === ROLE.ADMIN) {
      throw new ForbiddenException("Cannot mute an admin.");
    }

    await this.userRepository.updateById(userId, { isMuted });

    const sessionId = await this.redis.get(`auth:session:${userId}`);
    if (sessionId) {
      this.event.emit(EVENT.USER.MUTED, { userId, isMuted } as UpdateUserStatusPayload);
    }
  }
}
