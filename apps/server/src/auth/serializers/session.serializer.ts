import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import type { UserEntity } from "src/user/user.entity";
import type { SessionPayload } from "../types/auth.type";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: UserEntity, done: (err: unknown, payload: SessionPayload) => void): void {
    done(null, { id: user.id, role: user.role });
  }

  deserializeUser(payload: SessionPayload, done: (err: unknown, user: Partial<UserEntity>) => void): void {
    done(null, { id: payload.id, role: payload.role });
  }
}
