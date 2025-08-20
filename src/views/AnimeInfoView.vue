<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useGogoAnimeStore } from "../store/home";
import Modal from "@/components/Modal.vue";

const route = useRoute();
const id = route.params.id;

const store = useGogoAnimeStore();
const anime = reactive({
  data: {},
  eps: {},
});

const isLoading = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    const animeData = await store.fetchAnimeInfo(id);
    const animeEps = await store.fetchAnimeEpisodes(id);
    anime.data = animeData.data;
    anime.eps = animeEps.data;
    console.log(anime.data);
    console.log(anime.eps);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});

const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template class="bg-gray-900 text-white min-h-screen">
  <div class="text-white text-2xl text-center min-h-screen flex justify-center items-center" v-if="isLoading">Loading...</div>
  <div class="anime-info" v-else>
    <Modal :show="showModal" @close="closeModal">
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

    <div class="max-w-6xl mx-auto p-6">
      <div class="flex flex-col lg:flex-row gap-8 font-['Poppins']">
        <div class="lg:w-80 flex-shrink-0">
          <div class="relative mb-4">
            <img
              :src="anime.data.anime?.info.poster"
              :alt="anime.data.anime?.info.poster"
              class="w-full h-96 object-contain rounded-lg shadow-lg"
            />
            <div
              class="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2"
            >
              <i class="fas fa-heart text-gray-300 text-sm"></i>
            </div>
          </div>

          <div class="space-y-3">
            <button
              @click="openModal"
              class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
            >
              <i class="fab fa-youtube"></i>
              Trailer
            </button>

            <button
              class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
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
          <h1 class="text-3xl text-white lg:text-4xl font-bold mb-6">
            {{ anime.data.anime?.info.name }}
          </h1>

          <div class="mb-8">
            <p class="text-gray-300 leading-relaxed mb-4">
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
                <span class="text-gray-400">Status:</span>
                <span class="text-white">{{
                  anime.data.anime?.moreInfo.status
                }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"
                ></span>
                <span class="text-gray-400">Studio:</span>
                <span class="text-white">{{
                  anime.data.anime?.moreInfo.studios
                }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"
                ></span>
                <span class="text-gray-400">Released:</span>
                <span class="text-white">{{
                  anime.data.anime?.moreInfo.aired
                }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"
                ></span>
                <span class="text-gray-400">Duration:</span>
                <span class="text-white">{{
                  anime.data.anime?.moreInfo.duration
                }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"
                ></span>
                <span class="text-gray-400">Season:</span>
                <span class="text-white">{{
                  anime.data.anime?.moreInfo.premiered
                }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <span
                  class="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"
                ></span>
                <span class="text-gray-400">Type:</span>
                <span class="text-white">{{
                  anime.data.anime?.info.stats.type
                }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"
                ></span>
                <span class="text-gray-400">Episodes:</span>
                <span class="text-white">{{
                  anime.data.anime?.info.stats.episodes.sub
                }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"
                ></span>
                <span class="text-gray-400">Posted by:</span>
                <div class="flex flex-wrap gap-2">
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
                <span class="text-gray-400">MAL Score:</span>
                <span class="text-white">{{
                  anime.data.anime?.moreInfo.malscore
                }}</span>
              </div>
            </div>
          </div>

          <div class="mb-6 flex flex-wrap gap-2.5">
            <span
              v-for="genre in anime.data.anime?.moreInfo.genres"
              class="inline-block bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full border border-orange-500 cursor-pointer transition-colors"
            >
              {{ genre }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
