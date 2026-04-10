<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useGogoAnimeStore } from "../store/store";
import { useRoute } from "vue-router";

const route = useRoute();

const store = useGogoAnimeStore();
const episodeValue = ref("");
const isLoading = ref(false);
const visibleEpisodes = ref(new Set());

const filteredEpisodes = computed(() => {
  if (!episodeValue.value) return store.episodeData?.data;

  return store.episodeData.data?.filter((ep) => {
    const query = episodeValue.value.toLowerCase().trim();
    return (
      `episode ${ep.episodeNumber}`.toLowerCase().includes(query) ||
      ep.episodeNumber.toString().includes(query)
    );
  });
});

const animateEpisodes = () => {
  visibleEpisodes.value = new Set();
  filteredEpisodes.value?.forEach((_, i) => {
    setTimeout(() => {
      visibleEpisodes.value = new Set([...visibleEpisodes.value, i]);
    }, i * 20);
  });
};

const loadEpisodes = async () => {
  if (!store.currentAnimeId) return;

  try {
    isLoading.value = true;
    await store.fetchAnimeEpisodes(store.currentAnimeId);
    animateEpisodes();
  } catch (error) {
    console.error("Failed to load episodes:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadEpisodes();
});

watch(
  () => store.currentAnimeId,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      await loadEpisodes();
    }
  },
  { immediate: false },
);

watch(
  () => route.params,
  () => {
    if (!store.episodeData?.data?.length) {
      loadEpisodes();
    }
  },
  { deep: true },
);

watch(filteredEpisodes, () => {
  animateEpisodes();
});
</script>

<template>
  <div class="flex items-center justify-center py-16" v-if="isLoading">
    <div class="flex flex-col items-center gap-3">
      <div class="ep-spinner"></div>
      <span class="text-gray-400 text-sm">Loading episodes...</span>
    </div>
  </div>

  <div class="w-full mt-8" v-else>
    <div class="flex items-center justify-between w-full mb-3">
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-[#DD8808]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <span class="text-white font-semibold text-sm font-['Poppins']">
          Episodes
          <span
            v-if="store.episodeData?.data?.length"
            class="text-gray-400 font-normal"
          >
            ({{ store.episodeData.data.length }})
          </span>
        </span>
      </div>
      <div class="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          v-model="episodeValue"
          placeholder="Search episode..."
          class="rounded-lg bg-[#2a2a30] text-sm text-gray-300 placeholder-gray-500 pl-8 pr-3 py-1.5 w-44 focus:outline-none focus:ring-1 focus:ring-[#DD8808]/50 transition-all duration-200"
        />
      </div>
    </div>

    <div
      class="rounded-xl bg-[#1a1a1f] border border-[#2a2a30] overflow-hidden"
    >
      <div
        v-if="!filteredEpisodes?.length"
        class="text-center text-gray-500 py-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 mx-auto mb-2 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          />
        </svg>
        No episodes found
      </div>
      <div
        v-else
        class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 p-3 max-h-[420px] overflow-y-auto ep-scrollbar"
      >
        <router-link
          v-for="(episode, index) in filteredEpisodes"
          :key="episode.number"
          :to="`/anime-episodes/${episode.id}`"
          class="ep-btn relative rounded-lg px-2 py-2.5 text-center text-sm font-medium transition-all duration-300 border"
          :class="[
            route.params.title === episode.id
              ? 'bg-[#DD8808] text-[#0b0a0d] border-[#DD8808] shadow-[0_0_12px_rgba(221,136,8,0.3)] font-bold ep-active'
              : 'bg-[#2a2a30] text-gray-300 border-[#333338] hover:bg-[#DD8808]/20 hover:border-[#DD8808]/50 hover:text-white',
            visibleEpisodes.has(index) ? 'ep-visible' : 'ep-hidden',
          ]"
        >
          <span
            class="block text-[10px] text-current opacity-60 leading-none mb-0.5"
            >EP</span
          >
          {{ episode.episodeNumber }}
          <span
            v-if="route.params.title === episode.id"
            class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#DD8808] rounded-full ep-pulse"
          ></span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ep-hidden {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
.ep-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.ep-btn:active {
  transform: scale(0.93);
}
.ep-active {
  animation: epSelect 0.4s ease;
}
@keyframes epSelect {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.12);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}
.ep-pulse {
  animation: epPulse 1.5s ease-in-out infinite;
}
@keyframes epPulse {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(221, 136, 8, 0.6);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 0 6px rgba(221, 136, 8, 0);
  }
}
.ep-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #2a2a30;
  border-top-color: #dd8808;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.ep-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.ep-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.ep-scrollbar::-webkit-scrollbar-thumb {
  background: #333338;
  border-radius: 4px;
}
.ep-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #dd8808;
}
</style>
