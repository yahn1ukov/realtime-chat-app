import type { CreateChatMessageRequestDto, GetChatMessageResponseDto, GetOnlineUserResponseDto } from "@chat/shared";
import { Inject, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import type { RedisClientType } from "redis";
import { REDIS_TOKEN } from "src/cache/cache.module";
import { UserRepository } from "src/user/user.repository";
import { ChatRepository } from "./chat.repository";
import { ChatMapper } from "./mappers/chat.mapper";
import type { OnlineUserPayload } from "./types/chat.type";

const ONLINE_USERS_KEY = "online_users";

@Injectable()
export class ChatService {
  constructor(
    @Inject(REDIS_TOKEN) private readonly redis: RedisClientType,
    private readonly repository: ChatRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getOnlineUsers(): Promise<GetOnlineUserResponseDto[]> {
    const cachedUsers = await this.redis.hVals(ONLINE_USERS_KEY);

    return cachedUsers.map((cachedUser) => ChatMapper.toOnlineUser(cachedUser));
  }

  async getHistory(): Promise<GetChatMessageResponseDto[]> {
    const messages = await this.repository.getMessages();

    return messages.reverse().map((message) => ChatMapper.toChatMessageDto(message));
  }

  async addOnlineUser(userId: string): Promise<{ user: OnlineUserPayload; isNew: boolean } | null> {
    const cachedUser = await this.redis.hGet(ONLINE_USERS_KEY, userId);
    if (cachedUser) {
      return {
        user: ChatMapper.toOnlineUser(cachedUser),
        isNew: false,
      };
    }

    const user = await this.userRepository.findById(userId);
    if (!user || user.isBanned) {
      return null;
    }

    const onlineUser: OnlineUserPayload = {
      id: user.id,
      username: user.username,
      color: user.color,
      role: user.role,
      isMuted: user.isMuted,
    };
    await this.redis.hSet(ONLINE_USERS_KEY, user.id, JSON.stringify(onlineUser));

    return { user: onlineUser, isNew: true };
  }

  async removeOnlineUser(userId: string): Promise<OnlineUserPayload | null> {
    const cachedUser = await this.redis.hGet(ONLINE_USERS_KEY, userId);
    if (!cachedUser) {
      return null;
    }

    const deletedCount = await this.redis.hDel(ONLINE_USERS_KEY, userId);
    if (!deletedCount) {
      return null;
    }

    return ChatMapper.toOnlineUser(cachedUser);
  }

  async createMessage(authorId: string, dto: CreateChatMessageRequestDto): Promise<GetChatMessageResponseDto> {
    const cachedUser = await this.redis.hGet(ONLINE_USERS_KEY, authorId);
    if (!cachedUser) {
      throw new WsException("User session not found");
    }

    const onlineUser = ChatMapper.toOnlineUser(cachedUser);
    if (onlineUser.isMuted) {
      throw new WsException("You are muted");
    }

    const message = await this.repository.createMessage(onlineUser.id, dto);

    return ChatMapper.toChatMessageDto(message, onlineUser);
  }

  async updateOnlineUserMute(userId: string, isMuted: boolean): Promise<void> {
    const cachedUser = await this.redis.hGet(ONLINE_USERS_KEY, userId);
    if (!cachedUser) {
      return;
    }

    const onlineUser = ChatMapper.toOnlineUser(cachedUser);
    onlineUser.isMuted = isMuted;

    await this.redis.hSet(ONLINE_USERS_KEY, userId, JSON.stringify(onlineUser));
  }
}
