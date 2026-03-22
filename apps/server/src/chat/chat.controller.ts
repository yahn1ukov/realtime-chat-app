import { ChatMessageResponseDto, OnlineUserResponseDto } from "@chat/shared";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { ChatService } from "./chat.service";

@UseGuards(AuthGuard)
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("online-users")
  async getOnlineUsers(): Promise<OnlineUserResponseDto[]> {
    return this.chatService.getOnlineUsers();
  }

  @Get("history")
  async getHistory(): Promise<ChatMessageResponseDto[]> {
    return this.chatService.getHistory();
  }
}
