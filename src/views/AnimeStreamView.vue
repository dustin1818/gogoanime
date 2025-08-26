<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useGogoAnimeStore } from "../store/store";
import { useRoute } from 'vue-router';
import Hls from "hls.js";

const route = useRoute();
const store = useGogoAnimeStore();
const src = ref('')

const videoRef = ref(null);

const episodes = reactive({})

onMounted(async () => {
 const routeId = route.params.episodeId + '?ep=' + route.query.ep; 
 console.log(await store.fetchAnimeStreamEps(routeId))
 episodes.data = await  store.fetchAnimeStreamEps(routeId)

  src.value = episodes.data.data.sources?.[0].url;
 if (videoRef.value) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls?.loadSource(src.value);
      hls?.attachMedia(videoRef.value);
    } else if (videoRef.value.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.value.src = src.value;
    }
  }
})

</script>

<template>
    <h1>Stream page</h1>
      
    <video ref="videoRef" controls autoplay class="w-full rounded-lg"></video>

    <span class="text-white"> {{ src }}</span>
    

</template>

<style scoped></style>