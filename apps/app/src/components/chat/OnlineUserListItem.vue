<script setup lang="ts">
import { useAdminStore } from "@/stores/admin";
import { useAuthStore } from "@/stores/auth";
import { ROLE, type GetOnlineUserResponseDto } from "@chat/shared";
import { storeToRefs } from "pinia";
import { computed } from "vue";

interface Props {
  user: GetOnlineUserResponseDto;
}

defineProps<Props>();

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

const adminStore = useAdminStore();

const isAdmin = computed(() => currentUser.value?.role === ROLE.ADMIN);

async function handleBan(userId: string) {
  await adminStore.toggleBan(userId, { status: true });
}

async function handleMute(userId: string, isMuted: boolean) {
  await adminStore.toggleMute(userId, { status: !isMuted });
}
</script>

<template>
  <li class="flex flex-col gap-0.5">
    <div class="flex justify-between items-center">
      <span class="truncate flex-1" :style="{ color: user.color }">{{ user.username }}</span>
      <span v-if="user.isMuted" class="text-xs text-gray-400">muted</span>
    </div>

    <div v-if="isAdmin && currentUser?.id !== user.id" class="flex gap-2">
      <button
        class="cursor-pointer text-sm hover:underline disabled:opacity-50"
        :disabled="adminStore.state.isLoading"
        @click="handleMute(user.id, user.isMuted)"
      >
        {{ user.isMuted ? "Unmute" : "Mute" }}
      </button>

      <button
        class="cursor-pointer text-sm text-error-600 hover:underline disabled:opacity-50"
        :disabled="adminStore.state.isLoading"
        @click="handleBan(user.id)"
      >
        Ban
      </button>
    </div>
  </li>
</template>
