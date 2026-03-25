import { PINIA_STORE_KEY } from "@/utils/constants/pinia.constant";
import type { CreateChatMessageRequestDto, GetChatMessageResponseDto, GetOnlineUserResponseDto } from "@chat/shared";
import { WS_EVENT } from "@chat/shared";
import { defineStore } from "pinia";
import { io, type Socket } from "socket.io-client";
import { shallowRef } from "vue";

export type SocketEventHandlers = {
  onMessage: (message: GetChatMessageResponseDto) => void;
  onJoined: (user: GetOnlineUserResponseDto) => void;
  onLeft: (username: string) => void;
  onMuted: (payload: { userId: string; isMuted: boolean }) => void;
  onBanned: () => void;
  onDuplicateSession: () => void;
  onLogout: () => void;
  onException: (errorMessage: string) => void;
};

export const useSocketStore = defineStore(PINIA_STORE_KEY.SOCKET, () => {
  const socket = shallowRef<Socket | null>(null);

  function connect(handlers: SocketEventHandlers): void {
    if (socket.value?.connected) {
      return;
    }

    socket.value = io(import.meta.env.VITE_BASE_WS_URL, {
      withCredentials: true,
    });

    socket.value.on(WS_EVENT.MESSAGE, handlers.onMessage);

    socket.value.on(WS_EVENT.SYSTEM.JOINED, handlers.onJoined);

    socket.value.on(WS_EVENT.SYSTEM.LEFT, handlers.onLeft);

    socket.value.on(WS_EVENT.SYSTEM.MUTED, handlers.onMuted);

    socket.value.on(WS_EVENT.SYSTEM.BANNED, handlers.onBanned);

    socket.value.on(WS_EVENT.SYSTEM.DUPLICATE_SESSION, handlers.onDuplicateSession);

    socket.value.on(WS_EVENT.SYSTEM.LOGOUT, handlers.onLogout);

    socket.value.on(WS_EVENT.EXCEPTION, (error: { message: string }) => {
      handlers.onException(error.message);
    });
  }

  function disconnect(): void {
    socket.value?.disconnect();
    socket.value = null;
  }

  function sendMessage(dto: CreateChatMessageRequestDto): void {
    socket.value?.emit(WS_EVENT.MESSAGE, dto);
  }

  return {
    connect,
    disconnect,
    sendMessage,
  };
});
