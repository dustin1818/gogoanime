<script setup>
import { onMounted } from "vue";
import { useGogoAnimeStore } from "../store/store";
import Modal from "@/components/Modal.vue";
import Ongoing from "../components/Ongoing.vue";
import Categories from "../components/Categories.vue";

const store = useGogoAnimeStore();

onMounted(async () => {
  if (!store.animeData.value?.data) {
    await store.fetchHomeInfo();
  }
});
</script>

<template>
  <div class="right-main w-[650px]">
    <div class="border border-[#222222] rounded bg-[#222222] p-3">
      <div
        class="font-['Poppins'] flex items-center justify-center gap-1 border border-[#333333] rounded bg-[#333333] text-white text-center text-sm p-3 cursor-pointer"
        @click="store.showGenreModal"
      >
        Genre all
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="#FFFFFF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <Modal :show="store.isModalOpen" @close="store.isModalOpen = false">
        <div class="flex flex-wrap gap-3">
          <div
            class="flex gap-1"
            v-for="genre in store.animeData.data.genres"
            :key="genre"
          >
            <input
              type="checkbox"
              :value="genre"
              v-model="store.selectedGenres"
              class="cursor-pointer"
            />
            <span>{{ genre }}</span>
          </div>
        </div>
      </Modal>

      <button
        class="flex items-center justify-center gap-1 p-2 mt-4 rounded w-full text-white text-sm text-center bg-[#DD8808]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#FFFFFF"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>

        Search
      </button>
    </div>
    
    <Ongoing :ongoing-anime="store.animeData.data?.latestEpisodeAnimes" />
    <Categories :categories-anime="store.animeData.data?.top10Animes" />
  </div>
</template>

<style></style>
