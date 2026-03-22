import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { CacheModule } from "src/cache/cache.module";
import { CommonModule } from "src/common/common.module";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { HashHelper } from "./helpers/hash.helper";
import { SessionSerializer } from "./serializers/session.serializer";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [CacheModule, CommonModule, UserModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [HashHelper, AuthService, SessionSerializer, LocalStrategy, LocalAuthGuard, AuthGuard, RolesGuard],
  exports: [AuthGuard, RolesGuard],
})
export class AuthModule {}
