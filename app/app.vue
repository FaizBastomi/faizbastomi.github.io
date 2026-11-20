<script setup lang="ts">
const route = useRoute();

// ponytail: on dashboard routes, lock viewport so only the workspace scrolls without double window scrollbars
const isDashboard = computed(() => route.path !== '/');

useHead({
  htmlAttrs: {
    class: computed(() => (isDashboard.value ? 'h-full overflow-hidden' : '')),
  },
  bodyAttrs: {
    class: computed(() => (isDashboard.value ? 'h-full overflow-hidden' : '')),
  },
});
</script>

<template>
  <div :class="['flex antialiased', isDashboard ? 'h-full flex-col overflow-hidden' : 'min-h-screen flex-col']">
    <main :class="['flex-1', isDashboard ? 'flex min-h-0 flex-col overflow-hidden' : '']">
      <NuxtPage />
    </main>
    <AppFooter :class="isDashboard ? 'flex-shrink-0' : ''" />
  </div>
</template>
