<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useGogoAnimeStore } from "../store/store";
import Swal from "sweetalert2";
import Modal from "@/components/Modal.vue";
import RightPanel from "../components/RightPanel.vue";

const route = useRoute();
const store = useGogoAnimeStore();

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
    console.log(anime.eps)
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
</script>

<template class="bg-gray-900 text-white min-h-screen">
  <div
    class="text-white text-2xl text-center min-h-screen flex justify-center items-center"
    v-if="isLoading"
  >
    Loading...
  </div>

  <div class="anime-info max-w-4/5 flex mx-auto gap-9 px-3 py-5" v-else>
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

    <div v-else>
      <Modal :show="showModal" @close="closeModal">
        <h1 class="font=['Poppins'] text-2xl text-center">
          No trailer at the moment
        </h1>
      </Modal>
    </div>

    <div class="max-w-[1100px] mx-auto ">
      <div class="flex flex-col bg-[#222222] rounded p-6 lg:flex-row gap-8 font-['Poppins']">
        <div class="lg:w-80 flex-shrink-0">
          <div class="relative mb-4">
            <img
              :src="anime.data.anime?.info.poster"
              :alt="anime.data.anime?.info.poster"
              class="w-full h-96 object-contain rounded-lg shadow-lg"
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
    </div>

    <RightPanel />
  </div>
</template>
