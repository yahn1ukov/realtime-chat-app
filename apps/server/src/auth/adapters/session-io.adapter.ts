import type { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import type { RequestHandler } from "express";
import passport from "passport";
import type { Server, ServerOptions } from "socket.io";

export class SessionIOAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private readonly sessionMiddleware: RequestHandler,
    private readonly corsOrigin: string,
  ) {
    super(app);
  }

  override createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: this.corsOrigin,
        credentials: true,
      },
    }) as Server;

    server.engine.use(this.sessionMiddleware);
    server.engine.use(passport.initialize());
    server.engine.use(passport.session());

    return server;
  }
}
