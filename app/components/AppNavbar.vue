<script setup lang="ts">
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons';

defineProps<{
  hasBlogs?: boolean;
  hasSocials?: boolean;
}>();

const showGithub = ref(false);

onMounted(() => {
  const hero = document.getElementById('about');
  if (!hero || !('IntersectionObserver' in window)) {
    showGithub.value = true;
    return;
  }

  // ponytail: reveal navbar GitHub button only after hero section leaves viewport
  const observer = new IntersectionObserver(
    ([entry]) => {
      showGithub.value = !entry.isIntersecting;
    },
    { threshold: 0.1 },
  );

  observer.observe(hero);

  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-[#313244]/80 bg-[#1e1e2e]/90 backdrop-blur-md">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 md:px-8">
      <a
        href="#about"
        class="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-[#cdd6f4] transition-colors hover:text-[#89b4fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        aria-label="Faiz Bastomi home"
      >
        <FontAwesomeIcon :icon="faCode" class="text-sm text-[#89b4fa]" aria-hidden="true" />
        <span>faizdev</span>
      </a>

      <nav class="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
        <a
          href="#about"
          class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-xs font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa] sm:text-sm"
        >
          About
        </a>
        <a
          href="#projects"
          class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-xs font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa] sm:text-sm"
        >
          Projects
        </a>
        <a
          href="#skills"
          class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-xs font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa] sm:text-sm"
        >
          Skills
        </a>
        <a
          v-if="hasBlogs"
          href="#blogs"
          class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-xs font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa] sm:text-sm"
        >
          Blogs
        </a>
        <a
          v-if="hasSocials"
          href="#social"
          class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-xs font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa] sm:text-sm"
        >
          Social
        </a>

        <Transition
          enter-active-class="transition-opacity duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <a
            v-if="showGithub"
            href="https://github.com/FaizBastomi"
            target="_blank"
            rel="noopener noreferrer"
            class="ms-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-[#45475a] bg-[#181825] px-3 py-1.5 text-xs font-medium text-[#cdd6f4] transition-colors hover:border-[#89b4fa] hover:text-[#89b4fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa] sm:text-sm"
            aria-label="GitHub profile (opens in new tab)"
          >
            <FontAwesomeIcon :icon="faGithub" class="text-sm" aria-hidden="true" />
            <span class="hidden sm:inline">GitHub</span>
          </a>
        </Transition>
      </nav>
    </div>
  </header>
</template>
