<script setup lang="ts">
import { faFolder, faLayerGroup, faRightFromBracket, faArrowUpRightFromSquare, faCode } from '@fortawesome/free-solid-svg-icons';

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
  <div class="flex h-full flex-col overflow-hidden md:flex-row">
    <!-- Left Sidebar: stationary navigation panel -->
    <aside
      class="flex w-full flex-shrink-0 flex-col justify-between border-b border-[#313244] bg-[#181825] p-5 md:h-full md:w-64 md:overflow-y-auto md:border-r md:border-b-0 lg:w-72"
      aria-label="Dashboard sidebar"
    >
      <div>
        <!-- Sidebar Branding -->
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#313244] bg-[#1e1e2e] text-[#89b4fa]"
            aria-hidden="true"
          >
            <FontAwesomeIcon :icon="faCode" class="text-base" />
          </div>
          <div class="min-w-0">
            <h2 class="text-sm font-bold tracking-tight text-[#cdd6f4]">Admin Console</h2>
            <p class="truncate text-xs text-[#a6adc8]">Faiz Bastomi Portfolio</p>
          </div>
        </div>

        <!-- Sidebar Navigation Buttons -->
        <nav class="mt-6 flex flex-col gap-1.5" aria-label="Dashboard sections">
          <button
            type="button"
            class="flex min-h-11 w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
            :class="
              activeTab === 'projects'
                ? 'bg-[#89b4fa] font-semibold text-[#1e1e2e] shadow-sm'
                : 'text-[#a6adc8] hover:bg-[#1e1e2e] hover:text-[#cdd6f4]'
            "
            :aria-selected="activeTab === 'projects'"
            @click="activeTab = 'projects'"
          >
            <span class="inline-flex items-center gap-2.5">
              <FontAwesomeIcon :icon="faFolder" class="text-xs" aria-hidden="true" />
              <span>Project Manager</span>
            </span>
            <span
              class="rounded-full px-2 py-0.5 text-xs font-semibold"
              :class="activeTab === 'projects' ? 'bg-[#1e1e2e]/20 text-[#1e1e2e]' : 'bg-[#313244] text-[#a6adc8]'"
            >
              {{ projects.length }}
            </span>
          </button>

          <button
            type="button"
            class="flex min-h-11 w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
            :class="
              activeTab === 'skills'
                ? 'bg-[#89b4fa] font-semibold text-[#1e1e2e] shadow-sm'
                : 'text-[#a6adc8] hover:bg-[#1e1e2e] hover:text-[#cdd6f4]'
            "
            :aria-selected="activeTab === 'skills'"
            @click="activeTab = 'skills'"
          >
            <span class="inline-flex items-center gap-2.5">
              <FontAwesomeIcon :icon="faLayerGroup" class="text-xs" aria-hidden="true" />
              <span>Skill Manager</span>
            </span>
            <span
              class="rounded-full px-2 py-0.5 text-xs font-semibold"
              :class="activeTab === 'skills' ? 'bg-[#1e1e2e]/20 text-[#1e1e2e]' : 'bg-[#313244] text-[#a6adc8]'"
            >
              {{ skills.length }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Sidebar Bottom Utilities -->
      <div class="mt-6 flex flex-col gap-2 border-t border-[#313244] pt-5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-[#a6adc8] transition-colors hover:bg-[#1e1e2e] hover:text-[#cdd6f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        >
          <span>View Public Site</span>
          <FontAwesomeIcon :icon="faArrowUpRightFromSquare" class="text-[10px]" aria-hidden="true" />
        </a>

        <button
          type="button"
          :disabled="isLoggingOut"
          class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#f38ba8]/50 bg-[#1e1e2e] px-4 py-2 text-xs font-semibold text-[#f38ba8] transition-colors hover:bg-[#f38ba8]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f38ba8] disabled:opacity-50"
          @click="onLogout"
        >
          <FontAwesomeIcon :icon="faRightFromBracket" class="text-xs" aria-hidden="true" />
          <span>{{ isLoggingOut ? 'Logging out...' : 'Sign Out' }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area: independently scrollable workspace -->
    <section class="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 md:p-8" aria-label="Dashboard workspace">
      <header class="mb-6 border-b border-[#313244] pb-4">
        <h1 class="text-2xl font-bold tracking-tight text-[#cdd6f4]">
          {{ activeTab === 'projects' ? 'Project Manager' : 'Skill Manager' }}
        </h1>
        <p class="mt-1 text-xs text-[#a6adc8] sm:text-sm">
          {{
            activeTab === 'projects'
              ? 'Manage, reorder, and publish portfolio project showcase entries.'
              : 'Manage technical competencies, reorder priorities, and view vector icons.'
          }}
        </p>
      </header>

      <DashboardProjectsManager v-if="activeTab === 'projects'" :projects="projects" @refresh="refreshProjects" />

      <DashboardSkillsManager v-else-if="activeTab === 'skills'" :skills="skills" @refresh="refreshSkills" />
    </section>
  </div>
</template>
