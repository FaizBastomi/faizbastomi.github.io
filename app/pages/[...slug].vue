<script setup lang="ts">
definePageMeta({
  key: (route) => route.fullPath,
});

const route = useRoute();

// ponytail: normalize slug parameter array or string into clean path
const slug = computed(() => {
  const s = route.params.slug;
  return (Array.isArray(s) ? s.join('/') : s || '').replace(/^\/+|\/+$/g, '');
});

const { data: session, error } = await useFetch('/api/dashboard/session', {
  query: { slug },
});

if (error.value || !session.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found', fatal: true });
}

if (!session.value.isLogin && !session.value.authed) {
  await navigateTo(`/${session.value.dashboardPath}/login`);
} else if (session.value.isLogin && session.value.authed) {
  await navigateTo(`/${session.value.dashboardPath}`);
}

useHead({
  title: computed(() => (session.value?.isLogin ? 'Login' : 'Dashboard')),
});
</script>

<template>
  <div class="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
    <DashboardLoginView v-if="session?.isLogin" />
    <DashboardView v-else />
  </div>
</template>
