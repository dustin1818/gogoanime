<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "Anime List",
  },
  animeList: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div
    class="rounded-xl bg-[#1a1a1f] border border-[#2a2a30] mt-4 overflow-hidden pb-2"
  >
    <h2 class="font-semibold text-base text-white p-4 pb-3 font-['Poppins']">
      {{ title }}
    </h2>

    <h2
      v-if="!animeList || animeList.length === 0"
      class="font-['Poppins'] text-sm text-[#888888] text-center my-6"
    >
      No anime found
    </h2>

    <router-link
      v-for="(anime, index) in animeList"
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
