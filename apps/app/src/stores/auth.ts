import { PINIA_STORE_KEY } from "@/utils/constants/pinia.constant";
import { withRequestState, type RequestState } from "@/utils/http/request-state";
import { API_ENDPOINT, type AuthRequestDto, type AuthResponseDto } from "@chat/shared";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const BASE_URL = import.meta.env.VITE_BASE_HTTP_URL;

export const useAuthStore = defineStore(PINIA_STORE_KEY.AUTH, () => {
  const state = ref<RequestState>({
    isLoading: false,
    error: null,
  });

  const currentUser = ref<AuthResponseDto | null>(null);
  const isSessionChecked = ref(false);

  const isAuthenticated = computed(() => !!currentUser.value);

  async function getCurrentUser(): Promise<void> {
    try {
      const result = await fetch(`${BASE_URL}/${API_ENDPOINT.AUTH.INDEX}/${API_ENDPOINT.AUTH.ME}`, {
        credentials: "include",
      });
      if (!result.ok) {
        currentUser.value = null;
        return;
      }

      const data: AuthResponseDto = await result.json();

      currentUser.value = data;
    } catch {
      currentUser.value = null;
    } finally {
      isSessionChecked.value = true;
    }
  }

  async function auth(dto: AuthRequestDto): Promise<void> {
    const result = await withRequestState<AuthResponseDto>(state, () =>
      fetch(`${BASE_URL}/${API_ENDPOINT.AUTH.INDEX}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      }),
    );
    if (result.ok) {
      currentUser.value = result.data;
    }
  }

  async function logout(): Promise<void> {
    const result = await withRequestState(state, () =>
      fetch(`${BASE_URL}/${API_ENDPOINT.AUTH.INDEX}/${API_ENDPOINT.AUTH.LOGOUT}`, {
        method: "POST",
        credentials: "include",
      }),
    );
    if (result.ok) {
      currentUser.value = null;
    }
  }

  function forceLogout(): void {
    currentUser.value = null;

    fetch(`${BASE_URL}/${API_ENDPOINT.AUTH.INDEX}/${API_ENDPOINT.AUTH.LOGOUT}`, {
      method: "POST",
      credentials: "include",
    }).catch(() => null);
  }

  return {
    state,
    currentUser,
    isSessionChecked,
    isAuthenticated,
    getCurrentUser,
    auth,
    logout,
    forceLogout,
  };
});
