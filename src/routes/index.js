import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SeriesView from "../views/SeriesView.vue";
import AnimeInfoView from "../views/AnimeInfoView.vue";
import AnimeStreamView from "../views/AnimeStream.vue"

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
        path:'/anime-episodes/:episodeId',
        component: AnimeStreamView
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
