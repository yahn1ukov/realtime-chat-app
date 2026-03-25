import { EVENT, ROLE, type UpdateUserStatusRequestDto } from "@chat/shared";
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

  async toggleUserBan(userId: string, dto: UpdateUserStatusRequestDto): Promise<void> {
    const { status: isBanned } = dto;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (user.role === ROLE.ADMIN) {
      throw new ForbiddenException("Cannot ban an admin");
    }

    await this.userRepository.updateById(userId, { isBanned });

    if (isBanned) {
      const sessionId = await this.redis.get(`auth:session:${userId}`);
      if (sessionId) {
        await this.redis.del(`auth:session:${userId}`);
        await this.redis.del(`sess:${sessionId}`);
      }

      const payload: UpdateUserStatusPayload = { userId };

      this.event.emit(EVENT.USER.BANNED, payload);
    }
  }

  async toggleUserMute(userId: string, dto: UpdateUserStatusRequestDto): Promise<void> {
    const { status: isMuted } = dto;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (user.role === ROLE.ADMIN) {
      throw new ForbiddenException("Cannot mute an admin");
    }

    await this.userRepository.updateById(userId, { isMuted });

    const payload: UpdateUserStatusPayload = { userId, status: isMuted };

    this.event.emit(EVENT.USER.MUTED, payload);
  }
}
