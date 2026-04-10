import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AnimeInfoView from "../views/AnimeInfoView.vue";
import AnimeStreamView from "../views/AnimeStreamView.vue";
import MoviesView from "../views/MoviesView.vue";
import SeriesView from "../views/SeriesView.vue";
import SearchView from "../views/SearchView.vue";
import PopularView from "../views/PopularView.vue";
import TopAiringView from "../views/TopAiringView.vue";
import RecentlyAddedView from "../views/RecentlyAddedView.vue";
import NewOnAniWatchView from "../views/NewOnAniWatchView.vue";
import TopUpcomingView from "../views/TopUpcomingView.vue";
import TrendingView from "../views/TrendingView.vue";

const routes = [
  {
    path: "",
    component: HomeView,
  },
  {
    path: "/anime-info/:id",
    component: AnimeInfoView,
  },
  {
    path: "/anime-episodes/:title",
    component: AnimeStreamView,
  },
  {
    path: "/anime/movies",
    component: MoviesView,
  },
  {
    path: "/anime/series",
    component: SeriesView,
  },
  {
    path: "/anime/search",
    component: SearchView,
  },
  {
    path: "/anime/popular",
    component: PopularView,
  },
  {
    path: "/anime/top-airing",
    component: TopAiringView,
  },
  {
    path: "/anime/recently-added",
    component: RecentlyAddedView,
  },
  {
    path: "/anime/new-on-aniwatch",
    component: NewOnAniWatchView,
  },
  {
    path: "/anime/top-upcoming",
    component: TopUpcomingView,
  },
  {
    path: "/anime/trending",
    component: TrendingView,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
