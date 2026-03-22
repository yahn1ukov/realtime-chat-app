import { Module } from "@nestjs/common";
import { createClient } from "redis";
import { AppConfigService } from "src/config/config.service";

export const REDIS_TOKEN = "REDIS_TOKEN";

@Module({
  providers: [
    {
      provide: REDIS_TOKEN,
      inject: [AppConfigService],
      useFactory: async (config: AppConfigService) => {
        const client = createClient(config.redis);

        await client.connect();

        return client;
      },
    },
  ],
  exports: [REDIS_TOKEN],
})
export class CacheModule {}
