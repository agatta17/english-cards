import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import "vuetify/dist/vuetify.min.css";
import VueRouter from "vue-router";
import router from "@/router";
import { createPinia, PiniaVuePlugin } from "pinia";

Vue.config.productionTip = false;

Vue.use(VueRouter);

Vue.use(PiniaVuePlugin);
const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = router;
});

new Vue({ pinia, router, vuetify, render: (h) => h(App) }).$mount("#app");
