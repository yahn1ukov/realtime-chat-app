import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "src/cache/cache.module";
import { UserModule } from "src/user/user.module";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { ChatRepository } from "./chat.repository";
import { ChatService } from "./chat.service";
import { WsRateLimitInterceptor } from "./interceptors/ws-rate-limit.interceptor";
import { MessageEntity } from "./message.entity";

@Module({
  imports: [CacheModule, UserModule, TypeOrmModule.forFeature([MessageEntity])],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, ChatRepository, WsRateLimitInterceptor],
})
export class ChatModule {}
