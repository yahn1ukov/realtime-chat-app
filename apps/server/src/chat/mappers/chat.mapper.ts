import type { GetChatMessageResponseDto } from "@chat/shared";
import type { MessageEntity } from "../message.entity";
import type { OnlineUserPayload } from "../types/chat.type";

export class ChatMapper {
  static toOnlineUser(cachedUser: string): OnlineUserPayload {
    const user = JSON.parse(cachedUser);

    return {
      id: user.id,
      username: user.username,
      color: user.color,
      role: user.role,
      isMuted: user.isMuted,
    };
  }

  static toChatMessageDto(message: MessageEntity, user?: OnlineUserPayload): GetChatMessageResponseDto {
    return {
      id: message.id,
      content: message.content,
      author: {
        username: user?.username ?? message.author.username,
        color: user?.color ?? message.author.color,
      },
      createdAt: message.createdAt,
    };
  }
}
