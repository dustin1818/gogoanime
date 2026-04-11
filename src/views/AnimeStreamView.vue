<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useGogoAnimeStore } from "../store/store";
import { useRoute, useRouter } from "vue-router";
import RightPanel from "@/components/RightPanel.vue";
import Navbar from "@/components/Navbar.vue";
import Episodes from "@/components/Episodes.vue";

const route = useRoute();
const router = useRouter();
const store = useGogoAnimeStore();

const category = ref("sub");
const server = ref("vidWish");
const isLoadingEpisodes = ref(false);

const episodeList = computed(() => store.episodeData?.data ?? []);
const currentEpisodeId = computed(() => String(route.params.title ?? ""));
const currentEpisodeIndex = computed(() =>
  episodeList.value.findIndex(
    (episode) => episode.id === currentEpisodeId.value,
  ),
);
const currentEpisode = computed(() =>
  currentEpisodeIndex.value >= 0
    ? episodeList.value[currentEpisodeIndex.value]
    : null,
);
const hasPrevEp = computed(() => currentEpisodeIndex.value > 0);
const hasNextEp = computed(
  () =>
    currentEpisodeIndex.value >= 0 &&
    currentEpisodeIndex.value < episodeList.value.length - 1,
);
const iframeEpisodeId = computed(() => {
  const rawId = currentEpisodeId.value;
  const streamId = rawId.includes("ep=") ? rawId.split("ep=").pop() : rawId;

  return String(streamId ?? "").split("&")[0];
});
const iframeSrc = computed(() => {
  if (!iframeEpisodeId.value) return "";

  const host = server.value === "vidWish" ? "vidwish.live" : "megaplay.buzz";
  return `https://${host}/stream/s-2/${encodeURIComponent(iframeEpisodeId.value)}/${category.value}`;
});
const currentEpisodeNumber = computed(
  () =>
    currentEpisode.value?.episodeNumber ?? currentEpisode.value?.number ?? "?",
);

const loadEpisodes = async () => {
  const animeId = localStorage.getItem("gogo_current_anime_id");

  if (animeId && store.currentAnimeId !== animeId) {
    store.setCurrentAnimeId(animeId);
  }

  if (!store.currentAnimeId) return;

  try {
    isLoadingEpisodes.value = true;
    await store.fetchAnimeEpisodes(store.currentAnimeId);
  } catch (error) {
    console.error("Failed to load episodes:", error);
  } finally {
    isLoadingEpisodes.value = false;
  }
};

const changeCategory = (newType) => {
  if (newType !== category.value) {
    category.value = newType;
  }
};

const changeServer = (newServer) => {
  if (newServer !== server.value) {
    server.value = newServer;
  }
};

const changeEpisode = (direction) => {
  const offset = direction === "prev" ? -1 : 1;
  const targetEpisode = episodeList.value[currentEpisodeIndex.value + offset];

  if (!targetEpisode?.id) return;

  router.push(`/anime-episodes/${targetEpisode.id}`);
};

const getToggleButtonClass = (isActive) =>
  isActive
    ? "bg-[#DD8808] text-black"
    : "bg-[#2A2730] text-white hover:bg-[#3A3542]";

onMounted(async () => {
  await loadEpisodes();
});

watch(
  () => store.currentAnimeId,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      await loadEpisodes();
    }
  },
);

watch(
  () => route.params.title,
  async () => {
    category.value = "sub";

    if (!episodeList.value.length) {
      await loadEpisodes();
    }
  },
  { immediate: true },
);
</script>

<template>
  <Navbar />

  <div
    class="container-anime flex flex-col md:flex-row justify-between mx-auto items-start gap-8 mt-10"
  >
    <div class="left-panel w-full">
      <div
        class="overflow-hidden rounded-lg border border-[#23202A] bg-[#17151B] font-['Poppins']"
      >
        <div class="aspect-video w-full bg-black">
          <iframe
            v-if="iframeSrc"
            :key="iframeSrc"
            :src="iframeSrc"
            class="h-full w-full"
            allowfullscreen
            referrerpolicy="origin"
          ></iframe>

          <div
            v-else
            class="flex h-full items-center justify-center px-6 text-center text-sm text-gray-400"
          >
            Episode stream is unavailable right now.
          </div>
        </div>

        <div class="flex flex-col gap-4 bg-[#1B1820] px-4 py-4 md:px-6">
          <div
            class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
          >
            <div class="flex flex-wrap items-center gap-3">
              <button
                class="rounded-md px-3 py-2 text-sm font-semibold uppercase transition-colors duration-300"
                :class="getToggleButtonClass(server === 'vidWish')"
                @click="changeServer('vidWish')"
              >
                Vidwish
              </button>
              <button
                class="rounded-md px-3 py-2 text-sm font-semibold uppercase transition-colors duration-300 cursor-pointer"
                :class="getToggleButtonClass(server === 'megaPlay')"
                @click="changeServer('megaPlay')"
              >
                Megaplay
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button
                class="rounded-md px-3 py-2 text-sm font-semibold uppercase transition-colors duration-300 cursor-pointer"
                :class="getToggleButtonClass(category === 'sub')"
                @click="changeCategory('sub')"
              >
                SUB
              </button>
              <button
                class="rounded-md px-3 py-2 text-sm font-semibold uppercase transition-colors duration-300 cursor-pointer"
                :class="getToggleButtonClass(category === 'dub')"
                @click="changeCategory('dub')"
              >
                DUB
              </button>

              <button
                v-if="hasPrevEp"
                class="rounded-md bg-[#DD8808] px-3 py-2 text-sm font-semibold text-black transition-colors duration-300 hover:bg-[#c47807] cursor-pointer"
                @click="changeEpisode('prev')"
              >
                Prev
              </button>
              <button
                v-if="hasNextEp"
                class="rounded-md bg-[#DD8808] px-3 py-2 text-sm font-semibold text-black transition-colors duration-300 hover:bg-[#c47807] cursor-pointer"
                @click="changeEpisode('next')"
              >
                Next
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1 text-sm">
            <p class="text-gray-300">
              You are watching Episode {{ currentEpisodeNumber }}
            </p>
            <p v-if="currentEpisode?.isFiller" class="text-[#DD8808]">
              You are watching a filler episode.
            </p>
            <p v-else-if="isLoadingEpisodes" class="text-gray-500">
              Loading episode navigation...
            </p>
          </div>
        </div>
      </div>

      <Episodes />
    </div>

    <RightPanel />
  </div>
</template>

<style scoped></style>
