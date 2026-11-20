<script setup lang="ts">
const route = useRoute();

// ponytail: on dashboard routes, lock viewport height so sidebar and footer remain fixed while content scrolls
const isDashboard = computed(() => route.path !== '/');
</script>

<template>
  <div :class="['flex antialiased', isDashboard ? 'h-screen flex-col overflow-hidden' : 'min-h-screen flex-col']">
    <main :class="['flex-1', isDashboard ? 'min-h-0 overflow-hidden' : '']">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>
