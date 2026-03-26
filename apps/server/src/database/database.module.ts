import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppConfigService } from "src/config/config.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: "postgres",
        ...config.database,
        autoLoadEntities: true,
        migrationsRun: true,
        migrations: [__dirname + "/migrations/*{.ts,.js}"],
      }),
    }),
  ],
})
export class AppDatabaseModule {}
