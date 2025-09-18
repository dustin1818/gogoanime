<script setup>
import { onMounted } from "vue";
import { useGogoAnimeStore } from "../store/store";

const store = useGogoAnimeStore();

onMounted(() => {
    console.log(store.selectedGenres)
})

</script>

<template>
     
    <div class="text-white">{{ store.selectedGenres[0] }}</div>
    <div class="text-white">{{ store.selectedGenres[1] }}</div>
</template>