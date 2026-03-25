import type { Ref } from "vue";

export type Result<T> = { ok: true; data: T } | { ok: false; error: Error };

export interface RequestState {
  isLoading: boolean;
  error: Error | null;
}

export async function withRequestState<T = void>(
  state: Ref<RequestState>,
  fn: () => Promise<Response>,
): Promise<Result<T>> {
  state.value.isLoading = true;
  state.value.error = null;

  try {
    const response = await fn();
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message ?? "Something went wrong.";

      throw new Error(Array.isArray(message) ? message[0] : message);
    }

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json") && (await response.json());

    return { ok: true, data: data as T };
  } catch (error: unknown) {
    const fetchError = error instanceof Error ? error : new Error(String(error));

    state.value.error = fetchError;

    return { ok: false, error: fetchError };
  } finally {
    state.value.isLoading = false;
  }
}
