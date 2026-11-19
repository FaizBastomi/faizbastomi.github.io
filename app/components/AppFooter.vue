<script setup lang="ts">
import { faFont, faLayerGroup, faPalette, faFontAwesome } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
</script>

<template>
  <footer class="flex flex-row items-end justify-between p-3 text-sm">
    <div class="flex flex-col md:flex-row md:gap-x-4">
      <a
        class="flex min-h-11 items-center py-2 text-[#858aa0] hover:text-[#eba0ac] hover:underline md:min-h-0 md:py-0"
        href="https://fonts.google.com/specimen/Plus+Jakarta+Sans"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon class="me-1.5" :icon="faFont" style="font-size: 14px" />
        Plus Jakarta Sans
      </a>
      <a
        class="flex min-h-11 items-center py-2 text-[#858aa0] hover:text-[#eba0ac] hover:underline md:min-h-0 md:py-0"
        href="https://nuxt.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon class="me-1.5" :icon="faLayerGroup" style="font-size: 14px" />
        Nuxt
      </a>
      <a
        class="flex min-h-11 items-center py-2 text-[#858aa0] hover:text-[#eba0ac] hover:underline md:min-h-0 md:py-0"
        href="https://github.com/catppuccin"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon class="me-1.5" :icon="faPalette" style="font-size: 14px" />
        Catppuccin
      </a>
      <a
        class="flex min-h-11 items-center py-2 text-[#858aa0] hover:text-[#eba0ac] hover:underline md:min-h-0 md:py-0"
        href="https://fontawesome.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon class="me-1.5" :icon="faFontAwesome" style="font-size: 14px" />
        Fontawesome
      </a>
    </div>
    <a
      class="flex min-h-11 items-center py-2 text-[#858aa0] hover:text-[#eba0ac] md:min-h-0 md:py-0"
      href="https://github.com/FaizBastomi/faizbastomi.github.io"
      target="_blank"
      rel="noopener noreferrer"
    >
      Clone on Github
      <FontAwesomeIcon class="ms-1.5" :icon="faGithub" style="font-size: 14px" />
    </a>
  </footer>
</template>
