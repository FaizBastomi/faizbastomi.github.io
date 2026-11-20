<script setup lang="ts">
import {
  faPlus,
  faTrash,
  faCheck,
  faShareNodes,
  faPenToSquare,
  faXmark,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { getSocialIcon, SOCIAL_PRESETS } from '~~/shared/utils/social';
import { validateUrl } from '~~/shared/utils/validation';

interface SocialLink {
  id: string;
  name: string;
  url: string;
  handle?: string | null;
  icon?: string | null;
  enabled: boolean;
  position: number;
}

const props = defineProps<{
  socials: SocialLink[];
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const editingId = ref<string | null>(null);
const formName = ref('');
const formUrl = ref('');
const formHandle = ref('');
const formIcon = ref('github');
const formEnabled = ref(true);

const isSaving = ref(false);
const formError = ref('');
const formSuccess = ref(false);
const isDeleting = ref<Record<string, boolean>>({});

function onPresetSelect(preset: (typeof SOCIAL_PRESETS)[number]) {
  if (preset.name !== 'Custom') {
    formName.value = preset.name;
    formIcon.value = preset.icon;
    if (!formUrl.value || formUrl.value.startsWith('https://') || formUrl.value.startsWith('mailto:')) {
      formUrl.value = preset.defaultPrefix;
    }
  }
}

function startCreate() {
  editingId.value = null;
  formName.value = '';
  formUrl.value = 'https://';
  formHandle.value = '';
  formIcon.value = 'github';
  formEnabled.value = true;
  formError.value = '';
  formSuccess.value = false;
}

function startEdit(social: SocialLink) {
  editingId.value = social.id;
  formName.value = social.name;
  formUrl.value = social.url;
  formHandle.value = social.handle || '';
  formIcon.value = social.icon || 'link';
  formEnabled.value = social.enabled;
  formError.value = '';
  formSuccess.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
  startCreate();
}

async function onReorder(nextIds: string[]) {
  try {
    await $fetch('/api/dashboard/reorder', {
      method: 'POST',
      body: { type: 'social', order: nextIds.join(',') },
    });
    emit('refresh');
  } catch {
    /* gracefully handle reorder error */
  }
}

async function submitForm() {
  formError.value = '';
  formSuccess.value = false;

  if (!formName.value.trim()) {
    formError.value = 'Platform name is required';
    return;
  }

  const validated = validateUrl(formUrl.value);
  if (typeof validated !== 'string' && validated.error) {
    formError.value = validated.error;
    return;
  }

  isSaving.value = true;
  try {
    const res = await $fetch<{ error?: string }>('/api/dashboard/socials', {
      method: 'POST',
      body: {
        id: editingId.value,
        name: formName.value,
        url: formUrl.value,
        handle: formHandle.value,
        icon: formIcon.value,
        enabled: formEnabled.value,
      },
    });

    if (res.error) {
      formError.value = res.error;
      return;
    }

    formSuccess.value = true;
    startCreate();
    emit('refresh');
    setTimeout(() => {
      formSuccess.value = false;
    }, 2500);
  } catch {
    formError.value = 'Failed to save social link.';
  } finally {
    isSaving.value = false;
  }
}

async function deleteSocial(id: string) {
  if (!confirm('Are you sure you want to delete this social link?')) return;
  isDeleting.value[id] = true;
  try {
    await $fetch('/api/dashboard/socials', {
      method: 'DELETE',
      body: { id },
    });
    if (editingId.value === id) startCreate();
    emit('refresh');
  } catch {
    alert('Failed to delete social link.');
  } finally {
    isDeleting.value[id] = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Creator / Editor Form Card -->
    <div class="rounded-xl border border-[#313244] bg-[#181825] p-5 shadow-lg shadow-[#11111b]/40 sm:p-6">
      <div class="flex items-center justify-between border-b border-[#313244] pb-4">
        <div>
          <h3 class="text-base font-bold text-[#cdd6f4]">
            {{ editingId ? 'Edit Social Link' : 'Add Social Link' }}
          </h3>
          <p class="mt-0.5 text-xs text-[#a6adc8]">
            Total active links: <span class="font-semibold text-[#89b4fa]">{{ socials.length }}</span>
          </p>
        </div>

        <!-- Preset Chips -->
        <div class="hidden flex-wrap items-center gap-1.5 text-xs md:flex">
          <span class="me-1 text-[#858aa0]">Presets:</span>
          <button
            v-for="preset in SOCIAL_PRESETS.slice(0, 6)"
            :key="preset.name"
            type="button"
            class="rounded-md border border-[#313244] bg-[#1e1e2e] px-2 py-1 text-[11px] text-[#cdd6f4] transition-colors hover:border-[#89b4fa] hover:text-[#89b4fa]"
            @click="onPresetSelect(preset)"
          >
            {{ preset.name }}
          </button>
        </div>
      </div>

      <form class="mt-5 space-y-4" @submit.prevent="submitForm">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Platform Name -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-[#cdd6f4]" for="socialName"> Platform Name * </label>
            <input
              id="socialName"
              v-model="formName"
              type="text"
              required
              placeholder="e.g. GitHub, LinkedIn, Discord..."
              class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
            />
          </div>

          <!-- Icon Key -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-[#cdd6f4]" for="socialIcon"> Icon Key </label>
            <div class="flex items-center gap-2">
              <div
                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#313244] bg-[#1e1e2e] text-[#89b4fa]"
                aria-hidden="true"
              >
                <FontAwesomeIcon :icon="getSocialIcon(formIcon)" />
              </div>
              <select
                id="socialIcon"
                v-model="formIcon"
                class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-sm text-[#cdd6f4] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
              >
                <option v-for="preset in SOCIAL_PRESETS" :key="preset.icon" :value="preset.icon">
                  {{ preset.name }} ({{ preset.icon }})
                </option>
              </select>
            </div>
          </div>

          <!-- URL -->
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-xs font-semibold text-[#cdd6f4]" for="socialUrl"> Profile URL or mailto: * </label>
            <input
              id="socialUrl"
              v-model="formUrl"
              type="text"
              required
              placeholder="https://github.com/username or mailto:user@domain.com"
              class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Handle / Display text -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-[#cdd6f4]" for="socialHandle">
              Username / Handle (optional label)
            </label>
            <input
              id="socialHandle"
              v-model="formHandle"
              type="text"
              placeholder="e.g. @FaizBastomi or faiz@faizdev.my.id"
              class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
            />
          </div>

          <!-- Visible Toggle -->
          <div class="flex h-10 items-center">
            <label class="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#cdd6f4]">
              <input v-model="formEnabled" type="checkbox" class="rounded border-[#313244] text-[#89b4fa] focus:ring-[#89b4fa]" />
              <span>Visible on public site</span>
            </label>
          </div>

          <!-- Submit Buttons -->
          <div class="flex items-center gap-2 sm:justify-end">
            <button
              v-if="editingId"
              type="button"
              class="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-[#45475a] bg-[#1e1e2e] px-4 py-2 text-xs font-medium text-[#cdd6f4] hover:bg-[#313244]"
              @click="cancelEdit"
            >
              <FontAwesomeIcon :icon="faXmark" class="text-xs" aria-hidden="true" />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              :disabled="isSaving"
              class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#89b4fa] px-5 py-2 text-sm font-semibold text-[#1e1e2e] hover:bg-[#89b4fa]/90 disabled:opacity-50"
            >
              <FontAwesomeIcon :icon="faCheck" class="text-xs" aria-hidden="true" />
              <span>{{ isSaving ? 'Saving...' : editingId ? 'Update Link' : 'Add Link' }}</span>
            </button>
          </div>
        </div>

        <p v-if="formError" role="alert" class="text-xs font-medium text-[#f38ba8]">
          {{ formError }}
        </p>
        <p v-else-if="formSuccess" role="status" class="text-xs font-medium text-[#a6e3a1]">Social link saved successfully!</p>
      </form>
    </div>

    <!-- Empty State -->
    <div v-if="socials.length === 0" class="rounded-xl border border-[#313244] bg-[#181825] p-12 text-center">
      <FontAwesomeIcon :icon="faShareNodes" class="text-3xl text-[#45475a]" aria-hidden="true" />
      <p class="mt-3 text-sm text-[#a6adc8]">No social links listed yet. Fill in the form above to add your profiles.</p>
    </div>

    <!-- Reorderable List of Social Links -->
    <DashboardList
      v-else
      title="Social Links Order & Management"
      storage-key="dash-socials-order"
      :ids="socials.map((s) => s.id)"
      @reorder="onReorder"
    >
      <template #default="{ id }">
        <div
          v-if="socials.find((s) => s.id === id)"
          class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#313244] bg-[#181825] p-3 transition-colors hover:border-[#45475a] sm:p-4"
        >
          <!-- Left: Icon & Info -->
          <div class="flex min-w-0 flex-1 items-center gap-3">
            <div
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#313244] bg-[#1e1e2e] text-base text-[#89b4fa]"
              aria-hidden="true"
            >
              <FontAwesomeIcon :icon="getSocialIcon(socials.find((s) => s.id === id)!.icon)" />
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-[#cdd6f4]">
                  {{ socials.find((s) => s.id === id)!.name }}
                </span>
                <span
                  v-if="!socials.find((s) => s.id === id)!.enabled"
                  class="rounded-md bg-[#fab387]/15 px-1.5 py-0.5 text-[10px] font-medium text-[#fab387]"
                >
                  Hidden
                </span>
              </div>

              <div class="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 truncate text-xs text-[#858aa0]">
                <span v-if="socials.find((s) => s.id === id)!.handle">
                  {{ socials.find((s) => s.id === id)!.handle }}
                </span>
                <span class="max-w-xs truncate text-[#89b4fa]/80">
                  {{ socials.find((s) => s.id === id)!.url }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex flex-shrink-0 items-center gap-2">
            <a
              :href="socials.find((s) => s.id === id)!.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-1.5 text-xs font-medium text-[#cdd6f4] hover:border-[#89b4fa] hover:text-[#89b4fa]"
              title="Test open link"
            >
              <FontAwesomeIcon :icon="faArrowUpRightFromSquare" class="text-[10px]" aria-hidden="true" />
              <span class="hidden sm:inline">Visit</span>
            </a>

            <button
              type="button"
              class="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#89b4fa] px-3.5 py-1.5 text-xs font-semibold text-[#1e1e2e] hover:bg-[#89b4fa]/90"
              @click="startEdit(socials.find((s) => s.id === id)!)"
            >
              <FontAwesomeIcon :icon="faPenToSquare" class="text-xs" aria-hidden="true" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              :disabled="isDeleting[id]"
              class="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-[#f38ba8]/50 px-3 py-1.5 text-xs font-medium text-[#f38ba8] hover:bg-[#f38ba8]/10 disabled:opacity-50"
              @click="deleteSocial(id)"
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
