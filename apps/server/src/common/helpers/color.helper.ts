import { Injectable } from "@nestjs/common";

const USERNAME_COLORS = ["#3B82F6", "#22C55E", "#EF4444", "#F97316", "#A855F7", "#14B8A6"] as const;

@Injectable()
export class ColorHelper {
  random(): string {
    return USERNAME_COLORS[Math.floor(Math.random() * USERNAME_COLORS.length)];
  }
}
