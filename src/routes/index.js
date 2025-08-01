import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SeriesView from "../views/SeriesView.vue";

const routes = [
    {
        path: '', component: HomeView
    },
    {
        path: '/series', component: SeriesView
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
