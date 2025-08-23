<script setup>
import { ref, onMounted, onUnmounted, reactive } from "vue";
import { useGogoAnimeStore } from "../store/store";
import "vue3-carousel/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import RightPanel from "../components/RightPanel.vue"

const isMobileMenuOpen = ref(false);
const searchQuery = ref("");
const mobileSearchQuery = ref("");
const store = useGogoAnimeStore();

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogin = () => {
  console.log("Login clicked");
};

const handleClickOutside = (event) => {
  const header = event.target.closest("header");
  if (!header && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

const handleResize = () => {
  if (window.innerWidth >= 768 && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", handleResize);

  await store.fetchHomeInfo();
  console.log(store.animeData);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", handleResize);
});

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
};


</script>

<template>
  <header class="bg-[#0B0A0D] font-['Poppins']">
    <div
      class="container mx-auto px-3 py-5 flex justify-between items-center relative"
    >
      <div class="flex items-center gap-8">
        <img class="w-auto h-11" src="../assets/logo.png" alt="Logo" />

        <div class="search-input hidden md:block">
          <input
            class="w-[350px] border border-[#23202A] bg-[#17151B] text-white px-5 py-2 rounded placeholder-white text-sm focus:outline-none focus:border-[#DD8808]"
            type="text"
            placeholder="Search..."
            v-model="searchQuery"
          />
        </div>
      </div>

      <div class="hidden bg-transparent md:block">
        <button
          class="text-white bg-[#DD8808] hover:bg-[#c47807] px-5 py-2.5 uppercase rounded transition-colors duration-300"
          @click="handleLogin"
        >
          Login
        </button>
      </div>

      <div
        class="md:hidden flex flex-col cursor-pointer p-1"
        @click="toggleMobileMenu"
      >
        <div
          class="w-6 h-0.5 bg-white my-0.5 transition-transform duration-300 rounded"
          :class="{ 'transform rotate-45 translate-y-1.5': isMobileMenuOpen }"
        ></div>
        <div
          class="w-6 h-0.5 bg-white my-0.5 transition-opacity duration-300 rounded"
          :class="{ 'opacity-0': isMobileMenuOpen }"
        ></div>
        <div
          class="w-6 h-0.5 bg-white my-0.5 transition-transform duration-300 rounded"
          :class="{ 'transform -rotate-45 -translate-y-1.5': isMobileMenuOpen }"
        ></div>
      </div>
    </div>

    <!-- mobile menu  -->
    <div
      class="md:hidden bg-[#17151B] border-t border-[#23202A] px-3 py-5 flex flex-col gap-5 transition-all duration-300 overflow-hidden"
      :class="isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
    >
      <div class="mobile-search-input">
        <input
          class="w-full border border-[#23202A] bg-[#17151B] text-white px-5 py-1.5 rounded placeholder-white text-sm focus:outline-none focus:border-[#DD8808]"
          type="text"
          placeholder="Search..."
          v-model="mobileSearchQuery"
        />
      </div>

      <button
        class="text-white bg-[#DD8808] hover:bg-[#c47807] px-5 py-3 uppercase rounded transition-colors duration-300 self-start"
        @click="handleLogin"
      >
        Login
      </button>
    </div>

    <div class="bg-[#DD8808]">
      <div
        class="orange-upper container mx-auto px-3 py-3 flex text-white gap-5"
      >
        <span>Home</span>
        <span>Schedule</span>
        <span>Bookmark</span>
        <span>TV Series</span>
        <span>Movies</span>
      </div>
    </div>
  </header>

  <main class="container flex mx-auto py-5 gap-4">
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
@import url("https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

:root {
  --vc-pgn-height: 12px;
  --vc-pgn-width: 12px;
}

.container {
  max-width: 1224px;
}

.orange-upper span:hover {
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.1s ease;
  color: #333333;
}

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

.right-main {
  height: 100vh;
}
</style>
