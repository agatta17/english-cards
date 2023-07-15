<template>
  <div id="app">
    <v-app>
      <group-filter :is-open.sync="groupFilterIsOpen" />
      <v-main>
        <app-navigation :group-filter-is-open.sync="groupFilterIsOpen" />
        <router-view> </router-view>
        <word-loader />
      </v-main>
    </v-app>

    <speech v-model="play" />
  </div>
</template>

<script>
import GroupFilter from "@/components/common/GroupFilter.vue";
import AppNavigation from "@/components/common/AppNavigation.vue";
import WordLoader from "@/components/common/WordLoader.vue";
import Speech from "@/components/common/SpeechComponent.vue";
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";

export default {
  name: "App",

  components: {
    GroupFilter,
    AppNavigation,
    WordLoader,
    Speech,
  },

  data() {
    return {
      groupFilterIsOpen: false,
    };
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

    initialGroupId() {
      return this.$router.currentRoute.query.group;
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["getGroups", "setGroup"]),
  },

  async mounted() {
    this.groupFilterIsOpen = this.isMobile ? false : true;

    await this.getGroups();

    if (this.initialGroupId) {
      this.setGroup(this.initialGroupId);
    }
  },
};
</script>

<style>
em {
  background: var(--v-error-lighten5);
}
</style>
