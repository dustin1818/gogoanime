<script setup>
import { defineProps } from "vue";

const props = defineProps({
  ongoingAnime: {
    type: Array,
  },
});
</script>

<template>
  <div class="border border-[#222222] bg-[#222222] rounded mt-3">
    <div class="text-white py-1">
      <h1 class="font-semibold p-2 font-['Poppins']">Ongoing Anime</h1>

      <div class="ongoing-container">
        <div
          class="ongoing-anime group cursor-pointer flex items-center justify-between border-t border-b border-t-[#2D2D2D] border-b-[#2D2D2D] px-3 py-1 hover:border-[#333333] hover:bg-[#333333]"
          v-for="ongoing in ongoingAnime"
          :key="ongoing.id"
        >
          <div class="left-ongoing flex gap-1 items-center flex-wrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 37 37"
              fill="none"
            >
              <circle cx="18.5" cy="18.5" r="18.5" fill="#D78E00" />
              <path
                d="M14 10 L23 18.5 L14 27"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text-sm group-hover:text-yellow-400">{{
              ongoing.name
            }}</span>
          </div>

          <div
            class="episode text-white text-[10px] font-semibold bg-[#DD8808] border-[#DD8808] rounded p-1.5"
          >
            Episode {{ ongoing.episodes?.sub }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
