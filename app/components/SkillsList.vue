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
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    <div
      v-for="skill in skills"
      :key="skill.id"
      class="group flex flex-col items-center justify-center gap-3 rounded-xl border border-[#313244] bg-[#181825] p-5 text-center transition-all hover:-translate-y-0.5 hover:border-[#89b4fa]/70 hover:shadow-md hover:shadow-[#11111b]/40"
    >
      <div
        v-if="skill.svg"
        class="flex h-10 w-10 items-center justify-center transition-transform duration-200 group-hover:scale-110 [&>svg]:h-full [&>svg]:w-full"
        aria-hidden="true"
        v-html="skill.svg"
      />
      <div v-else class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#313244] text-xs font-bold text-[#cdd6f4]">
        {{ skill.name.slice(0, 2).toUpperCase() }}
      </div>
      <span class="text-sm font-medium tracking-tight text-[#cdd6f4]">
        {{ skill.name }}
      </span>
    </div>
  </div>
</template>
