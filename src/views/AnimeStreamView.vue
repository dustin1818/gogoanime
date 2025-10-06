<script setup>
import { onMounted, reactive, ref, onBeforeUnmount, watch, nextTick } from "vue";
import { useGogoAnimeStore } from "../store/store";
import { useRoute } from "vue-router";
import RightPanel from "@/components/RightPanel.vue";
import Navbar from "@/components/Navbar.vue";
import Episodes from "@/components/Episodes.vue";
import Hls from "hls.js";

const route = useRoute();
const store = useGogoAnimeStore();
const src = ref("");
const videoRef = ref(null);
const episodes = reactive({});
const subtitles = ref([]);
let hls = null;

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

function updateSubtitleTracks() {
  if (!videoRef.value) return;
  const existingTracks = videoRef.value.querySelectorAll('track');
  existingTracks.forEach(track => track.remove());
  
  subtitles.value.forEach((track, index) => {
    const trackElement = document.createElement('track');
    trackElement.kind = 'subtitles';
    trackElement.src = track.processedUrl || track.file;
    trackElement.label = track.label;
    trackElement.srclang = track.lang || 'en';
    
    if (track.label === 'English') {
      trackElement.default = true;
    }
    
    videoRef.value.appendChild(trackElement);
  });
}

async function loadEpisode(routeId) {
  if (hls) {
    hls.destroy();
    hls = null;
  }

  subtitles.value.forEach(track => {
    if (track.processedUrl && track.processedUrl.startsWith('blob:')) {
      URL.revokeObjectURL(track.processedUrl);
    }
  }); 
  
  const animeId = localStorage.getItem("gogo_current_anime_id");
  if (animeId) {
    store.setCurrentAnimeId(animeId);
  }

  episodes.data = await store.fetchAnimeStreamEps(routeId);

  const data = episodes.data.data;
  const originalUrl = data.link.file;
  src.value = getProxiedUrl(originalUrl, true);

  if (data.tracks && data.tracks.length > 0) {
    const subtitleTracks = data.tracks.filter(track => track.kind !== 'thumbnails');
    subtitles.value = await processSubtitleTracks(subtitleTracks);
  } else {
    subtitles.value = [];
  }

  if (videoRef.value) {
    await nextTick();
    updateSubtitleTracks();
    
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src.value);
      hls.attachMedia(videoRef.value);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        updateSubtitleTracks();
      });
    } else if (videoRef.value.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.value.src = src.value;
    }
  }
}

watch(
  () => route.params.title,
  (newEpisodeId, oldEpisodeId) => {
    if (newEpisodeId && newEpisodeId !== oldEpisodeId) {
      loadEpisode(newEpisodeId);
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (hls) {
    hls.destroy();
  }
  
  subtitles.value.forEach(track => {
    if (track.processedUrl && track.processedUrl.startsWith('blob:')) {
      URL.revokeObjectURL(track.processedUrl);
    }
  });
});
</script>

<template>
  <Navbar />

  <div class="container-anime flex flex-col md:flex-row justify-between mx-auto items-start gap-8 mt-10">
    <div class="left-panel">
      <video ref="videoRef" controls autoplay class="h-[450px] md:h-auto w-full md:w-[1200px] rounded-lg" crossorigin="anonymous">
        <track
          v-for="(track, index) in subtitles"
          :key="`${route.params.title}-${index}`"
          kind="subtitles"
          :src="track.processedUrl || track.file"
          :label="track.label"
          :srclang="track.lang"
          :default="track.label === 'English'"
        />
      </video>

      <Episodes />

    </div>
    
    <RightPanel/>
  </div>
</template>

<style scoped>
</style>