import VueRouter from "vue-router";
import WordList from "@/components/word-list/WordList.vue";
import WordCards from "@/components/word-cards/WordCards.vue";
import WordQuiz from "@/components/word-quiz/WordQuiz.vue";

const routes = [
  { path: "/", component: WordList },
  { path: "/cards/:language", component: WordCards },
  { path: "/quiz", component: WordQuiz },
];

const router = new VueRouter({
  routes,
});

export default router;
