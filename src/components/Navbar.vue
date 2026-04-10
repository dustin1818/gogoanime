<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useGogoAnimeStore } from "../store/store";
import Swal from "sweetalert2";

const route = useRoute();

const isMobileMenuOpen = ref(false);
const hasSearchResults = ref(false);
const searchResults = ref([]);
const store = useGogoAnimeStore();
let delayResult;

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogin = () => {
  Swal.fire({
    title: "Login Page",
    text: "Register to myanimelist.com",
    icon: "question",
    confirmButtonText: "Confirm",
    confirmButtonColor: "#DD8808",
  });
};

const handleClickOutside = (event) => {
  const header = event.target.closest("header");
  if (!header && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

const handleResize = () => {
  if (window.innerWidth >= 768 && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

const handleInput = async (e) => {
  const query = e.target.value.trim();

  clearTimeout(delayResult);

  if (!query) {
    hasSearchResults.value = false;
    searchResults.value = [];
    return;
  }

  delayResult = setTimeout(async () => {
    const results = await store.fetchSearchResults(query);
    searchResults.value = results;
    hasSearchResults.value = results?.data.response?.length > 0;
  }, 300);
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <header class="bg-[#0B0A0D] font-['Poppins']">
    <div
      class="container-anime mx-auto px-3 py-5 flex justify-between items-center relative"
    >
      <div class="flex items-center gap-8">
        <img class="w-auto h-11" src="../assets/logo.png" alt="Logo" />

        <div class="search-input hidden md:block relative">
          <input
            class="w-[350px] border border-[#23202A] bg-[#17151B] text-white px-5 py-2 rounded placeholder-white text-sm focus:outline-none focus:border-[#DD8808]"
            type="text"
            placeholder="Search..."
            @input="handleInput"
          />

          <div
            v-if="hasSearchResults"
            class="search-results bg-[#17151B] text-white px-5 py-2 absolute w-full z-50 flex flex-col gap-1 max-h-80 overflow-y-auto rounded-b"
          >
            <router-link
              v-for="searchResult in searchResults.data?.response"
              :key="searchResult.id"
              class="cursor-pointer hover:text-[#DD8808] transition-colors py-1"
              :to="`/anime-info/${searchResult.id}`"
            >
              {{ searchResult.title }}
            </router-link>
          </div>
        </div>
      </div>

      <div class="hidden bg-transparent md:block">
        <button
          class="text-white bg-[#DD8808] hover:bg-[#c47807] px-5 py-2.5 uppercase rounded transition-colors duration-300"
          @click="handleLogin"
        >
          Login
        </button>
      </div>

      <div
        class="md:hidden flex flex-col cursor-pointer p-1"
        @click="toggleMobileMenu"
      >
        <div
          class="w-6 h-0.5 bg-white my-0.5 transition-transform duration-300 rounded"
          :class="{ 'transform rotate-45 translate-y-1.5': isMobileMenuOpen }"
        ></div>
        <div
          class="w-6 h-0.5 bg-white my-0.5 transition-opacity duration-300 rounded"
          :class="{ 'opacity-0': isMobileMenuOpen }"
        ></div>
        <div
          class="w-6 h-0.5 bg-white my-0.5 transition-transform duration-300 rounded"
          :class="{ 'transform -rotate-45 -translate-y-1.5': isMobileMenuOpen }"
        ></div>
      </div>
    </div>

    <!-- mobile menu  -->
    <div
      class="bg-[#17151B] border-t border-[#23202A] px-3 py-5 flex-col gap-5 transition-all duration-300"
      :class="
        isMobileMenuOpen
          ? 'flex md:hidden max-h-96 opacity-100'
          : 'hidden max-h-0 opacity-0'
      "
    >
      <div class="search-input relative">
        <input
          class="w-full border border-[#23202A] bg-[#17151B] text-white px-5 py-2 rounded placeholder-white text-sm focus:border-[#DD8808]"
          type="text"
          placeholder="Search..."
          @input="handleInput"
        />

        <div
          v-if="hasSearchResults"
          class="search-results bg-[#17151B] text-white px-5 py-2 absolute w-full z-50 flex flex-col gap-1 max-h-80 overflow-y-auto rounded-b"
        >
          <router-link
            v-for="searchResult in searchResults.data?.response"
            :key="searchResult.id"
            class="cursor-pointer hover:text-[#DD8808] transition-colors py-1"
            :to="`/anime-info/${searchResult.id}`"
          >
            {{ searchResult.title }}
          </router-link>
        </div>
      </div>

      <button
        class="text-white bg-[#DD8808] hover:bg-[#c47807] px-5 py-3 uppercase rounded transition-colors duration-300 self-start"
        @click="handleLogin"
      >
        Login
      </button>

      <div class="flex flex-col gap-1 border-t border-[#23202A] pt-4">
        <router-link
          to="/"
          class="mobile-nav-link px-4 py-2.5 rounded-lg text-sm transition-colors duration-200"
          :class="
            route.path === '/'
              ? 'bg-[#DD8808] text-white font-semibold'
              : 'text-gray-300 hover:bg-[#23202A] hover:text-white'
          "
          @click="closeMobileMenu"
          >Home</router-link
        >
        <router-link
          to="/anime/popular"
          class="mobile-nav-link px-4 py-2.5 rounded-lg text-sm transition-colors duration-200"
          :class="
            route.path === '/anime/popular'
              ? 'bg-[#DD8808] text-white font-semibold'
              : 'text-gray-300 hover:bg-[#23202A] hover:text-white'
          "
          @click="closeMobileMenu"
          >Popular</router-link
        >
        <router-link
          to="/anime/top-airing"
          class="mobile-nav-link px-4 py-2.5 rounded-lg text-sm transition-colors duration-200"
          :class="
            route.path === '/anime/top-airing'
              ? 'bg-[#DD8808] text-white font-semibold'
              : 'text-gray-300 hover:bg-[#23202A] hover:text-white'
          "
          @click="closeMobileMenu"
          >Top-Airing</router-link
        >
        <router-link
          to="/anime/series"
          class="mobile-nav-link px-4 py-2.5 rounded-lg text-sm transition-colors duration-200"
          :class="
            route.path === '/anime/series'
              ? 'bg-[#DD8808] text-white font-semibold'
              : 'text-gray-300 hover:bg-[#23202A] hover:text-white'
          "
          @click="closeMobileMenu"
          >TV Series</router-link
        >
        <router-link
          to="/anime/movies"
          class="mobile-nav-link px-4 py-2.5 rounded-lg text-sm transition-colors duration-200"
          :class="
            route.path === '/anime/movies'
              ? 'bg-[#DD8808] text-white font-semibold'
              : 'text-gray-300 hover:bg-[#23202A] hover:text-white'
          "
          @click="closeMobileMenu"
          >Movies</router-link
        >
      </div>
    </div>

    <div class="bg-[#DD8808] hidden md:block">
      <div
        class="orange-upper container-anime mx-auto px-3 py-3 flex text-white gap-5"
      >
        <router-link
          class="nav-link text-base"
          :class="{ 'nav-active': route.path === '/' }"
          to="/"
          >Home</router-link
        >
        <router-link
          class="nav-link text-base"
          :class="{ 'nav-active': route.path === '/anime/popular' }"
          to="/anime/popular"
          >Popular</router-link
        >
        <router-link
          class="nav-link text-base"
          :class="{ 'nav-active': route.path === '/anime/top-airing' }"
          to="/anime/top-airing"
          >Top-Airing</router-link
        >
        <router-link
          class="nav-link text-base"
          :class="{ 'nav-active': route.path === '/anime/series' }"
          to="/anime/series"
          >TV Series</router-link
        >
        <router-link
          class="nav-link text-base"
          :class="{ 'nav-active': route.path === '/anime/movies' }"
          to="/anime/movies"
          >Movies</router-link
        >
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-link {
  padding: 4px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  cursor: pointer;
  color: #333333;
  background-color: rgba(0, 0, 0, 0.15);
}

.nav-active {
  color: #ffffff;
  font-weight: 600;
  border-bottom: none;
  border-radius: 0;
  padding-bottom: 4px;
  background-image: linear-gradient(#00a676, #00a676);
  background-size: 60% 1px;
  background-position: center bottom;
  background-repeat: no-repeat;
}

.nav-active:hover {
  color: #ffffff;
  background-color: transparent;
}
</style>
