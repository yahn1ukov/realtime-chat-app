import type { UpdateUserStatusRequestDto as IUpdateUserStatusRequestDto } from "@chat/shared";
import { IsBoolean } from "class-validator";

export class UpdateUserStatusRequestDto implements IUpdateUserStatusRequestDto {
  @IsBoolean()
  status: boolean;
}
