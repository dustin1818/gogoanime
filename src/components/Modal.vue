<script setup>

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

function emitClose() {
  emit("close");
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
    @click.self="emitClose"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <button
        @click="emitClose"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        aria-label="Close modal"
      >
        &times;
      </button>
      <slot />
    </div>
  </div>
</template>
