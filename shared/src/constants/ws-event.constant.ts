export const WS_EVENT = {
  MESSAGE: "message",
  SYSTEM: {
    JOINED: "system:joined",
    LEFT: "system:left",
    BANNED: "system:banned",
    MUTED: "system:muted",
    DUPLICATE_SESSION: "system:duplicate_session",
  },
} as const;
