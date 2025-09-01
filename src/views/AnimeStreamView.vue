<script setup>
import { onMounted, reactive, ref, onBeforeUnmount } from "vue";
import { useGogoAnimeStore } from "../store/store";
import { useRoute } from "vue-router";
import Hls from "hls.js";

const route = useRoute();
const store = useGogoAnimeStore();
const src = ref("");
const videoRef = ref(null);
const episodes = reactive({});
const subtitles = ref([]);

function getProxiedUrl(originalUrl, forceProxy = false) {
  if (!forceProxy && (originalUrl.includes('.vtt') || originalUrl.includes('subtitle'))) {
    return originalUrl;
  }
  
  return `https://hls-proxy-m3u8.vercel.app/m3u8-proxy?url=${encodeURIComponent(originalUrl)}&headers=${encodeURIComponent(JSON.stringify({
    referer: "https://vidwish.live/"
  }))}`;
}

async function fetchAndCreateBlobUrl(vttUrl) {
  try {
    const response = await fetch(getProxiedUrl(vttUrl));
    const vttContent = await response.text();
    const blob = new Blob([vttContent], { type: 'text/vtt' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.warn('Failed to fetch VTT content, falling back to direct URL:', error);
    return vttUrl;
  }
}

async function processSubtitleTracks(tracks) {
  const processedTracks = await Promise.all(
    tracks.map(async (track) => {
      if (track.file && track.file.includes('.vtt')) {
        try {
          const blobUrl = await fetchAndCreateBlobUrl(track.file);
          return { ...track, processedUrl: blobUrl };
        } catch (error) {
          console.warn('Failed to process track:', track.label, error);
          return { ...track, processedUrl: track.file };
        }
      }
      return { ...track, processedUrl: track.file };
    })
  );
  return processedTracks;
}

onMounted(async () => {
  const routeId = route.params.title;
  episodes.data = await store.fetchAnimeStreamEps(routeId);
  console.log(episodes.data.data);

  const data = episodes.data.data;
  const originalUrl = data.link.file;
  src.value = getProxiedUrl(originalUrl, true);

  if (data.tracks && data.tracks.length > 0) {
    const subtitleTracks = data.tracks.filter(track => track.kind !== 'thumbnails');
    subtitles.value = await processSubtitleTracks(subtitleTracks);
  }

  if (videoRef.value) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls?.loadSource(src.value);
      hls?.attachMedia(videoRef.value);
    } else if (videoRef.value.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.value.src = src.value;
    }
  }
});

onBeforeUnmount(() => {
  subtitles.value.forEach(track => {
    if (track.processedUrl && track.processedUrl.startsWith('blob:')) {
      URL.revokeObjectURL(track.processedUrl);
    }
  });
});
</script>

<template>
  <h1>Stream page</h1>
  
  <span class="text-white">{{ episodes.data?.data?.tracks }}</span>
  <video ref="videoRef" controls autoplay class="w-full rounded-lg" crossorigin="anonymous">
    
    <track
      v-for="(track, index) in subtitles"
      :key="index"
      kind="subtitles"
      :src="track.processedUrl || track.file"
      :label="track.label"
      :srclang="track.lang"
      :default="track.label === 'English'"
    />
    
  </video>
  
  <span class="text-white">{{ src }}</span>
</template>

<style scoped>
</style>