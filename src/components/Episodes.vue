<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useGogoAnimeStore } from "../store/store";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const store = useGogoAnimeStore();
const episodeValue = ref("");
const isLoading = ref(false);
const error = ref(null);

const STORAGE_KEYS = {
  EPISODE_DATA: 'gogo_anime_episodes',
  SELECTED_EPISODE: 'gogo_selected_episode',
  SEARCH_QUERY: 'gogo_episode_search',
  CURRENT_ANIME_ID: 'gogo_current_anime_id'
};

const filteredEpisodes = computed(() => {
  let episodes = store.episodeData?.data || [];
  
  if (episodes.length === 0) {
    const cachedData = localStorage.getItem(STORAGE_KEYS.EPISODE_DATA);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        episodes = parsed?.data || [];
      } catch (e) {
        console.warn('Failed to parse cached episodes in computed');
      }
    }
  }
  
  if (!episodeValue.value) return episodes;

  return episodes.filter((ep) => {
    const query = episodeValue.value.toLowerCase().trim();
    return (
      `episode ${ep.episodeNumber}`.toLowerCase().includes(query) ||
      ep.episodeNumber.toString().includes(query)
    );
  });
});

const getSelectedEpisode = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_EPISODE);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const loadEpisodes = async () => {   
  if (!store.currentAnimeId) {
    const storedAnimeId = localStorage.getItem(STORAGE_KEYS.CURRENT_ANIME_ID);
    if (storedAnimeId && !store.currentAnimeId) {
      store.currentAnimeId = storedAnimeId;
    } else if (!store.currentAnimeId) {
      console.warn('No anime ID available');
      return;
    }
  }
  
  const cachedAnimeId = localStorage.getItem(STORAGE_KEYS.CURRENT_ANIME_ID);
  const cachedEpisodeData = localStorage.getItem(STORAGE_KEYS.EPISODE_DATA);
  
  if (cachedAnimeId === store.currentAnimeId && cachedEpisodeData) {
    try {
      const parsedData = JSON.parse(cachedEpisodeData);
      store.episodeData = parsedData;
      console.log('Loaded episodes from cache:', parsedData);
      return;
    } catch (e) {
      console.warn('Failed to parse cached episode data:', e);
      localStorage.removeItem(STORAGE_KEYS.EPISODE_DATA);
    }
  }
  
  try {
    isLoading.value = true;
    error.value = null;
    console.log('Fetching episodes for anime:', store.currentAnimeId);
    await store.fetchAnimeEpisodes(store.currentAnimeId);
    
    if (store.episodeData) {
      localStorage.setItem(STORAGE_KEYS.EPISODE_DATA, JSON.stringify(store.episodeData));
      localStorage.setItem(STORAGE_KEYS.CURRENT_ANIME_ID, store.currentAnimeId);
      console.log('Saved episodes to cache:', store.episodeData);
    }
  } catch (err) {
    console.error('Failed to load episodes:', err);
    error.value = 'Failed to load episodes. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const selectEpisode = (episode) => {
  const selectedData = {
    id: episode.id,
    episodeNumber: episode.episodeNumber,
    animeId: store.currentAnimeId,
    timestamp: Date.now()
  };
  localStorage.setItem(STORAGE_KEYS.SELECTED_EPISODE, JSON.stringify(selectedData));
  
  router.push(`/anime-episodes/${episode.id}`);
};

const clearSearch = () => {
  episodeValue.value = "";
  localStorage.setItem(STORAGE_KEYS.SEARCH_QUERY, "");
};

const initializeFromStorage = () => {
  console.log('Initializing from storage...');
  
  const savedSearch = localStorage.getItem(STORAGE_KEYS.SEARCH_QUERY);
  if (savedSearch) {
    episodeValue.value = savedSearch;
    console.log('Restored search query:', savedSearch);
  }
  
  const savedAnimeId = localStorage.getItem(STORAGE_KEYS.CURRENT_ANIME_ID);
  if (savedAnimeId && !store.currentAnimeId) {
    store.currentAnimeId = savedAnimeId;
    console.log('Restored anime ID:', savedAnimeId);
  }
  
  const savedEpisodeData = localStorage.getItem(STORAGE_KEYS.EPISODE_DATA);
  if (savedAnimeId === store.currentAnimeId && savedEpisodeData) {
    try {
      const parsedData = JSON.parse(savedEpisodeData);
      store.episodeData = parsedData;
      console.log('Restored episode data:', parsedData);
    } catch (e) {
      console.warn('Failed to parse saved episode data:', e);
      localStorage.removeItem(STORAGE_KEYS.EPISODE_DATA);
    }
  }
  
  const selectedEpisode = getSelectedEpisode();
  if (selectedEpisode && selectedEpisode.animeId === store.currentAnimeId) {
    console.log('Restoring selected episode:', selectedEpisode);
    if (route.params.title !== selectedEpisode.id) {
      router.push(`/anime-episodes/${selectedEpisode.id}`);
    }
  }
};

watch(episodeValue, (newValue) => {
  localStorage.setItem(STORAGE_KEYS.SEARCH_QUERY, newValue);
});

watch(() => store.currentAnimeId, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    episodeValue.value = "";
    localStorage.setItem(STORAGE_KEYS.SEARCH_QUERY, "");
    localStorage.removeItem(STORAGE_KEYS.SELECTED_EPISODE);
    await loadEpisodes();
  }
}, { immediate: false });

watch(() => route.params.title, (newTitle) => {
  if (newTitle && store.episodeData?.data) {
    const currentEpisode = store.episodeData.data.find(ep => ep.id === newTitle);
    if (currentEpisode) {
      const selectedData = {
        id: currentEpisode.id,
        episodeNumber: currentEpisode.episodeNumber,
        animeId: store.currentAnimeId,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.SELECTED_EPISODE, JSON.stringify(selectedData));
    }
  }
});

watch(() => route.params, () => {
  if (!store.episodeData?.data?.length) {
    loadEpisodes();
  }
}, { deep: true });

onMounted(async () => {
  console.log('Component mounted. Current anime ID:', store.currentAnimeId);
  console.log('Route params:', route.params);
  
  initializeFromStorage();
  
  if (!store.episodeData?.data?.length) {
    console.log('No episodes found, loading...');
    await loadEpisodes();
  } else {
    console.log('Episodes available:', store.episodeData.data.length);
  }
});
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