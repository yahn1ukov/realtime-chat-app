export const API_ENDPOINT = {
  AUTH: {
    INDEX: "auth",
    ME: "me",
    LOGOUT: "logout",
  },
  CHAT: {
    INDEX: "chat",
    HISTORY: "history",
    ONLINE_USERS: "online-users",
  },
  ADMIN: {
    INDEX: "admin/users",
    BAN: ":id/ban",
    MUTE: ":id/mute",
  },
} as const;
