import { Module } from "@nestjs/common";
import { CacheModule } from "src/cache/cache.module";
import { UserModule } from "src/user/user.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  imports: [CacheModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
