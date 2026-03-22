import { CallHandler, type ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import type { Request } from "express";
import type { RedisClientType } from "redis";
import type { Observable } from "rxjs";
import type { Socket } from "socket.io";
import { REDIS_TOKEN } from "src/cache/cache.module";

const RATE_LIMIT_TTL_SECONDS = 15;

@Injectable()
export class WsRateLimitInterceptor implements NestInterceptor {
  constructor(@Inject(REDIS_TOKEN) private readonly redis: RedisClientType) {}

  async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const client = ctx.switchToWs().getClient<Socket>();
    const request = client.request as Request;

    const userId = request.user!.id;
    const key = `rate_limit:message:${userId}`;

    const result = await this.redis.set(key, "1", {
      expiration: {
        type: "EX",
        value: RATE_LIMIT_TTL_SECONDS,
      },
      condition: "NX",
    });
    if (!result) {
      const ttl = await this.redis.ttl(key);
      throw new WsException(`You can send a message in ${ttl} second(-s).`);
    }

    return next.handle();
  }
}
