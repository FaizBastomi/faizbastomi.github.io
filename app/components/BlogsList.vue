<script setup lang="ts">
import { faArrowRight, faBookOpen, faCalendarDay, faClock } from '@fortawesome/free-solid-svg-icons';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

defineProps<{
  blogs: BlogPost[];
}>();

function formatDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <article
      v-for="blog in blogs"
      :key="blog.id"
      class="group flex flex-col justify-between rounded-xl border border-[#313244] bg-[#181825] p-6 transition-all hover:-translate-y-0.5 hover:border-[#89b4fa]/70 hover:shadow-lg hover:shadow-[#11111b]/50"
    >
      <div>
        <div class="flex items-center gap-3 text-xs text-[#a6adc8]">
          <span class="inline-flex items-center gap-1.5 font-medium">
            <FontAwesomeIcon :icon="faCalendarDay" class="text-[11px] text-[#89b4fa]" aria-hidden="true" />
            <time :datetime="new Date(blog.createdAt).toISOString()">{{ formatDate(blog.createdAt) }}</time>
          </span>
          <span class="h-1 w-1 rounded-full bg-[#45475a]" aria-hidden="true" />
          <span class="inline-flex items-center gap-1 text-[#858aa0]">
            <FontAwesomeIcon :icon="faClock" class="text-[10px]" aria-hidden="true" />
            <span>Article</span>
          </span>
        </div>

        <h3 class="mt-3 text-lg font-bold tracking-tight text-[#cdd6f4] transition-colors group-hover:text-[#89b4fa]">
          {{ blog.title }}
        </h3>

        <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-[#a6adc8]">
          {{ blog.description || 'Read article for technical insights and engineering notes.' }}
        </p>
      </div>

      <div class="mt-6 border-t border-[#313244]/60 pt-4">
        <NuxtLink
          :to="'/blog/' + blog.slug"
          class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#89b4fa] transition-colors hover:text-[#b4befe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
          :aria-label="`Read article: ${blog.title}`"
        >
          <FontAwesomeIcon :icon="faBookOpen" class="text-xs" aria-hidden="true" />
          <span>Read Article</span>
          <FontAwesomeIcon
            :icon="faArrowRight"
            class="text-xs transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </article>
  </div>
</template>
