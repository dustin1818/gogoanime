<script setup>
import { onMounted, reactive, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useGogoAnimeStore } from "../store/store";
import Swal from "sweetalert2";
import Modal from "@/components/Modal.vue";
import RightPanel from "../components/RightPanel.vue";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
const store = useGogoAnimeStore();
const episodeValue = ref("");

const anime = reactive({
  data: {},
  eps: {},
});

const isLoading = ref(false);

const fetchAnime = async (id) => {
  try {
    isLoading.value = true;
    const [animeData, animeEps] = await Promise.all([
      store.fetchAnimeInfo(id),
      store.fetchAnimeEpisodes(id),
    ]);
    anime.data = animeData.data;
    anime.eps = animeEps.data;
    console.log(anime.eps);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAnime(route.params.id);
});

watch(
  () => route.params.id,
  (newId) => {
    fetchAnime(newId);
  }
);

const showModal = ref(false);
const openModal = () => (showModal.value = true);
const closeModal = () => (showModal.value = false);

const bookmarkPage = () => {
  Swal.fire({
    title: "Bookmark Page",
    text: "Do you want to bookmark?",
    icon: "question",
    confirmButtonText: "Confirm",
    confirmButtonColor: "#DD8808",
  });
};

const postComment = () => {
  Swal.fire({
    title: "Post Comment",
    text: "Do you want to post this comment?",
    icon: "question",
    confirmButtonText: "Confirm",
    confirmButtonColor: "#DD8808",
  });
};

const filteredEpisodes = computed(() => {
  if (!episodeValue.value) return anime.eps.episodes;

  return anime.eps.episodes.filter((ep) => {
    const query = episodeValue.value.toLowerCase().trim();
    return (
      `episode ${ep.number}`.toLowerCase().includes(query) ||
      ep.number.toString().includes(query)
    );
  });
});
</script>

<template class="bg-gray-900 text-white min-h-screen">
  <div
    class="text-white text-2xl text-center min-h-screen flex justify-center items-center"
    v-if="isLoading"
  >
    Loading...
  </div>

  <div v-else>
    <Navbar />

    <div
      class="anime-info container-anime flex items-start mx-auto gap-9 px-3 py-5"
    >
      <Modal
        :show="showModal"
        @close="closeModal"
        v-if="anime.data.anime?.info.promotionalVideos[0]?.source"
      >
        <iframe
          width="100%"
          height="315"
          :src="anime.data.anime?.info.promotionalVideos[0].source"
          :title="anime.data.anime?.info.promotionalVideos[0].title"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        >
        </iframe>
      </Modal>

      <template v-else>
        <Modal :show="showModal" @close="closeModal">
          <h1 class="font=['Poppins'] text-2xl text-center">
            No trailer at the moment
          </h1>
        </Modal>
      </template>

      <div class="flex flex-col items-start basis-[1700px]">
        <div class="flex gap-8 bg-[#222222] rounded p-6 font-['Poppins']">
          <div class="lg:w-50 flex-shrink-0">
            <div class="relative mb-4">
              <img
                :src="anime.data.anime?.info.poster"
                :alt="anime.data.anime?.info.poster"
                class="w-full object-center rounded-lg shadow-lg"
              />
            </div>

            <div class="space-y-3">
              <button
                @click="openModal"
                class="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <i class="fab fa-youtube"></i>
                Trailer
              </button>

              <button
                @click="bookmarkPage"
                class="w-full bg-[#DD8808] hover:bg-orange-600 text-white text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <i class="fas fa-bookmark"></i>
                Bookmark
              </button>
            </div>

            <div class="mt-4 text-gray-400 text-sm text-center">
              Followed 70 people
            </div>
          </div>

          <div class="flex-1">
            <h1 class="text-2xl text-white font-bold mb-3">
              {{ anime.data.anime?.info.name }}
            </h1>

            <div class="mb-8">
              <p class="text-gray-300 text-sm leading-relaxed mb-4">
                {{ anime.data.anime?.info.description }}
              </p>
              <p class="text-gray-400 text-sm">
                {{ anime.data.anime?.moreInfo.japanese }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"
                  ></span>
                  <span class="text-gray-400 text-sm">Status:</span>
                  <span class="text-white text-sm">{{
                    anime.data.anime?.moreInfo.status
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"
                  ></span>
                  <span class="text-gray-400 text-sm">Studio:</span>
                  <span class="text-white text-sm">{{
                    anime.data.anime?.moreInfo.studios
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"
                  ></span>
                  <span class="text-gray-400 text-sm">Released:</span>
                  <span class="text-white text-sm">{{
                    anime.data.anime?.moreInfo.aired
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"
                  ></span>
                  <span class="text-gray-400 text-sm">Duration:</span>
                  <span class="text-white text-sm">{{
                    anime.data.anime?.moreInfo.duration
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"
                  ></span>
                  <span class="text-gray-400 text-sm">Season:</span>
                  <span class="text-white text-sm">{{
                    anime.data.anime?.moreInfo.premiered
                  }}</span>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"
                  ></span>
                  <span class="text-gray-400 text-sm">Type:</span>
                  <span class="text-white text-sm">{{
                    anime.data.anime?.info.stats.type
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"
                  ></span>
                  <span class="text-gray-400 text-sm">Episodes:</span>
                  <span class="text-white text-sm">{{
                    anime.data.anime?.info.stats.episodes.sub
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"
                  ></span>
                  <span class="text-gray-400 text-sm">Posted by:</span>
                  <div class="flex flex-wrap gap-2 text-sm">
                    <span
                      class="text-white"
                      v-for="producer in anime.data.anime?.moreInfo.producers"
                      >{{ producer }},</span
                    >
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"
                  ></span>
                  <span class="text-gray-400 text-sm">MAL Score:</span>
                  <span class="text-white text-sm">{{
                    anime.data.anime?.moreInfo.malscore
                  }}</span>
                </div>
              </div>
            </div>

            <div class="mb-6 flex flex-wrap gap-2.5">
              <span
                v-for="genre in anime.data.anime?.moreInfo.genres"
                class="inline-block bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full border border-[#DD8808] cursor-pointer transition-colors text-sm"
              >
                {{ genre }}
              </span>
            </div>
          </div>
        </div>

        <div class="w-full mt-8">
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
              <router-link :to="`/anime-episodes/${episode.episodeId}`">
                Episode {{ episode.number }}
              </router-link>
              </button>
            </div>
          </div>
        </div>

        <div
          class="bg-[#222222] mt-8 w-full font-['Poppins'] text-gray-300 p-6 rounded shadow-md"
        >
          <h3 class="text-lg font-semibold text-white mb-2">Comment</h3>

          <hr class="my-4" />

          <span class="text-[#919182] mb-5">Leave a Reply</span>

          <p class="text-sm my-6">
            Your email address will not be published. Required fields are marked
            <span class="text-red-500">*</span>
          </p>

          <label for="comment" class="block text-sm font-medium mb-1"
            >Comment <span class="text-red-500">*</span></label
          >
          <textarea
            id="comment"
            rows="5"
            class="w-full rounded-md bg-[#121212] border border-[#121212] text-gray-200 px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          ></textarea>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="name" class="block text-sm font-medium mb-1"
                >Name <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                id="name"
                class="w-full rounded-md bg-[#121212] border border-[#121212] text-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium mb-1"
                >Email <span class="text-red-500">*</span></label
              >
              <input
                type="email"
                id="email"
                class="w-full rounded-md bg-[#121212] border border-[#121212] text-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div class="mb-4">
            <label for="website" class="block text-sm font-medium mb-1"
              >Website</label
            >
            <input
              type="text"
              id="website"
              class="w-full rounded-md bg-[#121212] border border-[#121212] text-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          <div class="flex items-center mb-4">
            <input
              type="checkbox"
              id="save-info"
              class="mr-2 accent-yellow-500"
            />
            <label for="save-info" class="text-sm"
              >Save my name, email, and website in this browser for the next
              time I comment.</label
            >
          </div>

          <button
            @click="postComment"
            type="submit"
            class="bg-yellow-600 hover:bg-yellow-500 text-white font-medium px-6 py-2 rounded-full transition"
          >
            Post Comment
          </button>
        </div>

        <div
          class="bg-[#222222] mt-8 p-6 rounded text-white w-full font-['Poppins']"
        >
          <div class="mx-auto">
            <h1 class="text-2xl font-bold mb-6">Recommended Series</h1>

            <div class="grid grid-cols-5 gap-3.5 p-4 font-['Poppins']">
          <div
            class="card cursor-pointer group relative overflow-hidden"
            v-for="anime in anime.data.recommendedAnimes"
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
      </div>

      <RightPanel />
    </div>
  </div>
</template>
