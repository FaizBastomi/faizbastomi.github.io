<script setup lang="ts">
import { faPlus, faTrash, faCheck, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { slug } from '~~/shared/utils/slug';

interface Skill {
  id: string;
  name: string;
  position: number;
  svg?: string | null;
}

const props = defineProps<{
  skills: Skill[];
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const newSkillName = ref('');
const isAdding = ref(false);
const addError = ref('');
const skillErrors = ref<Record<string, string>>({});
const skillSuccess = ref<Record<string, boolean>>({});
const isSaving = ref<Record<string, boolean>>({});
const isDeleting = ref<Record<string, boolean>>({});

async function onReorder(nextIds: string[]) {
  try {
    await $fetch('/api/dashboard/reorder', {
      method: 'POST',
      body: { type: 'skill', order: nextIds.join(',') },
    });
    emit('refresh');
  } catch {
    /* reorder error handled gracefully */
  }
}

async function addSkill() {
  addError.value = '';
  if (!newSkillName.value.trim()) {
    addError.value = 'Skill name is required';
    return;
  }
  isAdding.value = true;
  try {
    const res = await $fetch<{ error?: string }>('/api/dashboard/skills', {
      method: 'POST',
      body: { name: newSkillName.value },
    });
    if (res.error) {
      addError.value = res.error;
      return;
    }
    newSkillName.value = '';
    emit('refresh');
  } catch {
    addError.value = 'Failed to add skill.';
  } finally {
    isAdding.value = false;
  }
}

async function saveSkill(skill: Skill) {
  skillErrors.value[skill.id] = '';
  skillSuccess.value[skill.id] = false;
  isSaving.value[skill.id] = true;
  try {
    const res = await $fetch<{ error?: string }>('/api/dashboard/skills', {
      method: 'POST',
      body: { id: skill.id, name: skill.name },
    });
    if (res.error) {
      skillErrors.value[skill.id] = res.error;
      return;
    }
    skillSuccess.value[skill.id] = true;
    setTimeout(() => {
      skillSuccess.value[skill.id] = false;
    }, 2500);
    emit('refresh');
  } catch {
    skillErrors.value[skill.id] = 'Failed to save skill.';
  } finally {
    isSaving.value[skill.id] = false;
  }
}

async function deleteSkill(id: string) {
  if (!confirm('Are you sure you want to delete this skill?')) return;
  isDeleting.value[id] = true;
  try {
    await $fetch('/api/dashboard/skills', {
      method: 'DELETE',
      body: { id },
    });
    emit('refresh');
  } catch {
    skillErrors.value[id] = 'Failed to delete skill.';
  } finally {
    isDeleting.value[id] = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Summary & Quick Creator -->
    <div class="rounded-xl border border-[#313244] bg-[#181825] p-5 shadow-lg shadow-[#11111b]/40 sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-base font-bold text-[#cdd6f4]">Add Technical Skill</h3>
          <p class="mt-0.5 text-xs text-[#a6adc8]">
            Total skills currently listed: <span class="font-semibold text-[#89b4fa]">{{ skills.length }}</span>
          </p>
        </div>

        <form class="flex max-w-md flex-1 items-center gap-2" @submit.prevent="addSkill">
          <label class="sr-only" for="newSkillInput">Skill name</label>
          <input
            id="newSkillInput"
            v-model="newSkillName"
            type="text"
            placeholder="e.g. Rust, Go, Vue.js..."
            class="flex-1 rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
          />
          <button
            type="submit"
            :disabled="isAdding"
            class="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#89b4fa] px-4 py-2 text-sm font-semibold text-[#1e1e2e] hover:bg-[#89b4fa]/90 disabled:opacity-50"
          >
            <FontAwesomeIcon :icon="faPlus" class="text-xs" aria-hidden="true" />
            <span>{{ isAdding ? 'Adding...' : 'Add' }}</span>
          </button>
        </form>
      </div>

      <p v-if="addError" role="alert" class="mt-2 text-xs font-medium text-[#f38ba8]">
        {{ addError }}
      </p>
    </div>

    <!-- Empty State -->
    <div v-if="skills.length === 0" class="rounded-xl border border-[#313244] bg-[#181825] p-12 text-center">
      <FontAwesomeIcon :icon="faLayerGroup" class="text-3xl text-[#45475a]" aria-hidden="true" />
      <p class="mt-3 text-sm text-[#a6adc8]">No skills listed yet.</p>
    </div>

    <!-- Reorderable List of Skills -->
    <DashboardList
      v-else
      title="Skills Order & Settings"
      storage-key="dash-skills-order"
      :ids="skills.map((s) => s.id)"
      @reorder="onReorder"
    >
      <template #default="{ id }">
        <div
          v-if="skills.find((s) => s.id === id)"
          class="flex flex-wrap items-center gap-3 rounded-xl border border-[#313244] bg-[#181825] p-3 transition-colors hover:border-[#45475a] sm:p-4"
        >
          <!-- Icon Preview -->
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#313244] bg-[#1e1e2e] p-1.5"
            aria-hidden="true"
          >
            <div
              v-if="skills.find((s) => s.id === id)!.svg"
              class="h-full w-full [&>svg]:h-full [&>svg]:w-full"
              v-html="skills.find((s) => s.id === id)!.svg"
            />
            <span v-else class="text-xs font-bold text-[#89b4fa]">
              {{
                skills
                  .find((s) => s.id === id)!
                  .name.slice(0, 2)
                  .toUpperCase()
              }}
            </span>
          </div>

          <!-- Name Input -->
          <label class="min-w-[160px] flex-1">
            <span class="sr-only">Skill Name</span>
            <input
              v-model="skills.find((s) => s.id === id)!.name"
              type="text"
              required
              class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-1.5 text-sm text-[#cdd6f4] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
            />
          </label>

          <!-- Feedback Status -->
          <div class="min-w-[120px] text-xs">
            <span v-if="skillErrors[id]" role="alert" class="text-[#f38ba8]">
              {{ skillErrors[id] }}
            </span>
            <span v-else-if="skillSuccess[id]" class="text-[#a6e3a1]"> Saved! </span>
            <span v-else class="text-[#858aa0]"> slug: {{ slug(skills.find((s) => s.id === id)!.name) }} </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              :disabled="isSaving[id]"
              class="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#89b4fa] px-3.5 py-1.5 text-xs font-semibold text-[#1e1e2e] hover:bg-[#89b4fa]/90 disabled:opacity-50"
              @click="saveSkill(skills.find((s) => s.id === id)!)"
            >
              <FontAwesomeIcon :icon="faCheck" class="text-xs" aria-hidden="true" />
              <span>{{ isSaving[id] ? 'Saving...' : 'Save' }}</span>
            </button>

            <button
              type="button"
              :disabled="isDeleting[id]"
              class="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-[#f38ba8]/50 px-3 py-1.5 text-xs font-medium text-[#f38ba8] hover:bg-[#f38ba8]/10 disabled:opacity-50"
              @click="deleteSkill(id)"
            >
              <FontAwesomeIcon :icon="faTrash" class="text-xs" aria-hidden="true" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </template>
    </DashboardList>
  </div>
</template>
