<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const secret = (config.dashboardPath as string) || '';
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug || '';

if (!secret || (slug !== secret && slug !== `${secret}/login`)) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found', fatal: true });
}

const isLoginRoute = computed(() => slug === `${secret}/login`);

const { data: auth } = await useFetch('/api/dashboard/auth-status');

if (!isLoginRoute.value && !auth.value?.authed) {
  await navigateTo(`/${secret}/login`);
} else if (isLoginRoute.value && auth.value?.authed) {
  await navigateTo(`/${secret}`);
}

useHead({
  title: isLoginRoute.value ? 'Login' : 'Dashboard',
});
</script>

<template>
  <div>
    <DashboardLoginView v-if="isLoginRoute" />
    <DashboardView v-else />
  </div>
</template>
