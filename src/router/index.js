import { createRouter, createWebHistory } from "vue-router";
import axios from "axios";
import HomePage from "../components/HomePage.vue";
import LoginPage from "../components/LoginPage.vue";
import WeatherPage from "../components/WeatherPage.vue";
import WikiPage from "../components/WikiPage.vue";
import KeinZugriff from "../components/KeinZugriff.vue";
import WillkommenPage from "../components/WillkommenPage.vue";
import LoadingPage from "../components/LoadingPage.vue"; // Preload LoadingPage

// Reusable Auth Check
const requireAuth = (allowedRole = null) => (to, from, next) => {
  axios.get("/auth-status")
    .then((response) => {
      if (!response.data.loggedIn) {
        next("/willkommen");
      } else if (allowedRole && response.data.role !== allowedRole) {
        next("/kein-zugriff");
      } else {
        next();
      }
    })
    .catch(() => next("/willkommen"));
};

// Define Routes
const routes = [
  {
    path: "/",
    component: LoadingPage, // Preloaded Loading Page
    beforeEnter: (to, from, next) => {
      axios.get("/auth-status")
        .then((response) => {
          if (response.data.loggedIn) {
            next("/home");
          } else {
            next("/willkommen");
          }
        })
        .catch(() => next("/willkommen"));
    },
  },
  { path: "/willkommen", component: WillkommenPage },
  { path: "/login", component: LoginPage },
  { path: "/home", component: HomePage, beforeEnter: requireAuth() },
  { path: "/weather", component: WeatherPage, beforeEnter: requireAuth("rich") },
  { path: "/wikisearch", component: WikiPage, beforeEnter: requireAuth("rich") },
  { path: "/kein-zugriff", component: KeinZugriff },
];

// Create Router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
