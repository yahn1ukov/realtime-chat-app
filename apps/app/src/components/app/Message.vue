<script setup lang="ts">
import { MESSAGE_TYPE } from "@/utils/constants/message.constant";
import type { MessageType } from "@/utils/types/message.type";
import { computed } from "vue";

interface Props {
  message: string;
  type?: MessageType;
}

const props = defineProps<Props>();

const styles = {
  [MESSAGE_TYPE.INFO]: "text-black/60 border-black/20 bg-black/5",
  [MESSAGE_TYPE.ERROR]: "text-error-600 border-error-300 bg-error-50",
};

const classes = computed(() => styles[props.type ?? MESSAGE_TYPE.INFO]);
</script>

<template>
  <p class="px-2 py-1 rounded-md border text-sm text-center" :class="classes">{{ message }}</p>
</template>
