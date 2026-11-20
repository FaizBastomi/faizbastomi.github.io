<script setup lang="ts">
import { faArrowUpRightFromSquare, faTriangleExclamation, faCode } from '@fortawesome/free-solid-svg-icons';

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  technologies: string[];
  githubUrl: string;
  archived: boolean;
  position?: number;
}

defineProps<{
  projects: ProjectItem[];
}>();
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <article
      v-for="project in projects"
      :key="project.id"
      class="group flex flex-col justify-between overflow-hidden rounded-xl border border-[#313244] bg-[#181825] transition-all hover:border-[#89b4fa]/70 hover:shadow-lg hover:shadow-[#11111b]/50"
    >
      <div>
        <div class="relative aspect-video w-full overflow-hidden border-b border-[#313244] bg-[#11111b]">
          <img
            v-if="project.image"
            :src="project.image"
            :alt="`${project.name} preview`"
            width="400"
            height="225"
            loading="lazy"
            class="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
          <div v-else class="flex h-full w-full flex-col items-center justify-center p-6 text-center">
            <FontAwesomeIcon
              :icon="faCode"
              class="text-3xl text-[#45475a] transition-colors group-hover:text-[#89b4fa]"
              aria-hidden="true"
            />
            <span class="mt-2 text-xs font-medium text-[#858aa0]">Repository Service</span>
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-lg font-bold tracking-tight text-[#cdd6f4] transition-colors group-hover:text-[#89b4fa]">
              {{ project.name }}
            </h3>
            <span
              v-if="project.archived"
              class="inline-flex items-center gap-1 rounded-md bg-[#fab387]/15 px-2 py-0.5 text-xs font-medium text-[#fab387]"
              role="status"
              title="This project is archived and read-only"
            >
              <FontAwesomeIcon :icon="faTriangleExclamation" class="text-[10px]" aria-hidden="true" />
              <span>Archived</span>
            </span>
          </div>

          <p class="mt-2.5 text-sm leading-relaxed text-[#a6adc8]">
            {{ project.description }}
          </p>

          <div class="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
            <span
              v-for="(tech, index) in project.technologies"
              :key="index"
              class="rounded-md border border-[#313244] bg-[#1e1e2e] px-2 py-0.5 text-xs font-medium text-[#cdd6f4]"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </div>

      <div class="border-t border-[#313244]/60 px-5 py-3">
        <a
          :href="project.githubUrl"
          :aria-label="`View source code for ${project.name} on GitHub (opens in new tab)`"
          class="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[#89b4fa] transition-colors hover:text-[#b4befe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Source Code</span>
          <FontAwesomeIcon :icon="faArrowUpRightFromSquare" class="text-xs" aria-hidden="true" />
        </a>
      </div>
    </article>
  </div>
</template>
