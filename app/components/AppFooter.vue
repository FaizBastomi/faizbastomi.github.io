<script setup lang="ts">
import { faFont, faLayerGroup, faPalette } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
</script>

<template>
  <footer class="border-t border-[#313244]/80 bg-[#181825] text-xs text-[#a6adc8]">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 md:px-8">
      <div class="flex items-center text-center sm:text-left">
        <span class="font-medium text-[#cdd6f4]">Faiz Bastomi</span>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <a
          href="https://github.com/catppuccin"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center gap-1.5 px-2 text-[#a6adc8] transition-colors hover:text-[#eba0ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        >
          <FontAwesomeIcon :icon="faPalette" class="text-xs" aria-hidden="true" />
          <span>Catppuccin</span>
        </a>

        <a
          href="https://fonts.google.com/specimen/Plus+Jakarta+Sans"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center gap-1.5 px-2 text-[#a6adc8] transition-colors hover:text-[#eba0ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        >
          <FontAwesomeIcon :icon="faFont" class="text-xs" aria-hidden="true" />
          <span>Plus Jakarta Sans</span>
        </a>

        <a
          href="https://nuxt.com"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center gap-1.5 px-2 text-[#a6adc8] transition-colors hover:text-[#eba0ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        >
          <FontAwesomeIcon :icon="faLayerGroup" class="text-xs" aria-hidden="true" />
          <span>Nuxt</span>
        </a>

        <a
          href="https://github.com/FaizBastomi/faizbastomi.github.io"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center gap-1.5 px-2 font-medium text-[#89b4fa] transition-colors hover:text-[#b4befe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        >
          <FontAwesomeIcon :icon="faGithub" class="text-xs" aria-hidden="true" />
          <span>Repository</span>
        </a>
      </div>
    </div>
  </footer>
</template>
