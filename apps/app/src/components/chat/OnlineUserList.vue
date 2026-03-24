<script setup lang="ts">
import type { GetOnlineUserResponseDto } from "@chat/shared";
import OnlineUserListItem from "./OnlineUserListItem.vue";

interface Props {
  users: GetOnlineUserResponseDto[];
}

defineProps<Props>();
</script>

<template>
  <ul class="flex flex-col gap-2">
    <OnlineUserListItem v-for="user in users" :key="user.id" :user />
  </ul>
</template>
