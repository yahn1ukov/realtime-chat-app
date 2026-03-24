import { API_ENDPOINT, type GetChatMessageResponseDto, type GetOnlineUserResponseDto } from "@chat/shared";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { ChatService } from "./chat.service";

@UseGuards(AuthGuard)
@Controller(API_ENDPOINT.CHAT.INDEX)
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Get(API_ENDPOINT.CHAT.ONLINE_USERS)
  async getOnlineUsers(): Promise<GetOnlineUserResponseDto[]> {
    return this.service.getOnlineUsers();
  }

  @Get(API_ENDPOINT.CHAT.HISTORY)
  async getHistory(): Promise<GetChatMessageResponseDto[]> {
    return this.service.getHistory();
  }
}
