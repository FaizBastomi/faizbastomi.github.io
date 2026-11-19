<script setup lang="ts">
const password = ref('');
const error = ref('');
const loading = ref(false);

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    const res = await $fetch<{ error?: string; redirect?: string }>('/api/dashboard/login', {
      method: 'POST',
      body: { password: password.value },
    });
    if (res.error) {
      error.value = res.error;
      return;
    }
    if (res.redirect) {
      await navigateTo(res.redirect);
    }
  } catch {
    error.value = 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <form class="w-full max-w-xs" @submit.prevent="onSubmit">
      <label class="block">
        <span class="mb-1 block text-xs text-[#858aa0]">Password</span>
        <input
          v-model="password"
          class="w-full rounded bg-[#313244] px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-[#89b4fa]"
          type="password"
          autofocus
          required
        />
      </label>
      <button
        type="submit"
        :disabled="loading"
        class="mt-3 min-h-11 w-full rounded bg-[#89b4fa] px-3 py-1 text-sm font-semibold text-[#1e1e2e] hover:bg-[#89b4fa]/90 disabled:opacity-50"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" role="alert" class="mt-2 text-sm text-[#f38ba8]">
        {{ error }}
      </p>
    </form>
  </div>
</template>
