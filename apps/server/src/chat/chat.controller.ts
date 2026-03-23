import type { GetChatMessageResponseDto, GetOnlineUserResponseDto } from "@chat/shared";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { ChatService } from "./chat.service";

@UseGuards(AuthGuard)
@Controller("chat")
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Get("online-users")
  async getOnlineUsers(): Promise<GetOnlineUserResponseDto[]> {
    return this.service.getOnlineUsers();
  }

  @Get("history")
  async getHistory(): Promise<GetChatMessageResponseDto[]> {
    return this.service.getHistory();
  }
}
