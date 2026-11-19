<script setup lang="ts">
import type { NuxtError } from '#app';
import { faPersonRunning } from '@fortawesome/free-solid-svg-icons';

defineProps<{
  error?: NuxtError;
}>();

useHead({
  title: 'Not Found',
});
</script>

<template>
  <div class="flex min-h-screen min-w-full flex-col bg-[#1e1e2e] text-[#cacede]">
    <div class="flex flex-1 items-center justify-center">
      <h1 class="mr-4 border-r-2 border-[#45475a] pr-4 text-4xl font-bold md:text-6xl">
        {{ error?.statusCode || 404 }}
      </h1>
      <div class="flex flex-col">
        <h2 class="text-lg md:text-2xl">
          {{ error?.statusCode === 404 ? "This page doesn't exist" : error?.statusMessage || 'An error occurred' }}
        </h2>
        <NuxtLink
          to="/"
          class="inline-flex min-h-11 items-center py-2 text-sm text-[#c6c6c6] hover:text-[#eba0ac] hover:underline md:text-lg"
        >
          <FontAwesomeIcon class="me-1.5 md:text-xl" :icon="faPersonRunning" style="font-size: 16px" />
          Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
