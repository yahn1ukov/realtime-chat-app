import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import { ChatModule } from "./chat/chat.module";
import { CommonModule } from "./common/common.module";
import { AppConfigModule } from "./config/config.module";
import { AppDatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    AppConfigModule,
    AppDatabaseModule,
    CacheModule,
    EventEmitterModule.forRoot(),
    CommonModule,
    UserModule,
    AdminModule,
    AuthModule,
    ChatModule,
  ],
})
export class AppModule {}
