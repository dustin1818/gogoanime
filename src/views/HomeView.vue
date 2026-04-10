<script setup>
import { computed, onMounted, ref } from "vue";
import { useGogoAnimeStore } from "../store/store";
import "vue3-carousel/carousel.css";
import { Carousel, Slide } from "vue3-carousel";
import RightPanel from "../components/RightPanel.vue";
import Navbar from "@/components/Navbar.vue";
import Loading from "@/components/Loading.vue";

const store = useGogoAnimeStore();
const heroCarousel = ref(null);
const currentSlide = ref(0);
const isLoading = ref(true);
const spotlightAnime = computed(() => store.animeData.data?.spotlight ?? []);

onMounted(async () => {
  await store.fetchHomeInfo();
  isLoading.value = false;
});

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
};

const prevSlide = () => {
  heroCarousel.value?.prev();
};

const nextSlide = () => {
  heroCarousel.value?.next();
};

const goToSlide = (index) => {
  heroCarousel.value?.slideTo(index);
};
</script>

<template>
  <Loading v-if="isLoading" />
  <template v-else>
    <Navbar />
    <main
      class="container-anime flex flex-col xl:flex-row mx-auto py-5 gap-4 px-3"
    >
      <div class="left-main min-w-0 flex-1">
        <div class="relative">
          <Carousel
            ref="heroCarousel"
            class="home-hero-carousel"
            v-model="currentSlide"
            v-bind="carouselConfig"
            :autoplay="4500"
            :mouse-drag="true"
            :touch-drag="true"
          >
            <Slide v-for="anime in spotlightAnime" :key="anime.id">
              <div>
                <div
                  class="relative min-h-[420px] overflow-hidden rounded-[22px] border border-[#2e2619] bg-[radial-gradient(circle_at_top_left,rgba(221,136,8,0.3),transparent_32%),linear-gradient(140deg,#1a1410_0%,#0b0a0d_42%,#121212_100%)] text-white shadow-[0_24px_60px_rgba(0,0,0,0.35)] max-md:min-h-[500px]"
                >
                  <img
                    class="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center saturate-[1.05]"
                    :src="anime.poster"
                    :alt="anime.title"
                  />

                  <div
                    class="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,10,13,0.95)_0%,rgba(11,10,13,0.8)_34%,rgba(11,10,13,0.35)_62%,rgba(11,10,13,0.82)_100%),linear-gradient(180deg,rgba(11,10,13,0.08)_0%,rgba(11,10,13,0.72)_100%)] max-md:bg-[linear-gradient(180deg,rgba(11,10,13,0.2)_0%,rgba(11,10,13,0.86)_52%,rgba(11,10,13,0.98)_100%),linear-gradient(90deg,rgba(11,10,13,0.85)_0%,rgba(11,10,13,0.25)_100%)]"
                  ></div>

                  <div
                    class="pointer-events-none absolute -bottom-20 -left-10 h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(221,136,8,0.28)_0%,rgba(221,136,8,0)_70%)]"
                  ></div>

                  <div
                    class="relative z-[1] flex min-h-[420px] items-end justify-between gap-8 p-8 max-md:min-h-[500px] max-md:p-[1.35rem]"
                  >
                    <div
                      class="flex max-w-[650px] flex-col gap-4 max-md:max-w-full max-md:gap-[0.85rem]"
                    >
                      <div class="flex flex-wrap items-center gap-[0.65rem]">
                        <span
                          class="rounded-full border border-[rgba(221,136,8,0.8)] bg-[rgba(221,136,8,0.16)] px-[0.8rem] py-[0.42rem] text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#ffcc68] backdrop-blur-[14px]"
                        >
                          Spotlight
                        </span>
                        <span
                          class="rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(20,18,22,0.68)] px-[0.8rem] py-[0.42rem] text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#f6f4f0] backdrop-blur-[14px]"
                        >
                          {{ anime.type }}
                        </span>
                        <span
                          class="rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(20,18,22,0.68)] px-[0.8rem] py-[0.42rem] text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#f6f4f0] backdrop-blur-[14px]"
                        >
                          {{ anime.aired }}
                        </span>
                      </div>

                      <h2
                        class="max-w-[11ch] overflow-hidden text-ellipsis font-['Poppins'] text-[clamp(1rem,4vw,2.5rem)] font-bold leading-[1.02] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] max-md:max-w-full max-md:text-[2rem] max-md:[-webkit-line-clamp:3]"
                        :title="anime.title"
                      >
                        {{ anime.title }}
                      </h2>

                      <p
                        class="max-w-[58ch] overflow-hidden font-['Fira_Sans'] text-base leading-[1.55] text-[rgba(255,255,255,0.84)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] max-md:text-[0.95rem] max-md:[-webkit-line-clamp:4]"
                      >
                        {{ anime.synopsis }}
                      </p>

                      <div class="flex flex-wrap gap-[0.85rem]">
                        <div
                          class="min-w-[110px] rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(11,10,13,0.7)] px-4 py-[0.9rem] backdrop-blur-[12px]"
                        >
                          <span
                            class="mb-[0.3rem] block text-[0.72rem] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.56)]"
                          >
                            Status
                          </span>
                          <span class="font-semibold text-[#ffcb66]"
                            >Ongoing</span
                          >
                        </div>
                        <div
                          class="min-w-[110px] rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(11,10,13,0.7)] px-4 py-[0.9rem] backdrop-blur-[12px]"
                        >
                          <span
                            class="mb-[0.3rem] block text-[0.72rem] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.56)]"
                          >
                            Format
                          </span>
                          <span class="font-semibold text-[#ffcb66]">{{
                            anime.type
                          }}</span>
                        </div>
                      </div>

                      <div class="flex flex-wrap gap-[0.85rem] max-md:flex-col">
                        <router-link
                          :to="`/anime-info/${anime.id}`"
                          class="inline-flex min-w-[160px] items-center justify-center rounded-full bg-[#dd8808] px-[1.2rem] py-[0.88rem] font-semibold text-[#0b0a0d] transition duration-300 hover:-translate-y-px hover:bg-[#f19a16] max-md:w-full"
                        >
                          View Details
                        </router-link>
                        <router-link
                          :to="`/anime-info/${anime.id}`"
                          class="inline-flex min-w-[160px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(20,18,22,0.52)] px-[1.2rem] py-[0.88rem] font-semibold text-white backdrop-blur-[12px] transition duration-300 hover:-translate-y-px hover:border-[rgba(221,136,8,0.7)] hover:text-[#ffcb66] max-md:w-full"
                        >
                          Explore Anime
                        </router-link>
                      </div>
                    </div>

                    <div class="hidden items-end md:flex">
                      <div
                        class="relative w-[240px] rounded-[24px] border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(180deg,rgba(24,21,27,0.9)_0%,rgba(11,10,13,0.95)_100%)] p-[0.8rem] shadow-[0_20px_48px_rgba(0,0,0,0.4)] backdrop-blur-[14px]"
                      >
                        <div
                          class="absolute left-4 top-4 z-[1] rounded-full bg-[#dd8808] px-[0.72rem] py-[0.38rem] text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[#0b0a0d]"
                        >
                          Featured
                        </div>
                        <img
                          class="h-[330px] w-full rounded-[18px] object-cover"
                          :src="anime.poster"
                          :alt="anime.title"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Slide>
          </Carousel>

          <button
            v-if="spotlightAnime.length > 1"
            type="button"
            aria-label="Previous slide"
            class="absolute left-4 top-1/2 z-20 flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(11,10,13,0.55)] text-white backdrop-blur-[12px] transition duration-300 hover:-translate-y-[calc(50%+1px)] hover:border-[rgba(221,136,8,0.72)] hover:bg-[rgba(221,136,8,0.18)] md:h-[52px] md:w-[52px]"
            @click="prevSlide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 18l-6-6 6-6"
              />
            </svg>
          </button>

          <button
            v-if="spotlightAnime.length > 1"
            type="button"
            aria-label="Next slide"
            class="absolute right-4 top-1/2 z-20 flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(11,10,13,0.55)] text-white backdrop-blur-[12px] transition duration-300 hover:-translate-y-[calc(50%+1px)] hover:border-[rgba(221,136,8,0.72)] hover:bg-[rgba(221,136,8,0.18)] md:h-[52px] md:w-[52px]"
            @click="nextSlide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 6l6 6-6 6"
              />
            </svg>
          </button>

          <div
            v-if="spotlightAnime.length > 1"
            class="relative z-20 mt-0 flex justify-center gap-2 px-4 pb-1"
          >
            <button
              v-for="(_, index) in spotlightAnime"
              :key="index"
              type="button"
              :aria-label="`Go to slide ${index + 1}`"
              class="h-1.5 rounded-full transition-all duration-300"
              :class="
                currentSlide === index
                  ? 'w-8 bg-[#dd8808]'
                  : 'w-6 bg-white/15 hover:bg-white/30'
              "
              @click="goToSlide(index)"
            ></button>
          </div>
        </div>

        <div class="bg-[#222222] mt-6">
          <div
            class="orange-border text-white bg-[#DD8808] p-2 px-4 rounded-tr rounded-tl font-['Poppins'] flex justify-between items-center"
          >
            <span class="font-semibold">Latest Episode</span>
            <router-link
              to="/anime/recently-added"
              class="text-xs border bg-[#222222] border-[#222222] p-1 cursor-pointer"
              >VIEW ALL</router-link
            >
          </div>
          <div
            class="grid grid-cols-2 md:grid-cols-6 gap-3.5 p-4 font-['Poppins']"
          >
            <div
              class="card cursor-pointer group relative overflow-hidden"
              v-for="anime in store.animeData.data?.latestEpisode"
              :key="anime.id"
            >
              <router-link :to="`/anime-info/${anime.id}`">
                <div class="relative">
                  <img
                    :src="anime.poster"
                    :alt="anime.name"
                    class="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <span
                    v-if="anime.type"
                    class="absolute top-2 right-2 bg-[#C32F00] text-white text-xs px-2 py-0.5 rounded"
                  >
                    {{ anime.type }}
                  </span>

                  <span
                    class="absolute bottom-2 left-2 bg-[#0B0A0D] text-white text-xs px-2 py-0.5 rounded"
                  >
                    Ep: {{ anime.episodes?.sub }}/{{ anime.episodes?.eps }}
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
        </div>

        <div class="bg-[#222222] mt-6">
          <div
            class="orange-border text-white bg-[#DD8808] p-2 px-4 rounded-tr rounded-tl font-['Poppins'] flex justify-between items-center"
          >
            <span class="font-semibold">New on AniWatch</span>
            <router-link
              to="/anime/new-on-aniwatch"
              class="text-xs border bg-[#222222] border-[#222222] p-1 cursor-pointer"
              >VIEW ALL</router-link
            >
          </div>
          <div
            class="grid grid-cols-2 md:grid-cols-6 gap-3.5 p-4 font-['Poppins']"
          >
            <div
              class="card cursor-pointer group relative overflow-hidden"
              v-for="anime in store.animeData.data?.newOnAniWatch"
              :key="anime.id"
            >
              <router-link :to="`/anime-info/${anime.id}`">
                <div class="relative">
                  <img
                    :src="anime.poster"
                    :alt="anime.name"
                    class="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <span
                    v-if="anime.type"
                    class="absolute top-2 right-2 bg-[#C32F00] text-white text-xs px-2 py-0.5 rounded"
                  >
                    {{ anime.type }}
                  </span>

                  <span
                    class="absolute bottom-2 left-2 bg-[#0B0A0D] text-white text-xs px-2 py-0.5 rounded"
                  >
                    Ep: {{ anime.episodes?.sub }}/{{ anime.episodes?.eps }}
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
        </div>

        <div class="bg-[#222222] mt-6">
          <div
            class="orange-border text-white bg-[#DD8808] p-2 px-4 rounded-tr rounded-tl font-['Poppins'] flex justify-between items-center"
          >
            <span class="font-semibold">Top Upcoming</span>
            <router-link
              to="/anime/top-upcoming"
              class="text-xs border bg-[#222222] border-[#222222] p-1 cursor-pointer"
              >VIEW ALL</router-link
            >
          </div>
          <div
            class="grid grid-cols-2 md:grid-cols-6 gap-3.5 p-4 font-['Poppins']"
          >
            <div
              class="card cursor-pointer group relative overflow-hidden"
              v-for="anime in store.animeData.data?.topUpcoming"
              :key="anime.id"
            >
              <router-link :to="`/anime-info/${anime.id}`">
                <div class="relative">
                  <img
                    :src="anime.poster"
                    :alt="anime.name"
                    class="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <span
                    v-if="anime.type"
                    class="absolute top-2 right-2 bg-[#C32F00] text-white text-xs px-2 py-0.5 rounded"
                  >
                    {{ anime.type }}
                  </span>

                  <span
                    v-if="anime.episodes?.sub || anime.episodes?.eps"
                    class="absolute bottom-2 left-2 bg-[#0B0A0D] text-white text-xs px-2 py-0.5 rounded"
                  >
                    Ep: {{ anime.episodes?.sub }}/{{ anime.episodes?.eps }}
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
        </div>

        <div class="bg-[#222222] mt-6">
          <div
            class="orange-border text-white bg-[#DD8808] p-2 px-4 rounded-tr rounded-tl font-['Poppins'] flex justify-between items-center"
          >
            <span class="font-semibold">Trending</span>
            <router-link
              to="/anime/trending"
              class="text-xs border bg-[#222222] border-[#222222] p-1 cursor-pointer"
              >VIEW ALL</router-link
            >
          </div>
          <div
            class="grid grid-cols-2 md:grid-cols-6 gap-3.5 p-4 font-['Poppins']"
          >
            <div
              class="card cursor-pointer group relative overflow-hidden"
              v-for="anime in store.animeData.data?.trending"
              :key="anime.id"
            >
              <router-link :to="`/anime-info/${anime.id}`">
                <div class="relative">
                  <img
                    :src="anime.poster"
                    :alt="anime.name"
                    class="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <span
                    v-if="anime.type"
                    class="absolute top-2 right-2 bg-[#C32F00] text-white text-xs px-2 py-0.5 rounded"
                  >
                    {{ anime.type }}
                  </span>

                  <span
                    v-if="anime.episodes?.eps"
                    class="absolute bottom-2 left-2 bg-[#0B0A0D] text-white text-xs px-2 py-0.5 rounded"
                  >
                    Ep: {{ anime.episodes?.eps }}/{{ anime.episodes?.sub }}
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
        </div>
      </div>

      <RightPanel />
    </main>
  </template>
</template>
