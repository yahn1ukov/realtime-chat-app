import { type AuthRequestDto, EVENT, ROLE } from "@chat/shared";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import type { RedisClientType } from "redis";
import { REDIS_TOKEN } from "src/cache/cache.module";
import { AppConfigService } from "src/config/config.service";
import type { UserEntity } from "src/user/user.entity";
import { UserRepository } from "src/user/user.repository";
import { ColorHelper } from "../common/helpers/color.helper";
import { HashHelper } from "./helpers/hash.helper";

@Injectable()
export class AuthService {
  constructor(
    private readonly config: AppConfigService,
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
      if (user.isBanned) {
        throw new UnauthorizedException("You are banned");
      }

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
        value: this.config.session.ttl,
      },
    });
  }

  async deleteSession(userId: string): Promise<void> {
    await this.redis.del(`auth:session:${userId}`);
  }
}
