<script setup lang="ts">
import {
  faPlus,
  faTrash,
  faCheck,
  faTriangleExclamation,
  faCode,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';

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

const props = defineProps<{
  projects: Project[];
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const showAddForm = ref(false);
const filter = ref<'all' | 'active' | 'archived'>('all');

const newProject = reactive({
  name: '',
  image: '',
  description: '',
  githubUrl: '',
  technologies: '',
  archived: false,
});

const isCreating = ref(false);
const createError = ref('');
const projectErrors = ref<Record<string, string>>({});
const projectSuccess = ref<Record<string, boolean>>({});
const isSaving = ref<Record<string, boolean>>({});
const isDeleting = ref<Record<string, boolean>>({});

const activeCount = computed(() => props.projects.filter((p) => !p.archived).length);
const archivedCount = computed(() => props.projects.filter((p) => p.archived).length);

const filteredProjects = computed(() => {
  if (filter.value === 'active') return props.projects.filter((p) => !p.archived);
  if (filter.value === 'archived') return props.projects.filter((p) => p.archived);
  return props.projects;
});

async function onReorder(nextIds: string[]) {
  try {
    await $fetch('/api/dashboard/reorder', {
      method: 'POST',
      body: { type: 'project', order: nextIds.join(',') },
    });
    emit('refresh');
  } catch {
    /* reorder failure handled gracefully */
  }
}

async function addProject() {
  createError.value = '';
  isCreating.value = true;
  try {
    const res = await $fetch<{ error?: string }>('/api/dashboard/projects', {
      method: 'POST',
      body: newProject,
    });
    if (res.error) {
      createError.value = res.error;
      return;
    }
    Object.assign(newProject, {
      name: '',
      image: '',
      description: '',
      githubUrl: '',
      technologies: '',
      archived: false,
    });
    showAddForm.value = false;
    emit('refresh');
  } catch {
    createError.value = 'Failed to create project.';
  } finally {
    isCreating.value = false;
  }
}

async function saveProject(project: Project) {
  projectErrors.value[project.id] = '';
  projectSuccess.value[project.id] = false;
  isSaving.value[project.id] = true;
  try {
    const res = await $fetch<{ error?: string }>('/api/dashboard/projects', {
      method: 'POST',
      body: project,
    });
    if (res.error) {
      projectErrors.value[project.id] = res.error;
      return;
    }
    projectSuccess.value[project.id] = true;
    setTimeout(() => {
      projectSuccess.value[project.id] = false;
    }, 2500);
    emit('refresh');
  } catch {
    projectErrors.value[project.id] = 'Failed to save changes.';
  } finally {
    isSaving.value[project.id] = false;
  }
}

async function deleteProject(id: string) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  isDeleting.value[id] = true;
  try {
    await $fetch('/api/dashboard/projects', {
      method: 'DELETE',
      body: { id },
    });
    emit('refresh');
  } catch {
    projectErrors.value[id] = 'Failed to delete project.';
  } finally {
    isDeleting.value[id] = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Summary & Actions -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="inline-flex min-h-11 items-center rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors"
          :class="filter === 'all' ? 'bg-[#89b4fa] text-[#1e1e2e]' : 'bg-[#181825] text-[#a6adc8] hover:text-[#cdd6f4]'"
          @click="filter = 'all'"
        >
          All ({{ projects.length }})
        </button>
        <button
          type="button"
          class="inline-flex min-h-11 items-center rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors"
          :class="filter === 'active' ? 'bg-[#89b4fa] text-[#1e1e2e]' : 'bg-[#181825] text-[#a6adc8] hover:text-[#cdd6f4]'"
          @click="filter = 'active'"
        >
          Active ({{ activeCount }})
        </button>
        <button
          type="button"
          class="inline-flex min-h-11 items-center rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors"
          :class="filter === 'archived' ? 'bg-[#89b4fa] text-[#1e1e2e]' : 'bg-[#181825] text-[#a6adc8] hover:text-[#cdd6f4]'"
          @click="filter = 'archived'"
        >
          Archived ({{ archivedCount }})
        </button>
      </div>

      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#89b4fa] px-4 py-2 text-sm font-semibold text-[#1e1e2e] transition-colors hover:bg-[#89b4fa]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        @click="showAddForm = !showAddForm"
      >
        <FontAwesomeIcon :icon="faPlus" class="text-xs" aria-hidden="true" />
        <span>{{ showAddForm ? 'Close Creator' : 'New Project' }}</span>
      </button>
    </div>

    <!-- Create Project Drawer / Panel -->
    <div v-if="showAddForm" class="rounded-xl border border-[#89b4fa]/50 bg-[#181825] p-5 shadow-lg shadow-[#11111b]/40 sm:p-6">
      <div class="mb-4 flex items-center justify-between border-b border-[#313244] pb-3">
        <h3 class="text-base font-bold text-[#cdd6f4]">Add New Project</h3>
        <span class="text-xs text-[#a6adc8]">Public Portfolio Entry</span>
      </div>

      <form class="space-y-4" @submit.prevent="addProject">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block text-xs font-medium text-[#a6adc8]">Project Name *</span>
            <input
              v-model="newProject.name"
              type="text"
              required
              placeholder="e.g. Personal Portfolio"
              class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
            />
          </label>

          <label class="block">
            <span class="mb-1 block text-xs font-medium text-[#a6adc8]">GitHub URL *</span>
            <input
              v-model="newProject.githubUrl"
              type="url"
              required
              placeholder="https://github.com/..."
              class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
            />
          </label>
        </div>

        <label class="block">
          <span class="mb-1 block text-xs font-medium text-[#a6adc8]">Description *</span>
          <textarea
            v-model="newProject.description"
            rows="2"
            required
            placeholder="A concise summary of what this project does..."
            class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
          />
        </label>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block text-xs font-medium text-[#a6adc8]">Image URL (optional)</span>
            <input
              v-model="newProject.image"
              type="text"
              placeholder="/image/... or https://..."
              class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
            />
          </label>

          <label class="block">
            <span class="mb-1 block text-xs font-medium text-[#a6adc8]">Technologies (comma separated)</span>
            <input
              v-model="newProject.technologies"
              type="text"
              placeholder="Next.js, Tailwind CSS, TypeScript"
              class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
            />
          </label>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <input
            id="newProjectArchived"
            v-model="newProject.archived"
            type="checkbox"
            class="h-4 w-4 rounded border-[#313244] bg-[#1e1e2e] text-[#89b4fa] focus:ring-[#89b4fa]"
          />
          <label for="newProjectArchived" class="text-xs text-[#a6adc8]">Mark as archived project</label>
        </div>

        <p v-if="createError" role="alert" class="text-xs font-medium text-[#f38ba8]">
          {{ createError }}
        </p>

        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            :disabled="isCreating"
            class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#89b4fa] px-4 py-2 text-sm font-semibold text-[#1e1e2e] hover:bg-[#89b4fa]/90 disabled:opacity-50"
          >
            <FontAwesomeIcon :icon="faCheck" class="text-xs" aria-hidden="true" />
            <span>{{ isCreating ? 'Creating...' : 'Create Project' }}</span>
          </button>
          <button
            type="button"
            class="min-h-11 rounded-lg border border-[#45475a] px-4 py-2 text-sm text-[#a6adc8] hover:text-[#cdd6f4]"
            @click="showAddForm = false"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProjects.length === 0" class="rounded-xl border border-[#313244] bg-[#181825] p-12 text-center">
      <FontAwesomeIcon :icon="faCode" class="text-3xl text-[#45475a]" aria-hidden="true" />
      <p class="mt-3 text-sm text-[#a6adc8]">No projects found in this filter.</p>
    </div>

    <!-- Reorderable List (when viewing All) -->
    <DashboardList
      v-else-if="filter === 'all'"
      title="Projects Order"
      storage-key="dash-projects-order"
      :ids="projects.map((p) => p.id)"
      @reorder="onReorder"
    >
      <template #default="{ id }">
        <div
          v-if="projects.find((p) => p.id === id)"
          class="rounded-xl border border-[#313244] bg-[#181825] p-5 transition-colors hover:border-[#45475a]"
        >
          <form class="space-y-4" @submit.prevent="saveProject(projects.find((p) => p.id === id)!)">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <!-- Left side inputs -->
              <div class="flex-1 space-y-3">
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label class="block">
                    <span class="mb-1 block text-xs font-medium text-[#a6adc8]">Name</span>
                    <input
                      v-model="projects.find((p) => p.id === id)!.name"
                      type="text"
                      required
                      class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-1.5 text-sm text-[#cdd6f4] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
                    />
                  </label>

                  <label class="block">
                    <span class="mb-1 block text-xs font-medium text-[#a6adc8]">Image URL</span>
                    <input
                      v-model="projects.find((p) => p.id === id)!.image"
                      type="text"
                      placeholder="Optional image path or URL"
                      class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-1.5 text-sm text-[#cdd6f4] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
                    />
                  </label>
                </div>

                <label class="block">
                  <span class="mb-1 block text-xs font-medium text-[#a6adc8]">Description</span>
                  <textarea
                    v-model="projects.find((p) => p.id === id)!.description"
                    rows="2"
                    required
                    class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-1.5 text-sm text-[#cdd6f4] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
                  />
                </label>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label class="block">
                    <span class="mb-1 block text-xs font-medium text-[#a6adc8]">GitHub URL</span>
                    <input
                      v-model="projects.find((p) => p.id === id)!.githubUrl"
                      type="url"
                      required
                      class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-1.5 text-sm text-[#cdd6f4] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
                    />
                  </label>

                  <label class="block">
                    <span class="mb-1 block text-xs font-medium text-[#a6adc8]">Technologies (comma separated)</span>
                    <input
                      :value="projects.find((p) => p.id === id)!.technologies.join(', ')"
                      type="text"
                      class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-1.5 text-sm text-[#cdd6f4] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
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

                <div class="flex items-center gap-2 pt-1">
                  <input
                    :id="`archived-${id}`"
                    v-model="projects.find((p) => p.id === id)!.archived"
                    type="checkbox"
                    class="h-4 w-4 rounded border-[#313244] bg-[#1e1e2e] text-[#89b4fa] focus:ring-[#89b4fa]"
                  />
                  <label :for="`archived-${id}`" class="text-xs text-[#a6adc8]">Archived project</label>
                </div>
              </div>

              <!-- Right preview thumbnail -->
              <div v-if="projects.find((p) => p.id === id)!.image" class="hidden sm:block sm:w-36">
                <span class="mb-1 block text-xs text-[#858aa0]">Thumbnail</span>
                <img
                  :src="projects.find((p) => p.id === id)!.image!"
                  alt="Thumbnail"
                  class="aspect-video w-full rounded-lg border border-[#313244] object-cover"
                />
              </div>
            </div>

            <!-- Messages & Actions -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[#313244]/80 pt-3">
              <div class="flex items-center gap-2">
                <p v-if="projectErrors[id]" role="alert" class="text-xs font-medium text-[#f38ba8]">
                  {{ projectErrors[id] }}
                </p>
                <p v-else-if="projectSuccess[id]" class="text-xs font-medium text-[#a6e3a1]">Saved successfully</p>
              </div>

              <div class="flex items-center gap-2">
                <a
                  :href="projects.find((p) => p.id === id)!.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex min-h-11 items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-[#858aa0] hover:text-[#89b4fa]"
                  title="Test link"
                >
                  <span>Test Link</span>
                  <FontAwesomeIcon :icon="faArrowUpRightFromSquare" class="text-[10px]" aria-hidden="true" />
                </a>

                <button
                  type="submit"
                  :disabled="isSaving[id]"
                  class="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#89b4fa] px-3.5 py-1.5 text-xs font-semibold text-[#1e1e2e] hover:bg-[#89b4fa]/90 disabled:opacity-50"
                >
                  <FontAwesomeIcon :icon="faCheck" class="text-xs" aria-hidden="true" />
                  <span>{{ isSaving[id] ? 'Saving...' : 'Save' }}</span>
                </button>

                <button
                  type="button"
                  :disabled="isDeleting[id]"
                  class="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-[#f38ba8]/50 px-3 py-1.5 text-xs font-medium text-[#f38ba8] hover:bg-[#f38ba8]/10 disabled:opacity-50"
                  @click="deleteProject(id)"
                >
                  <FontAwesomeIcon :icon="faTrash" class="text-xs" aria-hidden="true" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </template>
    </DashboardList>

    <!-- Plain list when filtered (Active / Archived) -->
    <div v-else class="space-y-4">
      <div v-for="project in filteredProjects" :key="project.id" class="rounded-xl border border-[#313244] bg-[#181825] p-5">
        <div class="flex items-center justify-between">
          <h4 class="text-base font-bold text-[#cdd6f4]">{{ project.name }}</h4>
          <span v-if="project.archived" class="rounded bg-[#fab387]/15 px-2 py-0.5 text-xs font-medium text-[#fab387]">
            Archived
          </span>
        </div>
        <p class="mt-1 text-sm text-[#a6adc8]">{{ project.description }}</p>
        <div class="mt-3 flex items-center justify-between border-t border-[#313244] pt-3">
          <span class="text-xs text-[#858aa0]">{{ project.technologies.join(', ') }}</span>
          <button
            type="button"
            class="inline-flex min-h-11 items-center text-xs text-[#89b4fa] underline hover:text-[#b4befe]"
            @click="filter = 'all'"
          >
            Switch to All to Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
