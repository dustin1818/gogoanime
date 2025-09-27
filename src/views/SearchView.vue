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
    class="container-anime flex flex-col md:flex-row justify-between mx-auto items-start gap-8 mt-10"
  >
    <div class="left-panel"></div>

  </div>
</template>
