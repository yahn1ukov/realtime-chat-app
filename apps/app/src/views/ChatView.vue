<script setup lang="ts">
import Button from "@/components/app/Button.vue";
import InputGroupField from "@/components/app/InputGroupField.vue";
import Message from "@/components/app/Message.vue";
import ChatMessage from "@/components/chat/ChatMessage.vue";
import Navbar from "@/components/chat/Navbar.vue";
import OnlineUserList from "@/components/chat/OnlineUserList.vue";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { ROUTE } from "@/utils/constants/route.constant";
import type { CreateChatMessageRequestDto } from "@chat/shared";
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const isSideOpen = ref(false);
const formState = reactive<CreateChatMessageRequestDto>({
  content: "",
});

const authStore = useAuthStore();
const chatStore = useChatStore();
const { feed, onlineUsers, isMuted, isForceDisconnected, wsError } = storeToRefs(chatStore);

watch(isForceDisconnected, (disconnected) => {
  if (disconnected) {
    authStore.forceLogout();

    router.push({ name: ROUTE.AUTH });
  }
});

onMounted(async () => {
  await Promise.all([chatStore.getOnlineUsers(), chatStore.getHistory()]);

  chatStore.connect();
});

onUnmounted(() => {
  chatStore.disconnect();
});

function resetForm() {
  Object.assign(formState, { content: "" });
}

function handleSend(): void {
  chatStore.clearWsError();

  if (!formState.content || isMuted.value) {
    return;
  }

  chatStore.sendMessage({ content: formState.content });
  resetForm();
}
</script>

<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <Navbar v-model="isSideOpen" />

    <div class="relative flex flex-1 overflow-hidden">
      <aside
        v-if="isSideOpen"
        class="absolute inset-0 z-10 overflow-y-auto flex flex-col gap-2 p-3 border-r border-gray-200 bg-surface md:relative md:inset-auto md:z-auto md:w-[15%] md:shrink-0"
      >
        <p class="text-xs font-semibold uppercase tracking-wide">Online Users</p>

        <Message v-if="chatStore.state.isLoading" message="Loading..." />

        <OnlineUserList v-else :users="onlineUsers" />
      </aside>

      <div class="flex flex-1 flex-col overflow-hidden">
        <div class="flex flex-col flex-1 overflow-y-auto gap-3 p-3">
          <template v-for="(item, index) in feed" :key="index">
            <ChatMessage v-if="item.kind === 'message'" :message="item.data" />
            <Message v-else :message="item.text" />
          </template>
        </div>

        <div class="flex flex-col gap-2 border-t border-gray-200 p-3">
          <Message v-if="wsError" :message="wsError" type="error" />

          <div class="flex gap-2">
            <InputGroupField
              id="message"
              type="text"
              v-model="formState.content"
              :disabled="isMuted"
              @keydown.enter.prevent="handleSend"
              class="flex-1"
            />

            <Button type="button" label="Send" :disabled="isMuted" @click="handleSend" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
