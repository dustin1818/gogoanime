import { defineStore } from 'pinia'
import axios from 'axios'

export const useGogoAnimeStore = defineStore('anime', () => {
    
    const fetchHomeInfo = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_HOME_API_URL}`);
            return response.data
        } catch (error) {
            console.error('Fetching home info failed', error)
        }
    }

    return {fetchHomeInfo}
})