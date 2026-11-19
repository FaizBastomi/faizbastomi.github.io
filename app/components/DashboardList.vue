<script setup lang="ts">
import { faChevronDown, faChevronRight, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { move } from '~~/shared/utils/validation';

const props = defineProps<{
  title: string;
  ids: string[];
  storageKey: string;
}>();

const emit = defineEmits<{
  (e: 'reorder', order: string[]): void;
}>();

const order = ref<string[]>([...props.ids]);
const open = ref(true);
const ready = ref(false);
const dragging = ref<string | null>(null);
const over = ref<string | null>(null);

watch(
  () => props.ids,
  (newIds) => {
    order.value = [...newIds];
  },
  { deep: true },
);

onMounted(() => {
  try {
    const saved = localStorage.getItem(props.storageKey);
    if (saved !== null) {
      open.value = saved !== '0';
    }
  } catch {
    /* ignore storage failure */
  }
  ready.value = true;
});

function toggle() {
  open.value = !open.value;
  try {
    localStorage.setItem(props.storageKey, open.value ? '1' : '0');
  } catch {
    /* ignore storage failure */
  }
}

function persist(nextOrder: string[]) {
  order.value = nextOrder;
  emit('reorder', nextOrder);
}

function nudge(from: number, delta: number) {
  const to = from + delta;
  if (to < 0 || to >= order.value.length) return;
  persist(move(order.value, from, to));
}

function onDragStart(e: DragEvent, id: string) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', id);
  }
  dragging.value = id;
}

function onDragEnd() {
  dragging.value = null;
  over.value = null;
}

function onDragOver(e: DragEvent, id: string) {
  e.preventDefault();
  if (over.value !== id) over.value = id;
}

function onDrop(e: DragEvent, id: string) {
  e.preventDefault();
  if (!dragging.value) return;
  const from = order.value.indexOf(dragging.value);
  const to = order.value.indexOf(id);
  dragging.value = null;
  over.value = null;
  if (from < 0 || to < 0 || from === to) return;
  persist(move(order.value, from, to));
}
</script>

<template>
  <div class="mb-10">
    <button type="button" :aria-expanded="open" class="flex min-h-11 cursor-pointer items-center gap-2 py-1" @click="toggle">
      <FontAwesomeIcon :icon="open ? faChevronDown : faChevronRight" class="text-sm" />
      <h2 class="text-xl font-semibold">{{ title }}</h2>
    </button>

    <div v-if="ready && open">
      <ul class="mt-3 space-y-3">
        <li
          v-for="(id, index) in order"
          :key="id"
          class="flex items-start gap-2"
          :class="{ 'rounded-lg ring-1 ring-[#89b4fa]': over === id && dragging !== id }"
          @dragover="onDragOver($event, id)"
          @drop="onDrop($event, id)"
        >
          <button
            type="button"
            draggable="true"
            :aria-label="`Move item ${index + 1} of ${order.length}, arrow keys`"
            class="mt-2 flex min-h-11 min-w-11 cursor-grab items-center justify-center rounded p-1 text-[#858aa0] hover:text-[#89b4fa]"
            :class="{ 'opacity-40': dragging === id }"
            @dragstart="onDragStart($event, id)"
            @dragend="onDragEnd"
            @keydown.up.prevent="nudge(index, -1)"
            @keydown.down.prevent="nudge(index, 1)"
          >
            <FontAwesomeIcon :icon="faGripVertical" />
          </button>
          <div class="flex-1">
            <slot :id="id" :index="index" />
          </div>
        </li>
      </ul>
      <slot name="footer" />
    </div>
  </div>
</template>
