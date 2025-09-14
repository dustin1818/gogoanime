<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useGogoAnimeStore } from "../store/store";

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

onMounted(async () => {
  try {
    isLoading.value = true;
    if (store.currentAnimeId) {
    await store.fetchAnimeEpisodes(store.currentAnimeId);
  }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false;
  }
  
});

watch(() => store.currentAnimeId, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    await store.fetchAnimeEpisodes(newId);
  }
}, { immediate: false });
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
      <div class="grid grid-cols-5 gap-2">
        <button
          class="rounded-md border border-gray-400 bg-[#3B3B3B] px-4 py-2 hover:bg-[#3b3b3bef] hover:text-[#DD8808]"
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