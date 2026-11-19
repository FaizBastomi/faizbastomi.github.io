<script setup lang="ts">
import { faArrowUpRightFromSquare, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

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
  <div class="grid auto-rows-auto grid-cols-1 gap-6 md:grid-cols-3">
    <article
      v-for="project in projects"
      :key="project.id"
      class="overflow-hidden rounded-xl border border-[#89b4fa] bg-[#1e1e2e] transition-all hover:shadow-lg hover:shadow-[#89b4fa]/20"
    >
      <div class="relative h-52 w-full overflow-hidden">
        <img
          v-if="project.image"
          :src="project.image"
          :alt="project.name"
          width="400"
          height="208"
          loading="lazy"
          class="h-full w-full object-cover"
        />
        <div v-else class="flex h-full w-full items-center justify-center bg-[#313244]">
          <span class="text-lg font-semibold">{{ project.name }}</span>
        </div>
      </div>
      <div class="p-4">
        <div v-if="project.archived" class="flex items-center justify-between">
          <h3 class="mb-2 text-lg font-bold">{{ project.name }}</h3>
          <span
            class="group relative cursor-help px-2 py-1 text-[#fab387]"
            tabindex="0"
            role="status"
            aria-label="Archived project"
          >
            <FontAwesomeIcon class="me-1" :icon="faTriangleExclamation" style="font-size: 18px" />
            <span
              class="invisible absolute -top-6 -right-2 rounded bg-[#313244] px-2 py-1 text-xs group-hover:visible group-focus-visible:visible"
            >
              Archived
            </span>
          </span>
        </div>
        <h3 v-else class="mb-2 text-lg font-bold">{{ project.name }}</h3>
        <p class="mb-3 text-sm text-[#858aa0]">{{ project.description }}</p>
        <div class="mb-3 flex flex-wrap gap-2">
          <span v-for="(tech, index) in project.technologies" :key="index" class="rounded-full bg-[#313244] px-2 py-1 text-xs">
            {{ tech }}
          </span>
        </div>
        <a
          :href="project.githubUrl"
          class="inline-flex min-h-11 items-center py-2 text-sm text-[#cacede] hover:text-[#89b4fa]"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Project
          <FontAwesomeIcon class="ms-1.5" :icon="faArrowUpRightFromSquare" style="font-size: 12px" />
        </a>
      </div>
    </article>
  </div>
</template>
