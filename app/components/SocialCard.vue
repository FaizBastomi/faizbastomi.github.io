<script setup lang="ts">
import { faArrowUpRightFromSquare, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { getSocialIcon } from '~~/shared/utils/social';

interface SocialLink {
  id: string;
  name: string;
  url: string;
  handle?: string | null;
  icon?: string | null;
  position?: number;
  enabled?: boolean;
}

defineProps<{
  socials: SocialLink[];
}>();
</script>

<template>
  <section id="social" class="border-t border-[#313244]/60 px-4 py-16 sm:px-6 sm:py-20 md:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="mb-10 sm:mb-12">
        <p class="text-xs font-semibold tracking-wider text-[#89b4fa] uppercase">Network</p>
        <h2 class="mt-1 text-2xl font-bold tracking-tight text-[#cdd6f4] sm:text-3xl md:text-4xl">Social</h2>
        <p class="mt-2 max-w-2xl text-sm text-[#a6adc8] sm:text-base">
          Connect across developer platforms, social networks, and direct communication channels.
        </p>
      </div>

      <!-- Main Social Card Container -->
      <div class="rounded-2xl border border-[#313244] bg-[#181825] p-6 shadow-xl shadow-[#11111b]/40 sm:p-8 md:p-10">
        <div class="flex flex-col gap-6 border-b border-[#313244] pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="max-w-xl">
            <h3 class="text-xl font-bold tracking-tight text-[#cdd6f4] sm:text-2xl">Let's build something together</h3>
            <p class="mt-2 text-sm leading-relaxed text-[#a6adc8]">
              Open for collaboration, open source contributions, questions, or just a friendly developer chat.
            </p>
          </div>

          <div
            class="flex items-center gap-2 self-start rounded-xl border border-[#313244] bg-[#1e1e2e] px-4 py-2.5 text-xs font-medium text-[#89b4fa] lg:self-auto"
          >
            <FontAwesomeIcon :icon="faShareNodes" class="text-sm" aria-hidden="true" />
            <span>Available for opportunities</span>
          </div>
        </div>

        <!-- Social Grid -->
        <div v-if="socials && socials.length > 0" class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            v-for="social in socials"
            :key="social.id"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`Visit Faiz Bastomi on ${social.name} (opens in new tab)`"
            class="group flex min-h-11 items-center justify-between rounded-xl border border-[#313244] bg-[#1e1e2e] p-4 transition-all hover:-translate-y-0.5 hover:border-[#89b4fa]/70 hover:shadow-md hover:shadow-[#11111b]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
          >
            <div class="flex min-w-0 items-center gap-3.5">
              <div
                class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-[#313244] bg-[#181825] text-lg text-[#cdd6f4] transition-colors group-hover:border-[#89b4fa] group-hover:text-[#89b4fa]"
                aria-hidden="true"
              >
                <FontAwesomeIcon :icon="getSocialIcon(social.icon)" />
              </div>

              <div class="min-w-0">
                <span class="block truncate text-sm font-bold text-[#cdd6f4] transition-colors group-hover:text-[#89b4fa]">
                  {{ social.name }}
                </span>
                <span class="block truncate text-xs text-[#a6adc8]">
                  {{ social.handle || 'Visit Profile' }}
                </span>
              </div>
            </div>

            <FontAwesomeIcon
              :icon="faArrowUpRightFromSquare"
              class="ms-2 flex-shrink-0 text-xs text-[#45475a] transition-colors group-hover:text-[#89b4fa]"
              aria-hidden="true"
            />
          </a>
        </div>

        <div v-else class="mt-8 rounded-xl border border-[#313244] bg-[#1e1e2e] p-8 text-center text-sm text-[#a6adc8]">
          <p>Social profiles will appear here soon.</p>
        </div>
      </div>
    </div>
  </section>
</template>
