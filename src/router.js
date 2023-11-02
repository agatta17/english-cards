import VueRouter from "vue-router";
import WordList from "@/components/word-list/WordList.vue";
import WordCards from "@/components/word-cards/WordCards.vue";
import WordQuiz from "@/components/word-quiz/WordQuiz.vue";
import AuthorizationPage from "@/components/AuthorizationPage";

const routes = [
  { path: "/", component: WordList },
  { path: "/cards/:language", component: WordCards },
  { path: "/quiz", component: WordQuiz },
  { path: "/registration", component: AuthorizationPage },
  { path: "/login", component: AuthorizationPage },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
