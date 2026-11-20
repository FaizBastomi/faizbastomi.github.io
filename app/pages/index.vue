<script setup lang="ts">
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight, faRotateRight } from '@fortawesome/free-solid-svg-icons';

const {
  data: skills,
  pending: skillsPending,
  error: skillsError,
  refresh: refreshSkills,
} = await useFetch('/api/skills', {
  default: () => [],
});

const {
  data: projects,
  pending: projectsPending,
  error: projectsError,
  refresh: refreshProjects,
} = await useFetch('/api/projects', {
  default: () => [],
});

// ponytail: structured data graph for rich search results and person knowledge graph
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://faizdev.my.id/#website',
            url: 'https://faizdev.my.id/',
            name: 'Faiz Bastomi Portfolio',
            description:
              'Full-stack developer and open source builder developing web apps, developer tooling, and automated services.',
            publisher: {
              '@id': 'https://faizdev.my.id/#person',
            },
          },
          {
            '@type': 'Person',
            '@id': 'https://faizdev.my.id/#person',
            name: 'Faiz Bastomi',
            url: 'https://faizdev.my.id/',
            image: 'https://faizdev.my.id/image/profile.jpg',
            jobTitle: 'Full-Stack Developer',
            description:
              'Full-stack developer and open source builder focused on TypeScript, Nuxt, Node.js, and clean software engineering.',
            sameAs: ['https://github.com/FaizBastomi'],
            knowsAbout: [
              'TypeScript',
              'JavaScript',
              'Nuxt',
              'Vue.js',
              'Node.js',
              'Tailwind CSS',
              'MongoDB',
              'Docker',
              'Go',
              'Python',
            ],
          },
        ],
      }),
    },
  ],
});
</script>

<template>
  <div>
    <AppNavbar />

    <!-- Hero / About Section -->
    <section id="about" class="relative overflow-hidden px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24 md:px-8">
      <div class="mx-auto max-w-6xl">
        <div class="flex flex-col-reverse items-center justify-between gap-10 md:flex-row md:items-start md:gap-12">
          <!-- Text Content -->
          <div class="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
            <h1 class="text-4xl font-extrabold tracking-tight text-[#cdd6f4] sm:text-5xl md:text-6xl">Faiz Bastomi</h1>

            <p class="mt-3 text-lg font-medium text-[#89b4fa] sm:text-xl">Full-Stack Developer and Open Source Builder</p>

            <p class="mt-4 max-w-xl text-base leading-relaxed text-[#a6adc8] sm:text-lg">
              Developing open source web apps, developer tooling, and automated services. Focused on TypeScript, Nuxt, Node.js,
              and clean engineering.
            </p>

            <div class="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:justify-start">
              <a
                href="#projects"
                class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#89b4fa] px-5 py-2.5 text-sm font-semibold text-[#1e1e2e] transition-colors hover:bg-[#89b4fa]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
              >
                <span>View Projects</span>
                <FontAwesomeIcon :icon="faArrowRight" class="text-xs" aria-hidden="true" />
              </a>

              <a
                href="https://github.com/FaizBastomi"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#45475a] bg-[#181825] px-5 py-2.5 text-sm font-medium text-[#cdd6f4] transition-colors hover:border-[#89b4fa] hover:text-[#89b4fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
              >
                <FontAwesomeIcon :icon="faGithub" class="text-sm" aria-hidden="true" />
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>

          <!-- Profile Photo Frame -->
          <div class="flex flex-shrink-0 items-center justify-center">
            <div class="relative rounded-2xl border-2 border-[#313244] bg-[#181825] p-2 shadow-xl shadow-[#11111b]/50">
              <img
                src="/image/profile.jpg"
                alt="Faiz Bastomi profile portrait"
                width="256"
                height="256"
                fetchpriority="high"
                class="h-44 w-44 rounded-xl object-cover sm:h-56 sm:w-56 md:h-64 md:w-64"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="border-t border-[#313244]/60 px-4 py-16 sm:px-6 sm:py-20 md:px-8">
      <div class="mx-auto max-w-6xl">
        <div class="mb-10 sm:mb-12">
          <p class="text-xs font-semibold tracking-wider text-[#89b4fa] uppercase">Portfolio</p>
          <h2 class="mt-1 text-2xl font-bold tracking-tight text-[#cdd6f4] sm:text-3xl md:text-4xl">Featured Projects</h2>
          <p class="mt-2 max-w-2xl text-sm text-[#a6adc8] sm:text-base">
            Web applications, automated bots, and utility services with public repositories.
          </p>
        </div>

        <!-- Error State -->
        <div v-if="projectsError" class="rounded-xl border border-[#f38ba8]/30 bg-[#181825] p-8 text-center" role="alert">
          <p class="text-sm font-medium text-[#f38ba8]">Unable to load projects at this moment.</p>
          <button
            type="button"
            class="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#89b4fa] px-4 py-2 text-sm font-medium text-[#89b4fa] hover:bg-[#89b4fa]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
            @click="() => refreshProjects()"
          >
            <FontAwesomeIcon :icon="faRotateRight" class="text-xs" aria-hidden="true" />
            <span>Retry Loading</span>
          </button>
        </div>

        <!-- Loading State Skeleton -->
        <div v-else-if="projectsPending" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="n in 3"
            :key="n"
            class="h-80 animate-pulse rounded-xl border border-[#313244] bg-[#181825]"
            aria-hidden="true"
          />
        </div>

        <!-- Empty State -->
        <div v-else-if="projects.length === 0" class="rounded-xl border border-[#313244] bg-[#181825] p-12 text-center">
          <p class="text-base text-[#a6adc8]">No projects listed yet.</p>
        </div>

        <!-- Populated List -->
        <ProjectsList v-else :projects="projects" />
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="border-t border-[#313244]/60 px-4 py-16 sm:px-6 sm:py-20 md:px-8">
      <div class="mx-auto max-w-6xl">
        <div class="mb-10 sm:mb-12">
          <p class="text-xs font-semibold tracking-wider text-[#89b4fa] uppercase">Capabilities</p>
          <h2 class="mt-1 text-2xl font-bold tracking-tight text-[#cdd6f4] sm:text-3xl md:text-4xl">Technical Stack</h2>
          <p class="mt-2 max-w-2xl text-sm text-[#a6adc8] sm:text-base">
            Languages, frameworks, databases, and DevOps tools used across projects.
          </p>
        </div>

        <!-- Error State -->
        <div v-if="skillsError" class="rounded-xl border border-[#f38ba8]/30 bg-[#181825] p-8 text-center" role="alert">
          <p class="text-sm font-medium text-[#f38ba8]">Unable to load technical stack at this moment.</p>
          <button
            type="button"
            class="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#89b4fa] px-4 py-2 text-sm font-medium text-[#89b4fa] hover:bg-[#89b4fa]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89b4fa]"
            @click="() => refreshSkills()"
          >
            <FontAwesomeIcon :icon="faRotateRight" class="text-xs" aria-hidden="true" />
            <span>Retry Loading</span>
          </button>
        </div>

        <!-- Loading State Skeleton -->
        <div v-else-if="skillsPending" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <div
            v-for="n in 8"
            :key="n"
            class="h-28 animate-pulse rounded-xl border border-[#313244] bg-[#181825]"
            aria-hidden="true"
          />
        </div>

        <!-- Empty State -->
        <div v-else-if="skills.length === 0" class="rounded-xl border border-[#313244] bg-[#181825] p-12 text-center">
          <p class="text-base text-[#a6adc8]">No technologies listed yet.</p>
        </div>

        <!-- Populated List -->
        <SkillsList v-else :skills="skills" />
      </div>
    </section>
  </div>
</template>
