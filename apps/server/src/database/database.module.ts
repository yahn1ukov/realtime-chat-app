import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "src/chat/message.entity";
import { AppConfigService } from "src/config/config.service";
import { UserEntity } from "src/user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: "postgres",
        ...config.database,
        entities: [UserEntity, MessageEntity],
        synchronize: !config.app.isProd,
      }),
    }),
  ],
})
export class AppDatabaseModule {}
