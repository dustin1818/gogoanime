<script setup>
import { onMounted, ref } from "vue";
import { useGogoAnimeStore } from "../store/store";
import Navbar from "@/components/Navbar.vue";
import RightPanel from "@/components/RightPanel.vue";

const store = useGogoAnimeStore();
const popularData = ref([]);
const currentPage = ref(1);

onMounted(async () => {
  popularData.value = await store.fetchPopularAnime(currentPage.value);
});

const nextPage = async () => {
  currentPage.value += 1;
  popularData.value = await store.fetchPopularAnime(currentPage.value);
};

const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    popularData.value = await store.fetchPopularAnime(currentPage.value);
  }
};
</script>

<template>
  <Navbar />

  <main class="container-anime flex flex-col md:flex-row mx-auto py-5 gap-4">
    <div class="left-main w-full lg:w-[1500px]">
      <div class="bg-[#222222] mt-6 p-0.5">
        <div
          class="orange-border text-white bg-[#DD8808] p-2 px-4 rounded-tr rounded-tl font-['Poppins'] flex justify-between items-center"
        >
          <span class="font-semibold">Popular</span>
        </div>
        <div
          class="grid grid-cols-2 md:grid-cols-6 gap-3.5 p-4 font-['Poppins']"
        >
          <div
            class="card cursor-pointer group relative overflow-hidden"
            v-for="anime in popularData.data?.response"
            :key="anime.id"
          >
            <router-link :to="`/anime-info/${anime.id}`">
              <div class="relative">
                <img
                  :src="anime.poster"
                  :alt="anime.name"
                  class="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                <span
                  class="absolute top-2 right-2 bg-[#C32F00] text-white text-xs px-2 py-0.5 rounded"
                >
                  {{ anime.type }} Show
                </span>

                <span
                  class="absolute bottom-2 left-2 bg-[#0B0A0D] text-white text-xs px-2 py-0.5 rounded"
                >
                  Ep: {{ anime.episodes.sub }}/{{ anime.episodes.sub }}
                </span>

                <span
                  class="absolute bottom-2 right-2 bg-[#DD8808] text-black text-xs px-2 py-0.5 rounded"
                >
                  Sub
                </span>

                <div
                  class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div
                    class="bg-white/70 w-12 h-12 rounded-full flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-black"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6 4l10 6-10 6V4z" />
                    </svg>
                  </div>
                </div>
              </div>

              <span
                class="text-white text-center block text-xs mt-2 mb-5 transition-colors duration-300 group-hover:text-[#DD8808]"
              >
                {{ anime.title }}
              </span>
            </router-link>
          </div>
        </div>

        <div class="w-full flex flex-row-reverse justify-center items-center gap-2.5 mb-3 mt-5">
          <button
            @click="nextPage"
            class="text-white cursor-pointer bg-[#DD8808] hover:bg-[#c47807] text-sm flex items-center px-10 py-2 rounded transition-colors duration-300 self-start"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div class="text-white">Page {{ currentPage }}</div>

          <button
            @click="prevPage"
            v-if="currentPage > 1"
            class="text-white cursor-pointer bg-[#DD8808] hover:bg-[#c47807] text-sm flex flex-row-reverse items-center px-10 py-2 rounded transition-colors duration-300 self-start"
          >
            Prev
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <RightPanel />
  </main>
</template>
