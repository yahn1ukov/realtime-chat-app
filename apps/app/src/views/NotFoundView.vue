<template>
  <div class="flex flex-1 flex-col items-center justify-center gap-4 p-2">
    <p class="text-7xl font-bold text-primary-600">404</p>

    <h1 class="text-2xl font-semibold text-gray-800">Page not found</h1>

    <RouterLink
      to="/"
      class="rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 active:bg-primary-800"
    >
      Go home
    </RouterLink>
  </div>
</template>
