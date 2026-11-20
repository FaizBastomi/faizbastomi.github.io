<script setup lang="ts">
import { faFolder, faLayerGroup, faRightFromBracket, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

interface Skill {
  id: string;
  name: string;
  position: number;
  svg?: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string;
  image: string | null;
  technologies: string[];
  githubUrl: string;
  archived: boolean;
  position: number;
}

const activeTab = ref<'projects' | 'skills'>('projects');
const isLoggingOut = ref(false);

const { data: skills, refresh: refreshSkills } = await useFetch<Skill[]>('/api/skills', {
  default: () => [],
});

const { data: projects, refresh: refreshProjects } = await useFetch<Project[]>('/api/projects', {
  default: () => [],
});

async function onLogout() {
  isLoggingOut.value = true;
  try {
    const res = await $fetch<{ redirect: string }>('/api/dashboard/logout', { method: 'POST' });
    await navigateTo(res.redirect);
  } finally {
    isLoggingOut.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:px-8">
    <!-- Top Administrative Header -->
    <header class="mb-8 flex flex-col gap-4 border-b border-[#313244] pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-[#cdd6f4] sm:text-3xl">Dashboard</h1>
        <p class="mt-1 text-xs text-[#a6adc8] sm:text-sm">Manage portfolio projects and technical capabilities</p>
      </div>

      <div class="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-[#45475a] bg-[#181825] px-3.5 py-1.5 text-xs font-medium text-[#cdd6f4] transition-colors hover:border-[#89b4fa] hover:text-[#89b4fa]"
        >
          <span>View Site</span>
          <FontAwesomeIcon :icon="faArrowUpRightFromSquare" class="text-[10px]" aria-hidden="true" />
        </a>

        <button
          type="button"
          :disabled="isLoggingOut"
          class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#f38ba8]/60 bg-[#181825] px-4 py-1.5 text-xs font-semibold text-[#f38ba8] transition-colors hover:bg-[#f38ba8]/10 disabled:opacity-50"
          @click="onLogout"
        >
          <FontAwesomeIcon :icon="faRightFromBracket" class="text-xs" aria-hidden="true" />
          <span>{{ isLoggingOut ? 'Logging out...' : 'Logout' }}</span>
        </button>
      </div>
    </header>

    <!-- Manager Navigation Tabs -->
    <nav class="mb-6 flex border-b border-[#313244]" aria-label="Dashboard sections">
      <button
        type="button"
        class="inline-flex min-h-11 items-center gap-2 border-b-2 px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        :class="
          activeTab === 'projects'
            ? 'border-[#89b4fa] text-[#89b4fa]'
            : 'border-transparent text-[#a6adc8] hover:border-[#45475a] hover:text-[#cdd6f4]'
        "
        :aria-selected="activeTab === 'projects'"
        @click="activeTab = 'projects'"
      >
        <FontAwesomeIcon :icon="faFolder" class="text-xs" aria-hidden="true" />
        <span>Project Manager</span>
        <span
          class="rounded-full px-2 py-0.5 text-xs"
          :class="activeTab === 'projects' ? 'bg-[#89b4fa]/20 text-[#89b4fa]' : 'bg-[#313244] text-[#a6adc8]'"
        >
          {{ projects.length }}
        </span>
      </button>

      <button
        type="button"
        class="inline-flex min-h-11 items-center gap-2 border-b-2 px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        :class="
          activeTab === 'skills'
            ? 'border-[#89b4fa] text-[#89b4fa]'
            : 'border-transparent text-[#a6adc8] hover:border-[#45475a] hover:text-[#cdd6f4]'
        "
        :aria-selected="activeTab === 'skills'"
        @click="activeTab = 'skills'"
      >
        <FontAwesomeIcon :icon="faLayerGroup" class="text-xs" aria-hidden="true" />
        <span>Skill Manager</span>
        <span
          class="rounded-full px-2 py-0.5 text-xs"
          :class="activeTab === 'skills' ? 'bg-[#89b4fa]/20 text-[#89b4fa]' : 'bg-[#313244] text-[#a6adc8]'"
        >
          {{ skills.length }}
        </span>
      </button>
    </nav>

    <!-- Active Section View -->
    <main>
      <DashboardProjectsManager v-if="activeTab === 'projects'" :projects="projects" @refresh="refreshProjects" />

      <DashboardSkillsManager v-else-if="activeTab === 'skills'" :skills="skills" @refresh="refreshSkills" />
    </main>
  </div>
</template>
