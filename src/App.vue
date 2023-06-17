<template>
  <div id="app">
    <v-app>
      <app-navigation />
      <router-view> </router-view>
      <word-loader />
    </v-app>

    <speech v-model="play" />
  </div>
</template>

<script>
import AppNavigation from "@/components/common/AppNavigation.vue";
import WordLoader from "@/components/common/WordLoader.vue";
import Speech from "@/components/common/SpeechComponent.vue";
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";

export default {
  name: "App",

  components: {
    AppNavigation,
    WordLoader,
    Speech,
  },

  computed: {
    ...mapStores(useAppStore),

    play: {
      get() {
        return this.appStore.speechSounds;
      },
      set(newVal) {
        this.appStore.speechSounds = newVal;
      },
    },
  },

  methods: {
    ...mapActions(useAppStore, ["getInit"]),
  },

  mounted() {
    this.getInit();
  },
};
</script>

<style>
em {
  background: var(--v-error-lighten5);
}
</style>
