import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SeriesView from "../views/SeriesView.vue";
import AnimeInfoView from "../views/AnimeInfoView.vue";

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
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
