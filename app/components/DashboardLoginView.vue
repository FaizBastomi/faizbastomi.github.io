<script setup lang="ts">
import { faCode } from '@fortawesome/free-solid-svg-icons';

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
  <div class="flex min-h-screen flex-col items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">
      <div class="mb-6 text-center">
        <div
          class="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#313244] bg-[#181825] text-[#89b4fa]"
        >
          <FontAwesomeIcon :icon="faCode" class="text-xl" aria-hidden="true" />
        </div>
        <h1 class="mt-4 text-2xl font-bold tracking-tight text-[#cdd6f4]">Administrator Access</h1>
        <p class="mt-1 text-xs text-[#a6adc8]">Enter dashboard password to manage portfolio content</p>
      </div>

      <div class="rounded-xl border border-[#313244] bg-[#181825] p-6 shadow-xl shadow-[#11111b]/50">
        <form class="space-y-4" @submit.prevent="onSubmit">
          <label class="block">
            <span class="mb-1.5 block text-xs font-medium text-[#cdd6f4]">Password</span>
            <input
              v-model="password"
              type="password"
              required
              autofocus
              placeholder="Enter password"
              class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
            />
          </label>

          <p v-if="error" role="alert" class="rounded-lg bg-[#f38ba8]/10 p-2 text-xs font-medium text-[#f38ba8]">
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="loading"
            class="min-h-11 w-full rounded-lg bg-[#89b4fa] px-4 py-2 text-sm font-semibold text-[#1e1e2e] transition-colors hover:bg-[#89b4fa]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa] disabled:opacity-50"
          >
            {{ loading ? 'Verifying...' : 'Sign In' }}
          </button>
        </form>
      </div>

      <div class="mt-6 text-center">
        <a href="/" class="text-xs text-[#a6adc8] transition-colors hover:text-[#89b4fa]"> Return to home page </a>
      </div>
    </div>
  </div>
</template>
