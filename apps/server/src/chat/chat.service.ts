import type { ChatMessageResponseDto, CreateMessageRequestDto, OnlineUserResponseDto } from "@chat/shared";
import { Inject, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import type { RedisClientType } from "redis";
import { REDIS_TOKEN } from "src/cache/cache.module";
import { UserRepository } from "src/user/user.repository";
import { ChatRepository } from "./chat.repository";
import type { OnlineUser } from "./types/chat.type";

const ONLINE_USERS_KEY = "online_users";
const MESSAGE_HISTORY_LIMIT = 20;

@Injectable()
export class ChatService {
  constructor(
    @Inject(REDIS_TOKEN) private readonly redis: RedisClientType,
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getOnlineUsers(): Promise<OnlineUserResponseDto[]> {
    const users = await this.redis.hVals(ONLINE_USERS_KEY);
    return users.map((user) => JSON.parse(user) as OnlineUserResponseDto);
  }

  async getHistory(): Promise<ChatMessageResponseDto[]> {
    const messages = await this.chatRepository.getAllMessages(MESSAGE_HISTORY_LIMIT);
    return messages.reverse().map((message) => ({
      id: message.id,
      content: message.content,
      author: {
        username: message.author.username,
        color: message.author.color,
      },
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }));
  }

  async addOnlineUser(userId: string): Promise<{ user: OnlineUser; isNew: boolean } | null> {
    const cachedUser = await this.redis.hGet(ONLINE_USERS_KEY, userId);
    if (cachedUser) {
      return { user: JSON.parse(cachedUser) as OnlineUser, isNew: false };
    }

    const user = await this.userRepository.findById(userId);
    if (!user || user.isBanned) {
      return null;
    }

    const onlineUser: OnlineUser = { ...user };
    await this.redis.hSet(ONLINE_USERS_KEY, user.id, JSON.stringify(onlineUser));

    return { user: onlineUser, isNew: true };
  }

  async removeOnlineUser(userId: string): Promise<OnlineUser | null> {
    const cachedUser = await this.redis.hGet(ONLINE_USERS_KEY, userId);
    if (!cachedUser) {
      return null;
    }

    const deletedCount = await this.redis.hDel(ONLINE_USERS_KEY, userId);
    if (!deletedCount) {
      return null;
    }

    return JSON.parse(cachedUser) as OnlineUser;
  }

  async createMessage(authorId: string, dto: CreateMessageRequestDto): Promise<ChatMessageResponseDto> {
    const cachedUser = await this.redis.hGet(ONLINE_USERS_KEY, authorId);
    if (!cachedUser) {
      throw new WsException("User session not found.");
    }

    const onlineUser = JSON.parse(cachedUser) as OnlineUser;
    if (onlineUser.isMuted) {
      throw new WsException("You are muted.");
    }

    const message = await this.chatRepository.createMessage(onlineUser.id, dto);

    return {
      id: message.id,
      content: message.content,
      author: {
        username: onlineUser.username,
        color: onlineUser.color,
      },
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  async updateOnlineUserMute(userId: string, isMuted: boolean): Promise<void> {
    const cachedUser = await this.redis.hGet(ONLINE_USERS_KEY, userId);
    if (!cachedUser) {
      return;
    }

    const onlineUser = JSON.parse(cachedUser) as OnlineUser;
    onlineUser.isMuted = isMuted;

    await this.redis.hSet(ONLINE_USERS_KEY, userId, JSON.stringify(onlineUser));
  }
}
