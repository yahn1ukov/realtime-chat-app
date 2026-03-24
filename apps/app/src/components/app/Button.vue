<script setup lang="ts">
interface Props {
  type: "button" | "submit";
  label: string;
  disabled?: boolean;
}

defineProps<Props>();
</script>

<template>
  <button
    :type
    :disabled
    class="rounded-lg cursor-pointer bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 active:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {{ label }}
  </button>
</template>
