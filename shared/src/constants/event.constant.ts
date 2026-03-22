export const EVENT = {
  SESSION: {
    REVOKED: "session.revoked",
  },
  USER: {
    BANNED: "user.banned",
    MUTED: "user.muted",
    LOGOUT: "user.logout",
  },
} as const;
