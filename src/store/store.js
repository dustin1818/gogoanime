import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const useGogoAnimeStore = defineStore('anime', () => {

    const animeData = ref([]);

    const selectedGenres = ref([]);
    const isModalOpen = ref(false);

    const showGenreModal = () => {
        isModalOpen.value = true;
      };
    
    const fetchHomeInfo = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_HOME_API_URL}`);
            animeData.value = response.data;
            return animeData.value
        } catch (error) {
            console.error('Fetching home info failed', error);
        }
    }

    const fetchAnimeInfo = async (id) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_ANIME_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Fetching anime info failed', error);
        }
    }

    const fetchAnimeEpisodes = async (id) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_ANIME_URL}/${id}/episodes`);
            return response.data;
        } catch (error) {
            console.error('Fetching anime episodes failed', error);
        }
    }

    const fetchAnimeStreamEps = async (id) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_ANIME_EP_URL}/sources?animeEpisodeId=${id}&server=hd-1&category=sub`);
            return response.data
        } catch (error) {
            
            console.error('Fetching anime stream episodes failed', error);
        }
    }

    return {selectedGenres, isModalOpen, showGenreModal, animeData, fetchHomeInfo, fetchAnimeInfo, fetchAnimeEpisodes, fetchAnimeStreamEps}
})