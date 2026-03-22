import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { RedisStore } from "connect-redis";
import session from "express-session";
import passport from "passport";
import { AppModule } from "./app.module";
import { SessionIOAdapter } from "./auth/adapters/session.adapter";
import { REDIS_TOKEN } from "./cache/cache.module";
import { AppConfigService } from "./config/config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(AppConfigService);
  const redis = app.get(REDIS_TOKEN);

  const store = new RedisStore({ client: redis });

  app.enableCors({
    origin: config.cors.origin,
    credentials: true,
    methods: ["GET", "POST"],
  });

  const sessionMiddleware = session({
    store,
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { ...config.cookie },
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  app.useWebSocketAdapter(new SessionIOAdapter(app, sessionMiddleware));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(config.app.port);
}

bootstrap();
