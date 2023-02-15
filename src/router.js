import VueRouter from "vue-router";
import WordList from "@/components/word-list/WordList.vue";
import WordCards from "@/components/word-cards/WordCards.vue";

const routes = [
  { path: "/", component: WordList },
  { path: "/cards/:language", component: WordCards },
];

const router = new VueRouter({
  routes,
});

export default router;
