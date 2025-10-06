<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useGogoAnimeStore } from "../store/store";
import { useRoute } from "vue-router";

const route = useRoute();

const store = useGogoAnimeStore();
const episodeValue = ref("");
const isLoading = ref(false);

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

const loadEpisodes = async () => {
  if (!store.currentAnimeId) return;

  try {
    isLoading.value = true;
    await store.fetchAnimeEpisodes(store.currentAnimeId);
  } catch (error) {
    console.error('Failed to load episodes:', error);


  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadEpisodes();
});

watch(() => store.currentAnimeId, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    await loadEpisodes();
  }
}, { immediate: false });

watch(() => route.params, () => {
  if (!store.episodeData?.data?.length) {
    loadEpisodes();
  }
}, { deep: true });

</script>

<template class="bg-gray-900">
    <div
    class="text-white text-2xl text-center min-h-screen mx-auto flex justify-center items-center"
    v-if="isLoading"
  >
    Loading...
  </div>

  <div class="w-full mt-8" v-else>
    <div class="flex w-full">
      <input
        type="text"
        v-model="episodeValue"
        placeholder="Find episode number exactly"
        class="mb-3 ml-auto rounded-md bg-[#222222] text-sm text-gray-300 placeholder-gray-600 px-3 py-2 focus:outline-none focus:ring focus:ring-gray-600"
      />
    </div>
    <div class="p-4 bg-[#1A1A1A] text-white">
      <div v-if="!filteredEpisodes?.length" class="text-center text-gray-400 py-4">
        No episodes available
      </div>
      <div v-else class="grid grid-cols-3 md:grid-cols-5 gap-4">
        <button
          class="rounded-md bg-[#3B3B3B] px-4 py-2 hover:bg-[#DD8808] hover:text-white"
          :class="{ 'bg-[#DD8808] text-white': route.params.title === episode.id }"
          v-for="episode in filteredEpisodes"
          :key="episode.number"
        >
          <router-link :to="`/anime-episodes/${episode.id}`">
            Episode {{ episode.episodeNumber }}
          </router-link>
        </button>
      </div>
    </div>
  </div>
  </template>
