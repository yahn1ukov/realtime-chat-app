import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get app() {
    return {
      isProd: this.config.get<string>("NODE_ENV", "development") === "production",
      port: +this.config.get<string>("PORT", "3000"),
    };
  }

  get database() {
    return {
      host: this.config.get<string>("DB_HOST", "localhost"),
      port: +this.config.get<string>("DB_PORT", "5432"),
      username: this.config.get<string>("DB_USERNAME", "postgres"),
      password: this.config.get<string>("DB_PASSWORD", "postgres"),
      database: this.config.get<string>("DB_NAME", "realtime-chat-db"),
    };
  }

  get redis() {
    return {
      socket: {
        host: this.config.get<string>("REDIS_HOST", "localhost"),
        port: +this.config.get<string>("REDIS_PORT", "6379"),
      },
      password: this.config.get<string>("REDIS_PASSWORD", "redis"),
      database: +this.config.get<string>("REDIS_DB", "0"),
    };
  }

  get session() {
    return {
      secret: this.config.get<string>("SESSION_SECRET", "secret-key"),
    };
  }

  get cors() {
    return {
      origin: this.config.get<string>("CORS_CLIENT_URL", "http://localhost:5173"),
    };
  }

  get cookie() {
    return {
      httpOnly: this.config.get<string>("COOKIE_HTTP_ONLY", "true") === "true",
      secure: this.app.isProd,
      maxAge: +this.config.get<string>("COOKIE_MAX_AGE", "86400000"),
      path: this.config.get<string>("COOKIE_PATH", "/"),
      sameSite: this.config.get<string>("COOKIE_SAME_SITE", "lax") as "lax" | "strict" | "none",
    };
  }
}
