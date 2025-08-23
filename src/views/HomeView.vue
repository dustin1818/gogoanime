<script setup>
import {onMounted } from "vue";
import { useGogoAnimeStore } from "../store/store";
import "vue3-carousel/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import RightPanel from "../components/RightPanel.vue"
import Navbar from "@/components/Navbar.vue";

const store = useGogoAnimeStore();

onMounted(async () => {
  await store.fetchHomeInfo();
  console.log(store.animeData);
});

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
};

</script>

<template>
  <Navbar />
  <main class="container-anime flex mx-auto py-5 gap-4">
    <div class="left-main w-[1500px]">
      <Carousel
        v-bind="carouselConfig"
        :autoplay="3000"
        :mouse-drag="true"
        :touch-drag="true"
      >
        <Slide v-for="anime in store.animeData.data?.spotlightAnimes" :key="anime.id">
          <div class="carousel__item">
            <div class="card flex text-white gap-3">
              <div class="card-img relative w-full">
                <img class="h-auto" :src="anime.poster" alt="" />

                <div
                  class="anime-description flex flex-col gap-2 absolute bottom-10 right-50 bg-[#0B0A0D] p-2 rounded"
                >
                  <h3 class="title text-xl">{{ anime.name }}</h3>
                  <p class="date text-[#FFC107] text-sm">
                    {{ anime.otherInfo[2] }} TO ?
                  </p>
                  <p class="text-sm">Summary:</p>
                  <p class="summary text-sm">{{ anime.description }}</p>

                  <p class="text-[#FFC107] text-sm">Status: Ongoing</p>
                  <p class="text-sm">Type: {{ anime.type }}</p>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>

      <div class="h-screen bg-[#222222] mt-6">
        <div
          class="orange-border text-white bg-[#DD8808] p-2 px-4 rounded-tr rounded-tl font-['Poppins'] flex justify-between items-center"
        >
          <span class="font-semibold">Top airing</span>
          <span
            class="text-xs border bg-[#222222] border-[#222222] p-1 cursor-pointer"
            >VIEW ALL</span
          >
        </div>
        <div class="grid grid-cols-5 gap-3.5 p-4 font-['Poppins']">
          <div
            class="card cursor-pointer group relative overflow-hidden"
            v-for="anime in store.animeData.data?.topAiringAnimes"
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
                class="text-white text-center block text-xs mt-5 transition-colors duration-300 group-hover:text-[#DD8808]"
              >
                {{ anime.name }}
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <RightPanel />
  </main>
</template>

<style>
.anime-description {
  font-family: "Fira Sans", sans-serif;
}

.anime-description .summary {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.carousel__pagination-button {
  border-radius: 12px;
}

.carousel__next,
.carousel__prev {
  color: #ffffff;
  height: 42px;
  width: auto;
}

.carousel__pagination-button--active {
  background-color: #ffd400;
}
</style>
