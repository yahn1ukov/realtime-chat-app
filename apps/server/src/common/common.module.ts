import { Module } from "@nestjs/common";
import { ColorHelper } from "./helpers/color.helper";

@Module({
  providers: [ColorHelper],
  exports: [ColorHelper],
})
export class CommonModule {}
