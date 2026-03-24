import { PINIA_STORE_KEY } from "@/utils/constants/pinia.constant";
import { withRequestState, type RequestState } from "@/utils/http/request-state";
import { transformURL } from "@/utils/http/transform-url";
import { API_ENDPOINT, type UpdateUserStatusRequestDto } from "@chat/shared";
import { defineStore } from "pinia";
import { ref } from "vue";

const BASE_URL = import.meta.env.VITE_BASE_HTTP_URL;

export const useAdminStore = defineStore(PINIA_STORE_KEY.ADMIN, () => {
  const state = ref<RequestState>({
    isLoading: false,
    error: null,
  });

  async function toggleBan(userId: string, dto: UpdateUserStatusRequestDto): Promise<void> {
    const banURL = transformURL(API_ENDPOINT.ADMIN.BAN, userId);

    await withRequestState(state, () =>
      fetch(`${BASE_URL}/${API_ENDPOINT.ADMIN.INDEX}/${banURL}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      }),
    );
  }

  async function toggleMute(userId: string, dto: UpdateUserStatusRequestDto): Promise<void> {
    const muteURL = transformURL(API_ENDPOINT.ADMIN.MUTE, userId);

    await withRequestState(state, () =>
      fetch(`${BASE_URL}/${API_ENDPOINT.ADMIN.INDEX}/${muteURL}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      }),
    );
  }

  return {
    state,
    toggleBan,
    toggleMute,
  };
});
