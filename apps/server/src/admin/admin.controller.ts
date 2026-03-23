import { ROLE } from "@chat/shared";
import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AdminService } from "./admin.service";
import { UpdateUserStatusRequestDto } from "./dto/admin.dto";

@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
@Controller("admin/users")
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Patch(":id/ban")
  async toggleUserBan(@Param("id") userId: string, @Body() dto: UpdateUserStatusRequestDto): Promise<void> {
    return this.service.toggleUserBan(userId, dto);
  }

  @Patch(":id/mute")
  async toggleUserMute(@Param("id") userId: string, @Body() dto: UpdateUserStatusRequestDto): Promise<void> {
    return this.service.toggleUserMute(userId, dto);
  }
}
