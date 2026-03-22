import { UserDto } from "./user.dto.js";

interface ChatMessageDto {
  id: string;
  content: string;
  author: Pick<UserDto, "username" | "color">;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateMessageRequestDto = Pick<ChatMessageDto, "content">;

export type ChatMessageResponseDto = ChatMessageDto;
