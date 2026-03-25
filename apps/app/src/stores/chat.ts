import { useAuthStore } from "@/stores/auth";
import { useSocketStore } from "@/stores/socket";
import { PINIA_STORE_KEY } from "@/utils/constants/pinia.constant";
import { withRequestState, type RequestState } from "@/utils/http/request-state";
import {
  API_ENDPOINT,
  type CreateChatMessageRequestDto,
  type GetChatMessageResponseDto,
  type GetOnlineUserResponseDto,
} from "@chat/shared";
import { defineStore } from "pinia";
import { ref } from "vue";

const BASE_URL = import.meta.env.VITE_BASE_HTTP_URL;

export type ChatFeedMessage = { kind: "message"; data: GetChatMessageResponseDto };
export type ChatFeedSystem = { kind: "system"; text: string };
export type ChatFeedItem = ChatFeedMessage | ChatFeedSystem;

export const useChatStore = defineStore(PINIA_STORE_KEY.CHAT, () => {
  const state = ref<RequestState>({
    isLoading: false,
    error: null,
  });

  const socketStore = useSocketStore();
  const authStore = useAuthStore();

  const onlineUsers = ref<GetOnlineUserResponseDto[]>([]);
  const feed = ref<ChatFeedItem[]>([]);
  const isMuted = ref(false);
  const isForceDisconnected = ref(false);
  const wsError = ref<string | null>(null);

  async function getOnlineUsers(): Promise<void> {
    const result = await withRequestState<GetOnlineUserResponseDto[]>(state, () =>
      fetch(`${BASE_URL}/${API_ENDPOINT.CHAT.INDEX}/${API_ENDPOINT.CHAT.ONLINE_USERS}`, {
        credentials: "include",
      }),
    );
    if (result.ok) {
      onlineUsers.value = result.data;

      const me = result.data.find((u) => u.id === authStore.currentUser?.id);
      if (me) {
        isMuted.value = me.isMuted;
      }
    }
  }

  async function getHistory(): Promise<void> {
    const result = await withRequestState<GetChatMessageResponseDto[]>(state, () =>
      fetch(`${BASE_URL}/${API_ENDPOINT.CHAT.INDEX}/${API_ENDPOINT.CHAT.HISTORY}`, {
        credentials: "include",
      }),
    );
    if (result.ok) {
      feed.value = result.data.map((data) => ({ kind: "message" as const, data }));
    }
  }

  function connect(): void {
    isForceDisconnected.value = false;

    socketStore.connect({
      onMessage(message) {
        feed.value.push({ kind: "message", data: message });
      },
      onJoined(user) {
        feed.value.push({ kind: "system", text: `${user.username} joined the chat` });
        if (!onlineUsers.value.some((u) => u.id === user.id)) {
          onlineUsers.value.push(user);
        }
      },
      onLeft(username) {
        feed.value.push({ kind: "system", text: `${username} left the chat` });

        onlineUsers.value = onlineUsers.value.filter((u) => u.username !== username);
      },
      onMuted(payload) {
        const user = onlineUsers.value.find((u) => u.id === payload.userId);
        if (user) user.isMuted = payload.isMuted;
        if (payload.userId === authStore.currentUser?.id) {
          isMuted.value = payload.isMuted;
        }
      },
      onBanned() {
        isForceDisconnected.value = true;

        disconnect();
      },
      onDuplicateSession() {
        isForceDisconnected.value = true;

        disconnect();
      },
      onLogout() {
        isForceDisconnected.value = true;

        disconnect();
      },
      onException(errorMessage) {
        wsError.value = errorMessage;
      },
    });
  }

  function disconnect(): void {
    socketStore.disconnect();
    onlineUsers.value = [];
    feed.value = [];
    isMuted.value = false;
    wsError.value = null;
  }

  function clearWsError(): void {
    wsError.value = null;
  }

  function sendMessage(dto: CreateChatMessageRequestDto): void {
    socketStore.sendMessage(dto);
  }

  return {
    state,
    onlineUsers,
    feed,
    isMuted,
    isForceDisconnected,
    wsError,
    getOnlineUsers,
    getHistory,
    connect,
    disconnect,
    clearWsError,
    sendMessage,
  };
});
