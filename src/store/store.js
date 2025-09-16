import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useGogoAnimeStore = defineStore("anime", () => {
  const animeData = ref([]);
  const selectedGenres = ref([]);
  const isModalOpen = ref(false);
  const episodeData = ref([]);
  const currentAnimeId = ref(null);

  const showGenreModal = () => {
    isModalOpen.value = true;
  };

  const setCurrentAnimeId = (id) => {
    if (currentAnimeId.value !== id) {
      currentAnimeId.value = id;
    }
  };

  const fetchHomeInfo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_HOME_API_URL}`);
      animeData.value = response.data;
      return animeData.value;
    } catch (error) {
      console.error("Fetching home info failed", error);
    }
  };

  const fetchAnimeInfo = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ANIME_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Fetching anime info failed", error);
    }
  };

  const fetchAnimeEpisodes = async (id) => {
    try {
      episodeData.value = [];
      const response = await axios.get(
        `${import.meta.env.VITE_ANIME_EP_URL}s/${id}`
      );
      episodeData.value = response.data;
      return episodeData.value;
    } catch (error) {
      console.error("Fetching anime episodes failed", error);
    }
  };

  const fetchAnimeStreamEps = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ANIME_STREAM_URL}?server=HD-2&type=sub&id=${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Fetching anime stream episodes failed", error);
    }
  };

  const fetchSearchResults = async (query) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_ANIME_SEARCH_URL}?keyword=${query}&page=1`)
        return response.data;
    } catch (error) {
        console.error("Fetching anime search results failed", error)
    }
  };

  const fetchMoviesAnime = async (number) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_ANIME_URL}s/movie?page=${number}`)
      return response.data
    } catch (error) {
        console.error("Fetching anime movies failed", error)
    }
  }

  const fetchSeriesAnime = async (number) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_ANIME_URL}s/tv?page=${number}`)
      return response.data
    } catch (error) {
        console.error("Fetching anime series failed", error)
    }
  }

  return {
    selectedGenres,
    isModalOpen,
    showGenreModal,
    animeData,
    fetchHomeInfo,
    fetchAnimeInfo,
    fetchAnimeEpisodes,
    fetchAnimeStreamEps,
    episodeData,
    currentAnimeId,
    setCurrentAnimeId,
    fetchSearchResults,
    fetchMoviesAnime,
    fetchSeriesAnime
  };
});
