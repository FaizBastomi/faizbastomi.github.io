<script setup lang="ts">
import {
  faPlus,
  faTrash,
  faCheck,
  faPenToSquare,
  faEye,
  faColumns,
  faBookOpen,
  faArrowLeft,
  faBold,
  faItalic,
  faStrikethrough,
  faHeading,
  faQuoteRight,
  faCode,
  faListUl,
  faListOl,
  faListCheck,
  faLink,
  faImage,
  faTable,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { marked } from 'marked';
import { slugify } from '~~/shared/utils/slug';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  description?: string | null;
  published: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

const props = defineProps<{
  blogs: BlogPost[];
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

// Editor state
const isEditing = ref(false);
const activeView = ref<'split' | 'edit' | 'preview'>('split');
const searchQuery = ref('');
const isSaving = ref(false);
const isDeleting = ref<Record<string, boolean>>({});
const formError = ref('');
const formSuccess = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const currentPost = ref<{
  id: string | null;
  title: string;
  slug: string;
  description: string;
  content: string;
  published: boolean;
}>({
  id: null,
  title: '',
  slug: '',
  description: '',
  content: '',
  published: true,
});

const isSlugCustomized = ref(false);

function onTitleInput() {
  if (!isSlugCustomized.value && !currentPost.value.id) {
    currentPost.value.slug = slugify(currentPost.value.title);
  }
}

function openCreate() {
  currentPost.value = {
    id: null,
    title: '',
    slug: '',
    description: '',
    content: '',
    published: true,
  };
  isSlugCustomized.value = false;
  formError.value = '';
  formSuccess.value = false;
  isEditing.value = true;
}

function openEdit(post: BlogPost) {
  currentPost.value = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: post.description || '',
    content: post.content,
    published: post.published,
  };
  isSlugCustomized.value = true;
  formError.value = '';
  formSuccess.value = false;
  isEditing.value = true;
}

function closeEditor() {
  isEditing.value = false;
  formError.value = '';
  formSuccess.value = false;
}

// Markdown Toolbar insertion helper
function insertMarkdown(prefix: string, suffix = '', placeholder = '') {
  const el = textareaRef.value;
  if (!el) {
    currentPost.value.content += prefix + placeholder + suffix;
    return;
  }

  const start = el.selectionStart;
  const end = el.selectionEnd;
  const original = currentPost.value.content;
  const selectedText = original.substring(start, end) || placeholder;

  const replacement = prefix + selectedText + suffix;
  currentPost.value.content = original.substring(0, start) + replacement + original.substring(end);

  nextTick(() => {
    el.focus();
    el.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
  });
}

function insertTable() {
  const tableTemplate = `\n| Header 1 | Header 2 | Header 3 |\n| :--- | :--- | :--- |\n| Cell 1 | Cell 2 | Cell 3 |\n| Row 2 | Data | Info |\n\n`;
  insertMarkdown(tableTemplate);
}

// Rendered Markdown preview
const renderedPreview = computed(() => {
  if (!currentPost.value.content) {
    return '<p class="text-[#858aa0] italic">Live preview will appear here as you type...</p>';
  }
  return marked.parse(currentPost.value.content);
});

// Word count and reading time
const wordCount = computed(() => {
  const text = currentPost.value.content.trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
});

const estimatedReadMinutes = computed(() => {
  return Math.max(1, Math.round(wordCount.value / 200));
});

// Filtered blog posts
const filteredBlogs = computed(() => {
  if (!searchQuery.value.trim()) return props.blogs;
  const q = searchQuery.value.toLowerCase();
  return props.blogs.filter(
    (b) => b.title.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q),
  );
});

async function savePost() {
  formError.value = '';
  formSuccess.value = false;

  if (!currentPost.value.title.trim()) {
    formError.value = 'Title is required';
    return;
  }

  if (!currentPost.value.content.trim()) {
    formError.value = 'Content is required';
    return;
  }

  isSaving.value = true;
  try {
    const res = await $fetch<{ error?: string }>('/api/dashboard/blogs', {
      method: 'POST',
      body: {
        id: currentPost.value.id,
        title: currentPost.value.title,
        slug: currentPost.value.slug,
        description: currentPost.value.description,
        content: currentPost.value.content,
        published: currentPost.value.published,
      },
    });

    if (res.error) {
      formError.value = res.error;
      return;
    }

    formSuccess.value = true;
    emit('refresh');
    setTimeout(() => {
      isEditing.value = false;
    }, 800);
  } catch {
    formError.value = 'Failed to save post. Please check network connection.';
  } finally {
    isSaving.value = false;
  }
}

async function deletePost(id: string) {
  if (!confirm('Are you sure you want to permanently delete this blog post?')) return;
  isDeleting.value[id] = true;
  try {
    await $fetch('/api/dashboard/blogs', {
      method: 'DELETE',
      body: { id },
    });
    emit('refresh');
  } catch {
    alert('Failed to delete post.');
  } finally {
    isDeleting.value[id] = false;
  }
}

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
  <div class="space-y-6">
    <!-- VIEW 1: POSTS LIST -->
    <div v-if="!isEditing" class="space-y-6">
      <!-- Top Action Bar -->
      <div class="rounded-xl border border-[#313244] bg-[#181825] p-5 shadow-lg shadow-[#11111b]/40 sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-base font-bold text-[#cdd6f4]">Personal Blog Articles</h3>
            <p class="mt-0.5 text-xs text-[#a6adc8]">
              Published and draft articles: <span class="font-semibold text-[#89b4fa]">{{ blogs.length }}</span>
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search posts..."
              class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-xs text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa] sm:w-48"
            />

            <button
              type="button"
              class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#89b4fa] px-4 py-2 text-sm font-semibold text-[#1e1e2e] transition-colors hover:bg-[#89b4fa]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
              @click="openCreate"
            >
              <FontAwesomeIcon :icon="faPlus" class="text-xs" aria-hidden="true" />
              <span>New Article</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredBlogs.length === 0" class="rounded-xl border border-[#313244] bg-[#181825] p-12 text-center">
        <FontAwesomeIcon :icon="faBookOpen" class="text-3xl text-[#45475a]" aria-hidden="true" />
        <p class="mt-3 text-sm text-[#a6adc8]">
          {{
            searchQuery ? 'No articles match your search.' : 'No blog posts yet. Click "New Article" to write your first post.'
          }}
        </p>
      </div>

      <!-- Posts List Table / Cards -->
      <div v-else class="space-y-3">
        <div
          v-for="post in filteredBlogs"
          :key="post.id"
          class="flex flex-col gap-4 rounded-xl border border-[#313244] bg-[#181825] p-4 transition-colors hover:border-[#45475a] sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span
                class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                :class="post.published ? 'bg-[#a6e3a1]/20 text-[#a6e3a1]' : 'bg-[#fab387]/20 text-[#fab387]'"
              >
                {{ post.published ? 'Published' : 'Draft' }}
              </span>
              <span class="text-xs text-[#858aa0]">{{ formatDate(post.createdAt) }}</span>
            </div>

            <h4 class="mt-1.5 truncate text-base font-bold text-[#cdd6f4]">
              {{ post.title }}
            </h4>

            <p class="mt-0.5 truncate text-xs text-[#858aa0]">slug: /blog/{{ post.slug }}</p>
          </div>

          <div class="flex flex-shrink-0 items-center gap-2">
            <NuxtLink
              v-if="post.published"
              :to="'/blog/' + post.slug"
              target="_blank"
              class="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-[#45475a] bg-[#1e1e2e] px-3 py-1.5 text-xs font-medium text-[#cdd6f4] hover:border-[#89b4fa] hover:text-[#89b4fa]"
            >
              <FontAwesomeIcon :icon="faEye" class="text-xs" aria-hidden="true" />
              <span>View</span>
            </NuxtLink>

            <button
              type="button"
              class="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#89b4fa] px-3.5 py-1.5 text-xs font-semibold text-[#1e1e2e] hover:bg-[#89b4fa]/90"
              @click="openEdit(post)"
            >
              <FontAwesomeIcon :icon="faPenToSquare" class="text-xs" aria-hidden="true" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              :disabled="isDeleting[post.id]"
              class="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-[#f38ba8]/50 px-3 py-1.5 text-xs font-medium text-[#f38ba8] hover:bg-[#f38ba8]/10 disabled:opacity-50"
              @click="deletePost(post.id)"
            >
              <FontAwesomeIcon :icon="faTrash" class="text-xs" aria-hidden="true" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2: FULL FEATURED MARKDOWN EDITOR -->
    <div v-else class="space-y-6">
      <!-- Top Bar: Back & Action -->
      <div
        class="flex flex-col gap-4 rounded-xl border border-[#313244] bg-[#181825] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      >
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#313244] bg-[#1e1e2e] px-3 py-2 text-xs font-medium text-[#cdd6f4] hover:border-[#89b4fa] hover:text-[#89b4fa]"
            @click="closeEditor"
          >
            <FontAwesomeIcon :icon="faArrowLeft" class="text-xs" aria-hidden="true" />
            <span>Back to list</span>
          </button>

          <h3 class="text-base font-bold text-[#cdd6f4]">
            {{ currentPost.id ? 'Edit Article' : 'New Article' }}
          </h3>
        </div>

        <!-- View Controls & Save Button -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- View switcher -->
          <div class="inline-flex rounded-lg border border-[#313244] bg-[#1e1e2e] p-1 text-xs">
            <button
              type="button"
              class="rounded-md px-2.5 py-1 font-medium transition-colors"
              :class="activeView === 'edit' ? 'bg-[#89b4fa] font-semibold text-[#1e1e2e]' : 'text-[#a6adc8] hover:text-[#cdd6f4]'"
              @click="activeView = 'edit'"
            >
              Write
            </button>
            <button
              type="button"
              class="hidden rounded-md px-2.5 py-1 font-medium transition-colors sm:inline-block"
              :class="
                activeView === 'split' ? 'bg-[#89b4fa] font-semibold text-[#1e1e2e]' : 'text-[#a6adc8] hover:text-[#cdd6f4]'
              "
              @click="activeView = 'split'"
            >
              <FontAwesomeIcon :icon="faColumns" class="me-1 text-[10px]" aria-hidden="true" />
              Split
            </button>
            <button
              type="button"
              class="rounded-md px-2.5 py-1 font-medium transition-colors"
              :class="
                activeView === 'preview' ? 'bg-[#89b4fa] font-semibold text-[#1e1e2e]' : 'text-[#a6adc8] hover:text-[#cdd6f4]'
              "
              @click="activeView = 'preview'"
            >
              <FontAwesomeIcon :icon="faEye" class="me-1 text-[10px]" aria-hidden="true" />
              Preview
            </button>
          </div>

          <button
            type="button"
            :disabled="isSaving"
            class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#89b4fa] px-5 py-2 text-sm font-semibold text-[#1e1e2e] hover:bg-[#89b4fa]/90 disabled:opacity-50"
            @click="savePost"
          >
            <FontAwesomeIcon :icon="faCheck" class="text-xs" aria-hidden="true" />
            <span>{{ isSaving ? 'Saving...' : currentPost.published ? 'Publish' : 'Save Draft' }}</span>
          </button>
        </div>
      </div>

      <!-- Error / Success Alert -->
      <div
        v-if="formError"
        role="alert"
        class="rounded-lg border border-[#f38ba8]/30 bg-[#f38ba8]/10 p-3 text-xs font-medium text-[#f38ba8]"
      >
        {{ formError }}
      </div>
      <div
        v-else-if="formSuccess"
        role="status"
        class="rounded-lg border border-[#a6e3a1]/30 bg-[#a6e3a1]/10 p-3 text-xs font-medium text-[#a6e3a1]"
      >
        Article saved successfully!
      </div>

      <!-- Post Metadata Inputs -->
      <div class="space-y-4 rounded-xl border border-[#313244] bg-[#181825] p-5">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Title -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-[#cdd6f4]" for="postTitle"> Article Title * </label>
            <input
              id="postTitle"
              v-model="currentPost.title"
              type="text"
              required
              placeholder="e.g. Building Modern Web Apps with Nuxt 4"
              class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3.5 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
              @input="onTitleInput"
            />
          </div>

          <!-- Slug -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-[#cdd6f4]" for="postSlug"> URL Slug * </label>
            <input
              id="postSlug"
              v-model="currentPost.slug"
              type="text"
              required
              placeholder="e.g. building-modern-web-apps-with-nuxt-4"
              class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3.5 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
              @input="isSlugCustomized = true"
            />
          </div>
        </div>

        <!-- Description / Summary -->
        <div>
          <label class="mb-1.5 block text-xs font-semibold text-[#cdd6f4]" for="postDesc">
            Excerpt / Summary (shown in cards and search results)
          </label>
          <input
            id="postDesc"
            v-model="currentPost.description"
            type="text"
            placeholder="A short, compelling summary of what readers will learn in this post."
            class="w-full rounded-lg border border-[#313244] bg-[#1e1e2e] px-3.5 py-2 text-sm text-[#cdd6f4] placeholder-[#858aa0] outline-none focus:border-[#89b4fa] focus:ring-1 focus:ring-[#89b4fa]"
          />
        </div>

        <!-- Publish Toggle -->
        <div class="flex items-center gap-3 pt-1">
          <label class="relative inline-flex cursor-pointer items-center">
            <input v-model="currentPost.published" type="checkbox" class="peer sr-only" />
            <div
              class="peer h-6 w-11 rounded-full bg-[#313244] peer-checked:bg-[#89b4fa] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
            ></div>
            <span class="ms-3 text-xs font-medium text-[#cdd6f4]">
              {{ currentPost.published ? 'Published (visible on public site)' : 'Draft (hidden from public site)' }}
            </span>
          </label>
        </div>
      </div>

      <!-- FULL MARKDOWN TOOLBAR & EDITOR CONTAINER -->
      <div class="overflow-hidden rounded-xl border border-[#313244] bg-[#181825]">
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center gap-1 border-b border-[#313244] bg-[#1e1e2e] p-2">
          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Bold (**text**)"
            @click="insertMarkdown('**', '**', 'bold text')"
          >
            <FontAwesomeIcon :icon="faBold" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Italic (*text*)"
            @click="insertMarkdown('*', '*', 'italic text')"
          >
            <FontAwesomeIcon :icon="faItalic" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Strikethrough (~~text~~)"
            @click="insertMarkdown('~~', '~~', 'strikethrough')"
          >
            <FontAwesomeIcon :icon="faStrikethrough" aria-hidden="true" />
          </button>

          <div class="mx-1 h-4 w-[1px] bg-[#313244]" aria-hidden="true" />

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs font-bold text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Heading 1 (# Heading)"
            @click="insertMarkdown('# ', '', 'Heading 1\n')"
          >
            H1
          </button>

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs font-bold text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Heading 2 (## Heading)"
            @click="insertMarkdown('## ', '', 'Heading 2\n')"
          >
            H2
          </button>

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs font-bold text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Heading 3 (### Heading)"
            @click="insertMarkdown('### ', '', 'Heading 3\n')"
          >
            H3
          </button>

          <div class="mx-1 h-4 w-[1px] bg-[#313244]" aria-hidden="true" />

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Quote (> quote)"
            @click="insertMarkdown('> ', '', 'Quoted text here\n')"
          >
            <FontAwesomeIcon :icon="faQuoteRight" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Inline Code (`code`)"
            @click="insertMarkdown('`', '`', 'code')"
          >
            <FontAwesomeIcon :icon="faCode" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="rounded px-2.5 py-1.5 font-mono text-xs font-semibold text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Code Block (```lang)"
            @click="insertMarkdown('```typescript\n', '\n```\n', '// write code here')"
          >
            &lt;/&gt;
          </button>

          <div class="mx-1 h-4 w-[1px] bg-[#313244]" aria-hidden="true" />

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Bullet List (- item)"
            @click="insertMarkdown('- ', '', 'Bullet item\n')"
          >
            <FontAwesomeIcon :icon="faListUl" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Numbered List (1. item)"
            @click="insertMarkdown('1. ', '', 'Numbered item\n')"
          >
            <FontAwesomeIcon :icon="faListOl" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Task List (- [ ] task)"
            @click="insertMarkdown('- [ ] ', '', 'Task item\n')"
          >
            <FontAwesomeIcon :icon="faListCheck" aria-hidden="true" />
          </button>

          <div class="mx-1 h-4 w-[1px] bg-[#313244]" aria-hidden="true" />

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Link ([text](url))"
            @click="insertMarkdown('[', '](https://example.com)', 'link text')"
          >
            <FontAwesomeIcon :icon="faLink" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Image (![alt](url))"
            @click="insertMarkdown('![', '](https://example.com/image.jpg)', 'alt text')"
          >
            <FontAwesomeIcon :icon="faImage" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Table"
            @click="insertTable"
          >
            <FontAwesomeIcon :icon="faTable" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="rounded px-2.5 py-1.5 text-xs text-[#cdd6f4] transition-colors hover:bg-[#313244] hover:text-[#89b4fa]"
            title="Divider (---)"
            @click="insertMarkdown('\n---\n\n', '', '')"
          >
            <FontAwesomeIcon :icon="faMinus" aria-hidden="true" />
          </button>
        </div>

        <!-- Editor Work Area (Split or Single) -->
        <div
          class="grid min-h-[460px]"
          :class="{
            'grid-cols-1 divide-y divide-[#313244] lg:grid-cols-2 lg:divide-x lg:divide-y-0': activeView === 'split',
            'grid-cols-1': activeView !== 'split',
          }"
        >
          <!-- Write Textarea -->
          <div v-show="activeView === 'edit' || activeView === 'split'" class="flex flex-col bg-[#181825]">
            <label class="sr-only" for="markdownTextarea">Markdown Content</label>
            <textarea
              id="markdownTextarea"
              ref="textareaRef"
              v-model="currentPost.content"
              placeholder="Write your article in Markdown here... Use the toolbar above for formatting."
              class="min-h-[460px] w-full flex-1 resize-none bg-transparent p-5 font-mono text-sm leading-relaxed text-[#cdd6f4] placeholder-[#858aa0] outline-none"
            />
          </div>

          <!-- Preview Pane -->
          <div
            v-show="activeView === 'preview' || activeView === 'split'"
            class="flex max-h-[600px] flex-col overflow-y-auto bg-[#1e1e2e] p-5 sm:p-6"
          >
            <div
              class="mb-3 flex items-center justify-between border-b border-[#313244] pb-2 text-xs font-semibold text-[#89b4fa]"
            >
              <span>LIVE PREVIEW</span>
              <span class="text-[#858aa0]">{{ wordCount }} words &bull; ~{{ estimatedReadMinutes }} min read</span>
            </div>

            <div class="markdown-prose flex-1" v-html="renderedPreview" />
          </div>
        </div>

        <!-- Editor Bottom Status Bar -->
        <div class="flex items-center justify-between border-t border-[#313244] bg-[#1e1e2e] px-4 py-2 text-xs text-[#858aa0]">
          <div>
            <span>Markdown Supported: GFM &bull; Tables &bull; Code &bull; Lists</span>
          </div>

          <div class="flex items-center gap-4">
            <span>{{ wordCount }} words</span>
            <span>{{ currentPost.content.length }} characters</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
