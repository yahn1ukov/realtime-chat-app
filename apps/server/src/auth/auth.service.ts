import { type AuthRequestDto, EVENT, ROLE } from "@chat/shared";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import type { RedisClientType } from "redis";
import { REDIS_TOKEN } from "src/cache/cache.module";
import { UserEntity } from "src/user/user.entity";
import { UserRepository } from "src/user/user.repository";
import { ColorHelper } from "../common/helpers/color.helper";
import { HashHelper } from "./helpers/hash.helper";

const SESSION_TTL_SECONDS = 86400;

@Injectable()
export class AuthService {
  constructor(
    private readonly event: EventEmitter2,
    @Inject(REDIS_TOKEN) private readonly redis: RedisClientType,
    private readonly hashHelper: HashHelper,
    private readonly colorHelper: ColorHelper,
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(dto: AuthRequestDto): Promise<UserEntity> {
    const { username, password } = dto;

    const user = await this.userRepository.findByUsername(username);
    if (user) {
      const isPasswordMatched = await this.hashHelper.verify(user.password, password);
      if (!isPasswordMatched) {
        throw new UnauthorizedException("Invalid credentials");
      }

      return user;
    } else {
      const adminCount = await this.userRepository.countByRole(ROLE.ADMIN);
      const role = adminCount ? ROLE.USER : ROLE.ADMIN;

      const passwordHash = await this.hashHelper.hash(password);
      const color = this.colorHelper.random();

      return this.userRepository.create({ username, password: passwordHash, role, color });
    }
  }

  async createSession(userId: string, sessionId: string): Promise<void> {
    const key = `auth:session:${userId}`;

    const oldSessionId = await this.redis.get(key);
    if (oldSessionId && oldSessionId !== sessionId) {
      await this.redis.del(`sess:${oldSessionId}`);
      this.event.emit(EVENT.SESSION.REVOKED, oldSessionId);
    }

    await this.redis.set(key, sessionId, {
      expiration: {
        type: "EX",
        value: SESSION_TTL_SECONDS,
      },
    });
  }

  async deleteSession(userId: string): Promise<void> {
    await this.redis.del(`auth:session:${userId}`);
  }
}
