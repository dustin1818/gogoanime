<script setup>
import { ref } from "vue";
import { defineProps } from "vue";

const activeTab = ref("Weekly");

const tabs = ["Weekly", "Monthly", "All"];

const selectTab = (tab) => {
  activeTab.value = tab;
};

const props = defineProps({
  categoriesAnime: {
    type: Array,
  },
});
</script>

<template>
  <div class="category-container bg-[#222222] border border-[#222222] mt-5">
    <div
      class="border border-[#333333] rounded bg-[#333333] flex justify-between items-center py-1 px-8 mx-4 mb-6 font-['Poppins']"
    >
      <div
        v-for="tab in tabs"
        :key="tab"
        class="sub-category text-white text-[12px] cursor-pointer"
        :class="{
          'bg-[#DD8808] p-1 px-6 rounded font-semibold': activeTab === tab,
        }"
        @click="selectTab(tab)"
      >
        {{ tab }}
      </div>
    </div>
    <div
      class="text-white flex items-center mb-4"
      v-for="(anime, index) in categoriesAnime?.week"
      v-if="activeTab === tabs[0]"
    >
      <div
        class="text-sm border border-[#888888] text-[#888888] p-3 px-4 rounded mx-4.5"
      >
        {{ index + 1 }}
      </div>
      <div class="anime flex gap-3.5 items-start">
        <img class="h-28 cursor-pointer hover:scale-110 transition-all" :src="anime.poster" :alt="anime.poster" />

        <div class="flex flex-col">
          <h2>{{ anime.name }}</h2>
        </div>
      </div>
    </div>

    <div
      class="text-white flex items-center mb-4"
      v-for="(anime, index) in categoriesAnime?.month"
      v-if="activeTab === tabs[1]"
    >
      <div
        class="text-sm border border-[#888888] text-[#888888] p-3 px-4 rounded mx-4.5"
      >
        {{ index + 1 }}
      </div>
      <div class="anime flex gap-3.5 items-start">
        <img class="h-28 cursor-pointer hover:scale-110 transition-all" :src="anime.poster" :alt="anime.poster" />

        <div class="flex flex-col">
          <h2>{{ anime.name }}</h2>
        </div>
      </div>
    </div>

    <div
      class="text-white flex items-center mb-4"
      v-for="(anime, index) in categoriesAnime?.today"
      v-if="activeTab === tabs[2]"
    >
      <div
        class="text-sm border border-[#888888] text-[#888888] p-3 px-4 rounded mx-4.5"
      >
        {{ index + 1 }}
      </div>
      <div class="anime flex gap-3.5 items-start">
        <img class="h-28 cursor-pointer hover:scale-110 transition-all " :src="anime.poster" :alt="anime.poster" />

        <div class="flex flex-col">
          <h2>{{ anime.name }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
