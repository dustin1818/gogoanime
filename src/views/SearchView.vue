<script setup>
import { onMounted } from "vue";
import { useGogoAnimeStore } from "../store/store";
import Navbar from "@/components/Navbar.vue";

const store = useGogoAnimeStore();

onMounted(() => {
 console.log(store.selectedGenres.map((x) => x))
});
</script>

<template>
  <Navbar />

  <div
    class="container-anime gap-8 mt-10 w-full mx-auto"
  >
  <div class="text-white text-2xl text-center w-full">Feature not yet released...</div>
  </div>
</template>
