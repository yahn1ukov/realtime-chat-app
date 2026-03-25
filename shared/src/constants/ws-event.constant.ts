export const WS_EVENT = {
  MESSAGE: "message",
  EXCEPTION: "exception",
  SYSTEM: {
    JOINED: "system:joined",
    LEFT: "system:left",
    BANNED: "system:banned",
    MUTED: "system:muted",
    DUPLICATE_SESSION: "system:duplicate_session",
    LOGOUT: "system:logout",
  },
} as const;
