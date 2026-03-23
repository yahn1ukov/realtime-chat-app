import type { AuthRequestDto as IAuthRequestDto } from "@chat/shared";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthRequestDto implements IAuthRequestDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9]+$/)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
