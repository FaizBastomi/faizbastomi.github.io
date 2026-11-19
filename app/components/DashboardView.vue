<script setup lang="ts">
interface Skill {
  id: string;
  name: string;
  position: number;
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

const { data: skills, refresh: refreshSkills } = await useFetch<Skill[]>('/api/skills', {
  default: () => [],
});

const { data: projects, refresh: refreshProjects } = await useFetch<Project[]>('/api/projects', {
  default: () => [],
});

const card = 'rounded-lg border border-[#45475a] bg-[#181825] p-4';
const input = 'w-full rounded bg-[#313244] px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-[#89b4fa]';

const newSkillName = ref('');
const newProject = reactive({
  name: '',
  image: '',
  description: '',
  githubUrl: '',
  technologies: '',
});

const skillErrors = ref<Record<string, string>>({});
const projectErrors = ref<Record<string, string>>({});
const generalError = ref('');

async function onLogout() {
  const res = await $fetch<{ redirect: string }>('/api/dashboard/logout', { method: 'POST' });
  await navigateTo(res.redirect);
}

async function reorderSkills(nextIds: string[]) {
  try {
    await $fetch('/api/dashboard/reorder', {
      method: 'POST',
      body: { type: 'skill', order: nextIds.join(',') },
    });
  } catch {
    generalError.value = 'Failed to reorder skills.';
  }
}

async function reorderProjects(nextIds: string[]) {
  try {
    await $fetch('/api/dashboard/reorder', {
      method: 'POST',
      body: { type: 'project', order: nextIds.join(',') },
    });
  } catch {
    generalError.value = 'Failed to reorder projects.';
  }
}

async function addSkill() {
  skillErrors.value.add = '';
  const res = await $fetch<{ error?: string }>('/api/dashboard/skills', {
    method: 'POST',
    body: { name: newSkillName.value },
  });
  if (res.error) {
    skillErrors.value.add = res.error;
    return;
  }
  newSkillName.value = '';
  await refreshSkills();
}

async function saveSkill(skill: Skill) {
  skillErrors.value[skill.id] = '';
  const res = await $fetch<{ error?: string }>('/api/dashboard/skills', {
    method: 'POST',
    body: { id: skill.id, name: skill.name },
  });
  if (res.error) {
    skillErrors.value[skill.id] = res.error;
    return;
  }
  await refreshSkills();
}

async function deleteSkill(id: string) {
  await $fetch('/api/dashboard/skills', {
    method: 'DELETE',
    body: { id },
  });
  await refreshSkills();
}

async function addProject() {
  projectErrors.value.add = '';
  const res = await $fetch<{ error?: string }>('/api/dashboard/projects', {
    method: 'POST',
    body: newProject,
  });
  if (res.error) {
    projectErrors.value.add = res.error;
    return;
  }
  Object.assign(newProject, { name: '', image: '', description: '', githubUrl: '', technologies: '' });
  await refreshProjects();
}

async function saveProject(project: Project) {
  projectErrors.value[project.id] = '';
  const res = await $fetch<{ error?: string }>('/api/dashboard/projects', {
    method: 'POST',
    body: project,
  });
  if (res.error) {
    projectErrors.value[project.id] = res.error;
    return;
  }
  await refreshProjects();
}

async function deleteProject(id: string) {
  await $fetch('/api/dashboard/projects', {
    method: 'DELETE',
    body: { id },
  });
  await refreshProjects();
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <button
        type="button"
        class="min-h-11 rounded border border-[#f38ba8] px-4 py-1 text-sm font-semibold text-[#f38ba8] hover:bg-[#f38ba8]/10"
        @click="onLogout"
      >
        Logout
      </button>
    </div>

    <div v-if="generalError" role="alert" class="mb-6 rounded-lg bg-[#f38ba8]/10 p-3 text-sm text-[#f38ba8]">
      {{ generalError }}
    </div>

    <DashboardList title="Skills" storage-key="skills" :ids="skills.map((s) => s.id)" @reorder="reorderSkills">
      <template #default="{ id }">
        <div v-if="skills.find((s) => s.id === id)" :class="card" class="flex flex-wrap items-end gap-3">
          <label class="min-w-40 flex-1">
            <span class="mb-1 block text-xs text-[#858aa0]">Name</span>
            <input v-model="skills.find((s) => s.id === id)!.name" :class="input" type="text" />
          </label>
          <button
            type="button"
            class="min-h-11 rounded bg-[#89b4fa] px-3 py-1 text-sm font-semibold text-[#1e1e2e]"
            @click="saveSkill(skills.find((s) => s.id === id)!)"
          >
            Save
          </button>
          <button
            type="button"
            class="min-h-11 rounded border border-[#f38ba8] px-3 py-1 text-sm text-[#f38ba8] hover:bg-[#f38ba8]/10"
            @click="deleteSkill(id)"
          >
            Delete
          </button>
          <p v-if="skillErrors[id]" role="alert" class="w-full text-xs text-[#f38ba8]">
            {{ skillErrors[id] }}
          </p>
        </div>
      </template>

      <template #footer>
        <div :class="card" class="mt-3 flex flex-wrap items-end gap-3">
          <label class="min-w-40 flex-1">
            <span class="mb-1 block text-xs text-[#858aa0]">Name</span>
            <input v-model="newSkillName" :class="input" type="text" placeholder="New skill" />
          </label>
          <button
            type="button"
            class="min-h-11 rounded bg-[#89b4fa] px-4 py-1 text-sm font-semibold text-[#1e1e2e]"
            @click="addSkill"
          >
            Add
          </button>
          <p v-if="skillErrors.add" role="alert" class="w-full text-xs text-[#f38ba8]">
            {{ skillErrors.add }}
          </p>
        </div>
      </template>
    </DashboardList>

    <DashboardList title="Projects" storage-key="projects" :ids="projects.map((p) => p.id)" @reorder="reorderProjects">
      <template #default="{ id }">
        <div v-if="projects.find((p) => p.id === id)" :class="card" class="space-y-3">
          <div class="flex flex-wrap gap-3">
            <label class="min-w-40 flex-1">
              <span class="mb-1 block text-xs text-[#858aa0]">Name</span>
              <input v-model="projects.find((p) => p.id === id)!.name" :class="input" type="text" />
            </label>
            <label class="min-w-40 flex-1">
              <span class="mb-1 block text-xs text-[#858aa0]">Image URL</span>
              <input v-model="projects.find((p) => p.id === id)!.image" :class="input" type="text" />
            </label>
          </div>
          <label class="block">
            <span class="mb-1 block text-xs text-[#858aa0]">Description</span>
            <input v-model="projects.find((p) => p.id === id)!.description" :class="input" type="text" />
          </label>
          <div class="flex flex-wrap gap-3">
            <label class="min-w-40 flex-1">
              <span class="mb-1 block text-xs text-[#858aa0]">GitHub URL</span>
              <input v-model="projects.find((p) => p.id === id)!.githubUrl" :class="input" type="text" />
            </label>
            <label class="min-w-40 flex-1">
              <span class="mb-1 block text-xs text-[#858aa0]">Technologies (comma separated)</span>
              <input
                :value="projects.find((p) => p.id === id)!.technologies.join(', ')"
                :class="input"
                type="text"
                @input="
                  (e) =>
                    (projects.find((p) => p.id === id)!.technologies = (e.target as HTMLInputElement).value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean))
                "
              />
            </label>
          </div>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="projects.find((p) => p.id === id)!.archived" type="checkbox" />
            Archived
          </label>
          <div class="flex gap-3">
            <button
              type="button"
              class="min-h-11 rounded bg-[#89b4fa] px-3 py-1 text-sm font-semibold text-[#1e1e2e]"
              @click="saveProject(projects.find((p) => p.id === id)!)"
            >
              Save
            </button>
            <button
              type="button"
              class="min-h-11 rounded border border-[#f38ba8] px-3 py-1 text-sm text-[#f38ba8] hover:bg-[#f38ba8]/10"
              @click="deleteProject(id)"
            >
              Delete
            </button>
          </div>
          <p v-if="projectErrors[id]" role="alert" class="text-xs text-[#f38ba8]">
            {{ projectErrors[id] }}
          </p>
        </div>
      </template>

      <template #footer>
        <div :class="card" class="mt-3 space-y-3">
          <div class="flex flex-wrap gap-3">
            <label class="min-w-40 flex-1">
              <span class="mb-1 block text-xs text-[#858aa0]">Name</span>
              <input v-model="newProject.name" :class="input" type="text" placeholder="New project" />
            </label>
            <label class="min-w-40 flex-1">
              <span class="mb-1 block text-xs text-[#858aa0]">Image URL</span>
              <input v-model="newProject.image" :class="input" type="text" placeholder="https://..." />
            </label>
          </div>
          <label class="block">
            <span class="mb-1 block text-xs text-[#858aa0]">Description</span>
            <input v-model="newProject.description" :class="input" type="text" />
          </label>
          <div class="flex flex-wrap gap-3">
            <label class="min-w-40 flex-1">
              <span class="mb-1 block text-xs text-[#858aa0]">GitHub URL</span>
              <input v-model="newProject.githubUrl" :class="input" type="text" placeholder="https://github.com/..." />
            </label>
            <label class="min-w-40 flex-1">
              <span class="mb-1 block text-xs text-[#858aa0]">Technologies (comma separated)</span>
              <input v-model="newProject.technologies" :class="input" type="text" />
            </label>
          </div>
          <button
            type="button"
            class="min-h-11 rounded bg-[#89b4fa] px-4 py-1 text-sm font-semibold text-[#1e1e2e]"
            @click="addProject"
          >
            Add
          </button>
          <p v-if="projectErrors.add" role="alert" class="text-xs text-[#f38ba8]">
            {{ projectErrors.add }}
          </p>
        </div>
      </template>
    </DashboardList>
  </div>
</template>
