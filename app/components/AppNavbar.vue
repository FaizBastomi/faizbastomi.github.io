<script setup lang="ts">
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBars, faCode, faXmark } from '@fortawesome/free-solid-svg-icons';

defineProps<{
  hasBlogs?: boolean;
  hasSocials?: boolean;
}>();

const showGithub = ref(false);
const isMenuOpen = ref(false);

const closeMenu = () => {
  isMenuOpen.value = false;
};

// ponytail: close burger menu when user returns to hero section or hits escape
watch(showGithub, (shown) => {
  if (!shown) isMenuOpen.value = false;
});

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMenuOpen.value) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);

  const hero = document.getElementById('about');
  if (!hero || !('IntersectionObserver' in window)) {
    showGithub.value = true;
    return;
  }

  // reveal navbar GitHub button only after hero section leaves viewport
  const observer = new IntersectionObserver(
    ([entry]) => {
      showGithub.value = !entry.isIntersecting;
    },
    { threshold: 0.1 },
  );

  observer.observe(hero);

  onUnmounted(() => {
    observer.disconnect();
    window.removeEventListener('keydown', handleKeydown);
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
        @click="closeMenu"
      >
        <FontAwesomeIcon :icon="faCode" class="text-sm text-[#89b4fa]" aria-hidden="true" />
        <span>faizdev</span>
      </a>

      <!-- Desktop Navigation: always visible on tablet/desktop -->
      <nav class="hidden sm:flex sm:items-center sm:gap-2" aria-label="Desktop navigation">
        <a
          href="#about"
          class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        >
          About
        </a>
        <a
          href="#projects"
          class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        >
          Projects
        </a>
        <a
          href="#skills"
          class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        >
          Skills
        </a>
        <a
          v-if="hasBlogs"
          href="#blogs"
          class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        >
          Blogs
        </a>
        <a
          v-if="hasSocials"
          href="#social"
          class="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
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
            class="ms-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-[#45475a] bg-[#181825] px-3 py-1.5 text-sm font-medium text-[#cdd6f4] transition-colors hover:border-[#89b4fa] hover:text-[#89b4fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
            aria-label="GitHub profile (opens in new tab)"
          >
            <FontAwesomeIcon :icon="faGithub" class="text-sm" aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </Transition>
      </nav>

      <!-- Mobile Navigation: sm:hidden -->
      <nav class="flex items-center gap-1.5 sm:hidden" aria-label="Mobile navigation">
        <!-- When GitHub button is hidden at top: show horizontal links -->
        <template v-if="!showGithub">
          <a
            href="#about"
            class="inline-flex min-h-11 items-center rounded-lg px-2 py-1.5 text-xs font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
          >
            About
          </a>
          <a
            href="#projects"
            class="inline-flex min-h-11 items-center rounded-lg px-2 py-1.5 text-xs font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
          >
            Projects
          </a>
          <a
            href="#skills"
            class="inline-flex min-h-11 items-center rounded-lg px-2 py-1.5 text-xs font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
          >
            Skills
          </a>
          <a
            v-if="hasBlogs"
            href="#blogs"
            class="inline-flex min-h-11 items-center rounded-lg px-2 py-1.5 text-xs font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
          >
            Blogs
          </a>
          <a
            v-if="hasSocials"
            href="#social"
            class="inline-flex min-h-11 items-center rounded-lg px-2 py-1.5 text-xs font-medium text-[#a6adc8] transition-colors hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
          >
            Social
          </a>
        </template>

        <!-- When GitHub button is shown: group navigation into burger menu -->
        <template v-else>
          <a
            href="https://github.com/FaizBastomi"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#45475a] bg-[#181825] text-[#cdd6f4] transition-colors hover:border-[#89b4fa] hover:text-[#89b4fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
            aria-label="GitHub profile (opens in new tab)"
          >
            <FontAwesomeIcon :icon="faGithub" class="text-base" aria-hidden="true" />
          </a>

          <button
            type="button"
            class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#45475a] bg-[#181825] text-[#cdd6f4] transition-colors hover:border-[#89b4fa] hover:text-[#89b4fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
            :aria-expanded="isMenuOpen"
            aria-controls="mobile-nav-menu"
            aria-label="Toggle navigation menu"
            @click="isMenuOpen = !isMenuOpen"
          >
            <FontAwesomeIcon :icon="isMenuOpen ? faXmark : faBars" class="text-base" aria-hidden="true" />
          </button>
        </template>
      </nav>
    </div>

    <!-- Mobile Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform opacity-0 -translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-2"
    >
      <div
        v-if="showGithub && isMenuOpen"
        id="mobile-nav-menu"
        class="border-t border-[#313244]/80 bg-[#181825]/95 px-4 py-3 shadow-xl shadow-[#11111b]/50 backdrop-blur-md sm:hidden"
      >
        <div class="flex flex-col gap-1">
          <a
            href="#about"
            class="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-[#cdd6f4] transition-colors hover:bg-[#313244]/50 hover:text-[#89b4fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
            @click="closeMenu"
          >
            About
          </a>
          <a
            href="#projects"
            class="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-[#cdd6f4] transition-colors hover:bg-[#313244]/50 hover:text-[#89b4fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
            @click="closeMenu"
          >
            Projects
          </a>
          <a
            href="#skills"
            class="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-[#cdd6f4] transition-colors hover:bg-[#313244]/50 hover:text-[#89b4fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
            @click="closeMenu"
          >
            Skills
          </a>
          <a
            v-if="hasBlogs"
            href="#blogs"
            class="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-[#cdd6f4] transition-colors hover:bg-[#313244]/50 hover:text-[#89b4fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
            @click="closeMenu"
          >
            Blogs
          </a>
          <a
            v-if="hasSocials"
            href="#social"
            class="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-[#cdd6f4] transition-colors hover:bg-[#313244]/50 hover:text-[#89b4fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
            @click="closeMenu"
          >
            Social
          </a>
        </div>
      </div>
    </Transition>
  </header>
</template>
