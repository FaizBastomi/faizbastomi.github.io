<script setup lang="ts">
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
</script>

<template>
  <div>
    <section id="about" class="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:flex-row md:px-16">
      <div class="flex flex-col items-center text-center md:w-1/2 md:text-left">
        <img
          src="/image/profile.jpg"
          alt="Faiz Bastomi profile"
          width="96"
          height="96"
          fetchpriority="high"
          class="mb-6 ml-4 h-24 w-24 rounded-md object-cover md:mt-4 md:ml-0 md:hidden"
        />
        <div class="items-center">
          <h1 class="text-3xl font-bold md:text-6xl">Faiz Bastomi</h1>
          <p class="mt-6 max-w-md text-base text-[#858aa0] md:text-lg">
            Welcome to my personal website where I showcase my projects and interests in open source, anime, and technology.
          </p>
        </div>
      </div>
      <div class="hidden md:flex md:w-1/2 md:items-center md:justify-center">
        <img
          src="/image/profile.jpg"
          alt="Faiz Bastomi profile large"
          width="460"
          height="460"
          fetchpriority="high"
          class="max-h-screen w-1/2 rounded-md object-cover"
        />
      </div>
    </section>

    <section id="skills" class="flex min-w-full flex-col px-4 py-12 md:px-16">
      <div class="mx-auto max-w-5xl min-w-full">
        <h2 class="mt-5 mb-8 text-center text-3xl font-bold md:text-left md:text-4xl">Skills</h2>

        <div v-if="skillsError" class="rounded-xl border border-[#f38ba8]/30 bg-[#313244]/40 p-6 text-center">
          <p class="text-[#f38ba8]">Unable to load skills at this moment.</p>
          <button
            type="button"
            class="mt-3 rounded border border-[#89b4fa] px-4 py-1.5 text-sm text-[#89b4fa] hover:bg-[#89b4fa]/10"
            @click="() => refreshSkills()"
          >
            Retry
          </button>
        </div>

        <div v-else-if="skillsPending" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <div
            v-for="n in 8"
            :key="n"
            class="flex h-32 animate-pulse flex-col items-center justify-center rounded-xl border border-[#45475a] bg-[#1e1e2e]"
          />
        </div>

        <p v-else-if="skills.length === 0" class="text-center text-[#858aa0]">No skills listed yet.</p>

        <SkillsList v-else :skills="skills" />
      </div>
    </section>

    <section id="projects" class="flex min-w-full flex-col px-4 py-12 md:px-16">
      <div class="mx-auto max-w-5xl min-w-full">
        <h2 class="mt-5 mb-8 text-center text-3xl font-bold md:text-left md:text-4xl">Projects</h2>

        <div v-if="projectsError" class="rounded-xl border border-[#f38ba8]/30 bg-[#313244]/40 p-6 text-center">
          <p class="text-[#f38ba8]">Unable to load projects at this moment.</p>
          <button
            type="button"
            class="mt-3 rounded border border-[#89b4fa] px-4 py-1.5 text-sm text-[#89b4fa] hover:bg-[#89b4fa]/10"
            @click="() => refreshProjects()"
          >
            Retry
          </button>
        </div>

        <div v-else-if="projectsPending" class="grid auto-rows-auto grid-cols-1 gap-6 md:grid-cols-3">
          <div v-for="n in 3" :key="n" class="h-80 animate-pulse rounded-xl border border-[#89b4fa]/30 bg-[#1e1e2e]" />
        </div>

        <p v-else-if="projects.length === 0" class="text-center text-[#858aa0]">No projects listed yet.</p>

        <ProjectsList v-else :projects="projects" />
      </div>
    </section>
  </div>
</template>
