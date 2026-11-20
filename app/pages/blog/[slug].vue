<script setup lang="ts">
import { faArrowLeft, faCalendarDay, faClock } from '@fortawesome/free-solid-svg-icons';
import { marked } from 'marked';

const route = useRoute();
const slug = computed(() => String(route.params.slug || ''));

const { data: post, error } = await useFetch(`/api/blogs/${slug.value}`);

if (error.value || !post.value) {
  throw createError({ status: 404, statusText: 'Article Not Found', fatal: true });
}

function formatDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const renderedHtml = computed(() => {
  if (!post.value?.content) return '';
  return marked.parse(post.value.content);
});

// Estimate reading time in minutes
const readTime = computed(() => {
  if (!post.value?.content) return 1;
  const words = post.value.content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
});

useHead({
  title: computed(() => `${post.value?.title} | Faiz Bastomi Blog`),
  link: [
    {
      rel: 'canonical',
      href: `https://faizdev.my.id/blog/${slug.value}`,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.value?.title,
        description: post.value?.description || post.value?.title,
        datePublished: post.value?.createdAt,
        dateModified: post.value?.updatedAt || post.value?.createdAt,
        author: {
          '@type': 'Person',
          name: 'Faiz Bastomi',
          url: 'https://faizdev.my.id/',
        },
        publisher: {
          '@type': 'Person',
          name: 'Faiz Bastomi',
          url: 'https://faizdev.my.id/',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://faizdev.my.id/blog/${slug.value}`,
        },
      }),
    },
  ],
});

useSeoMeta({
  title: computed(() => `${post.value?.title} | Faiz Bastomi Blog`),
  description: computed(() => post.value?.description || `Article by Faiz Bastomi: ${post.value?.title}`),
  ogTitle: computed(() => post.value?.title),
  ogDescription: computed(() => post.value?.description || `Article by Faiz Bastomi: ${post.value?.title}`),
  ogType: 'article',
  ogUrl: `https://faizdev.my.id/blog/${slug.value}`,
  twitterCard: 'summary',
  twitterTitle: computed(() => post.value?.title),
  twitterDescription: computed(() => post.value?.description || `Article by Faiz Bastomi: ${post.value?.title}`),
});
</script>

<template>
  <div class="min-h-screen bg-[#1e1e2e] text-[#cdd6f4]">
    <AppNavbar />

    <main class="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 md:px-8">
      <!-- Back Navigation -->
      <div class="mb-8">
        <NuxtLink
          to="/#blogs"
          class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#313244] bg-[#181825] px-4 py-2 text-sm font-medium text-[#cdd6f4] transition-colors hover:border-[#89b4fa] hover:text-[#89b4fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
        >
          <FontAwesomeIcon :icon="faArrowLeft" class="text-xs" aria-hidden="true" />
          <span>Back to Portfolio</span>
        </NuxtLink>
      </div>

      <!-- Article Header -->
      <header class="mb-10 border-b border-[#313244]/80 pb-8">
        <div class="flex flex-wrap items-center gap-3 text-xs font-medium text-[#a6adc8]">
          <span class="inline-flex items-center gap-1.5">
            <FontAwesomeIcon :icon="faCalendarDay" class="text-[#89b4fa]" aria-hidden="true" />
            <time :datetime="new Date(post.createdAt).toISOString()">{{ formatDate(post.createdAt) }}</time>
          </span>
          <span class="h-1 w-1 rounded-full bg-[#45475a]" aria-hidden="true" />
          <span class="inline-flex items-center gap-1.5">
            <FontAwesomeIcon :icon="faClock" class="text-[#89b4fa]" aria-hidden="true" />
            <span>{{ readTime }} min read</span>
          </span>
        </div>

        <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-[#cdd6f4] sm:text-4xl md:text-5xl">
          {{ post.title }}
        </h1>

        <p v-if="post.description" class="mt-4 text-base leading-relaxed text-[#bac2de] sm:text-lg">
          {{ post.description }}
        </p>
      </header>

      <!-- Markdown Article Content -->
      <article class="markdown-prose" v-html="renderedHtml" />

      <!-- Bottom Article Footer -->
      <footer class="mt-14 border-t border-[#313244]/80 pt-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <NuxtLink
            to="/#blogs"
            class="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#89b4fa] hover:underline"
          >
            <FontAwesomeIcon :icon="faArrowLeft" class="text-xs" aria-hidden="true" />
            <span>Back to all posts</span>
          </NuxtLink>

          <span class="text-xs text-[#a6adc8]"> Written by Faiz Bastomi </span>
        </div>
      </footer>
    </main>
  </div>
</template>
