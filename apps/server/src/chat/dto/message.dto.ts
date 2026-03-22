import { CreateMessageRequestDto as ICreateMessageRequestDto } from "@chat/shared";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateMessageRequestDto implements ICreateMessageRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @Transform(({ value }: { value: string }) => value.trim())
  content: string;
}
