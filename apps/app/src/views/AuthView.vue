<script setup lang="ts">
import Button from "@/components/app/Button.vue";
import InputGroupField from "@/components/app/InputGroupField.vue";
import Message from "@/components/app/Message.vue";
import { useAuthStore } from "@/stores/auth";
import { ROUTE } from "@/utils/constants/route.constant";
import type { AuthRequestDto } from "@chat/shared";
import { storeToRefs } from "pinia";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const store = useAuthStore();
const { state } = storeToRefs(store);

const formState = reactive<AuthRequestDto>({
  username: "",
  password: "",
});

async function handleSubmit() {
  await store.auth({
    username: formState.username,
    password: formState.password,
  });

  if (store.isAuthenticated) {
    router.push({ name: ROUTE.CHAT });
  }
}
</script>

<template>
  <div class="flex flex-1 items-center justify-center px-2">
    <div class="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2">
      <h1 class="text-2xl font-bold text-center">Welcome</h1>

      <Message v-if="state.isLoading" message="Loading..." />

      <Message v-if="state.error" :message="state.error.message" type="error" />

      <form class="flex flex-col gap-3" @submit.prevent="handleSubmit">
        <InputGroupField
          id="username"
          label="Username"
          type="text"
          v-model="formState.username"
          :disabled="state.isLoading"
        />

        <InputGroupField
          id="password"
          label="Password"
          type="password"
          v-model="formState.password"
          :disabled="state.isLoading"
        />

        <Button type="submit" label="Authorize" :disabled="state.isLoading" class="w-full" />
      </form>
    </div>
  </div>
</template>
