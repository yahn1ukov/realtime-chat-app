<script setup lang="ts">
import Button from "@/components/app/Button.vue";
import { useAuthStore } from "@/stores/auth";
import { ROUTE } from "@/utils/constants/route.constant";
import { useRouter } from "vue-router";

const router = useRouter();

const isSideOpen = defineModel<boolean>({ required: true });

const store = useAuthStore();

async function handleLogout() {
  await store.logout();

  router.push({ name: ROUTE.AUTH });
}
</script>

<template>
  <nav class="flex items-center justify-between p-3 border-b border-gray-200">
    <Button type="button" :label="isSideOpen ? 'Hide' : 'Show'" @click="isSideOpen = !isSideOpen" />

    <Button type="button" label="Logout" @click="handleLogout" />
  </nav>
</template>
