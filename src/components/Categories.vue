<script setup>
import { computed, ref, nextTick } from "vue";

const activeTab = ref("Weekly");
const isTransitioning = ref(false);

const tabs = ["Weekly", "Monthly", "All"];

const selectTab = async (tab) => {
  if (tab === activeTab.value) return;
  isTransitioning.value = true;
  await new Promise((r) => setTimeout(r, 200));
  activeTab.value = tab;
  await nextTick();
  isTransitioning.value = false;
};

const props = defineProps({
  categoriesAnime: {
    type: Object,
    default: () => ({
      week: [],
      month: [],
      today: [],
    }),
  },
});

const currentAnimeList = computed(() => {
  if (activeTab.value === tabs[0]) return props.categoriesAnime?.week ?? [];
  if (activeTab.value === tabs[1]) return props.categoriesAnime?.month ?? [];
  return props.categoriesAnime?.today ?? [];
});

const emptyLabel = computed(() => {
  if (activeTab.value === tabs[0]) return "No Weekly Anime";
  if (activeTab.value === tabs[1]) return "No Monthly Anime";
  return "No All Anime";
});
</script>

<template>
  <div
    class="rounded-xl bg-[#1a1a1f] border border-[#2a2a30] mt-4 overflow-hidden pb-2"
  >
    <h2 class="font-semibold text-base text-white p-4 pb-3 font-['Poppins']">
      Top 10 Anime
    </h2>

    <div
      class="relative flex items-center rounded-lg bg-[#2a2a30] mx-4 mb-5 p-1 font-['Poppins']"
    >
      <div
        class="tab-indicator absolute h-[calc(100%-8px)] rounded-md bg-[#DD8808] transition-all duration-300 ease-in-out"
        :style="{
          width: `calc(${100 / tabs.length}% - 4px)`,
          left: `calc(${(tabs.indexOf(activeTab) * 100) / tabs.length}% + 2px)`,
        }"
      ></div>
      <div
        v-for="tab in tabs"
        :key="tab"
        class="relative z-10 flex-1 text-center text-[12px] py-2 cursor-pointer transition-all duration-300 select-none"
        :class="
          activeTab === tab
            ? 'text-white font-semibold'
            : 'text-[#888888] hover:text-white'
        "
        @click="selectTab(tab)"
      >
        {{ tab }}
      </div>
    </div>

    <h2
      v-if="currentAnimeList.length === 0"
      class="font-['Poppins'] text-sm text-[#888888] text-center my-6"
    >
      {{ emptyLabel }}
    </h2>

    <div
      class="anime-list transition-opacity duration-200"
      :class="isTransitioning ? 'opacity-0' : 'opacity-100'"
    >
      <router-link
        v-for="(anime, index) in currentAnimeList"
        :key="anime.id"
        :to="`/anime-info/${anime.id}`"
        class="anime-item group text-white flex items-center gap-3 mx-4 mb-3 rounded-lg p-2 hover:bg-[#2a2a30] transition-all duration-200"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <div
          class="flex-shrink-0 w-9 h-9 rounded-lg border border-[#3a3a40] flex items-center justify-center text-sm font-semibold font-['Poppins'] text-[#888888] group-hover:border-[#DD8808] group-hover:text-[#DD8808] transition-colors duration-200"
        >
          {{ index + 1 }}
        </div>
        <div class="flex-shrink-0">
          <img
            class="h-20 w-14 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
            :src="anime.poster"
            :alt="anime.title"
          />
        </div>
        <div class="flex flex-col min-w-0">
          <h2
            class="font-['Poppins'] text-sm leading-snug group-hover:text-[#DD8808] transition-colors duration-200 line-clamp-2"
          >
            {{ anime.title }}
          </h2>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.anime-item {
  animation: fadeSlideIn 0.35s ease both;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
