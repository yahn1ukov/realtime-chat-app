import type { UserDto } from "./user.dto.js";

interface ChatMessageDto {
  id: string;
  content: string;
  author: Pick<UserDto, "username" | "color">;
  createdAt: Date;
}

export type CreateChatMessageRequestDto = Pick<ChatMessageDto, "content">;

export type GetChatMessageResponseDto = ChatMessageDto;
