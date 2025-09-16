import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AnimeInfoView from "../views/AnimeInfoView.vue";
import AnimeStreamView from "../views/AnimeStreamView.vue";
import MoviesView from "../views/MoviesView.vue"
import SeriesView from "../views/SeriesView.vue";

const routes = [
    {
        path: '', component: HomeView
    },
    {
        path: '/series', component: SeriesView
    },
    {
        path:'/anime-info/:id',
        component: AnimeInfoView
    },
    {
        path:'/anime-episodes/:title',
        component: AnimeStreamView
    },
    {
        path: '/anime/movies',
        component: MoviesView
    },
    {
        path: '/anime/series',
        component: SeriesView
    }
   
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
