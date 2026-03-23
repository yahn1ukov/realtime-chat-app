import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Strategy } from "passport-local";
import type { UserEntity } from "src/user/user.entity";
import { AuthService } from "../auth.service";
import { AuthRequestDto } from "../dto/auth.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserEntity> {
    const dto = plainToInstance(AuthRequestDto, { username, password });
    const errors = await validate(dto);
    if (errors.length) {
      throw new BadRequestException(errors.flatMap((e) => Object.values(e.constraints ?? {})));
    }

    return this.authService.validateUser(dto);
  }
}
