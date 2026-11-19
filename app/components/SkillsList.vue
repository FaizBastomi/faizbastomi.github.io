<script setup lang="ts">
interface SkillItem {
  id: string;
  name: string;
  position?: number;
  svg?: string | null;
}

defineProps<{
  skills: SkillItem[];
}>();
</script>

<template>
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
    <div
      v-for="skill in skills"
      :key="skill.id"
      class="flex flex-col items-center gap-3 rounded-xl border border-[#45475a] bg-[#1e1e2e] px-4 py-6 transition-colors hover:border-[#89b4fa]"
    >
      <span
        v-if="skill.svg"
        class="flex h-12 w-12 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
        aria-hidden="true"
        v-html="skill.svg"
      />
      <span v-else class="h-12 w-12" aria-hidden="true" />
      <span class="text-center text-sm font-medium">{{ skill.name }}</span>
    </div>
  </div>
</template>
