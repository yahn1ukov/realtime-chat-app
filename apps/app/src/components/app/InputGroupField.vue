<script setup lang="ts">
interface Props {
  id: string;
  label?: string;
  type: "text" | "password";
  disabled?: boolean;
}

defineProps<Props>();
const model = defineModel<string>({ required: true });
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      :id
      v-model="model"
      :type
      :disabled
      class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:opacity-50"
    />
  </div>
</template>
