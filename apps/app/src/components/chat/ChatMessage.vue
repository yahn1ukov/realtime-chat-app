<script setup lang="ts">
import type { GetChatMessageResponseDto } from "@chat/shared";
import { useTimeAgo } from "@vueuse/core";
import { computed } from "vue";

interface Props {
  message: GetChatMessageResponseDto;
}

const props = defineProps<Props>();

const timeAgo = useTimeAgo(computed(() => props.message.createdAt));
</script>

<template>
  <div class="flex flex-col gap-0.5" :style="{ color: message.author.color }">
    <span class="text-sm font-bold">{{ message.author.username }}</span>

    <p class="text-sm">{{ message.content }}</p>

    <span class="text-xs opacity-60">{{ timeAgo }}</span>
  </div>
</template>
