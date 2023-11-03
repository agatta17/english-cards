<template>
  <div v-if="!isMobile">
    <v-app-bar color="emerald" dense flat class="d-flex justify-center">
      <v-btn
        :to="`/${groupQueryParamString}`"
        text
        color="white"
        class="mr-5"
        exact-path
      >
        List
      </v-btn>

      <template v-if="username">
        <template v-if="!owner">
          <v-btn
            text
            :to="`/cards/english${groupQueryParamString}`"
            color="white"
            class="mr-5"
            >English flashcards</v-btn
          >

          <v-btn
            text
            :to="`/cards/russian${groupQueryParamString}`"
            color="white"
            class="mr-5"
            >Russian flashcards</v-btn
          >

          <v-btn
            text
            :to="`/quiz${groupQueryParamString}`"
            color="white"
            class="mr-5"
            >Quiz</v-btn
          >
        </template>

        <v-btn @click="downloadWordList" class="mr-5" depressed>Download</v-btn>

        <v-btn @click="toggleWordLoader" class="mr-5" depressed>Create</v-btn>

        <v-btn @click="logout" icon color="white">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>

      <template v-else>
        <v-btn
          :to="`/login${groupQueryParamString}`"
          class="mr-5"
          text
          color="white"
        >
          Login
        </v-btn>

        <v-btn
          :to="`/registration${groupQueryParamString}`"
          class="mr-5"
          text
          color="white"
        >
          Registration
        </v-btn>
      </template>
    </v-app-bar>
  </div>

  <div v-else>
    <v-app-bar color="emerald" app bottom class="d-flex justify-center">
      <v-btn
        v-if="username"
        @click="$emit('update:groupFilterIsOpen', true)"
        text
        color="white"
        small
      >
        <v-icon>mdi-folder-multiple</v-icon>
      </v-btn>

      <v-btn
        :to="`/${groupQueryParamString}`"
        text
        color="white"
        exact-path
        small
      >
        <v-icon> mdi-view-list</v-icon>
      </v-btn>

      <template v-if="username">
        <template v-if="!owner">
          <v-btn
            text
            :to="`/cards/english${groupQueryParamString}`"
            color="white"
            small
          >
            <span class="text-subtitle-1">Eng</span>
          </v-btn>

          <v-btn
            text
            :to="`/cards/russian${groupQueryParamString}`"
            color="white"
            small
          >
            <span class="text-subtitle-1">Rus</span>
          </v-btn>

          <v-btn text :to="`/quiz${groupQueryParamString}`" color="white" small>
            <span class="text-subtitle-1">Quiz</span>
          </v-btn>
        </template>

        <v-btn @click="toggleWordLoader" text color="white" small>
          <v-icon>mdi-cloud-upload</v-icon>
        </v-btn>

        <v-btn @click="logout" text color="white" small>
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>

      <template v-else>
        <v-btn
          :to="`/login${groupQueryParamString}`"
          class="ml-5"
          text
          color="white"
        >
          Login
        </v-btn>

        <v-btn
          :to="`/registration${groupQueryParamString}`"
          class="ml-5"
          text
          color="white"
        >
          Registration
        </v-btn>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";

export default {
  name: "AppNavigation",

  props: {
    groupFilterIsOpen: {
      type: Boolean,
    },
  },

  computed: {
    ...mapStores(useAppStore),

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    groupQueryParamString() {
      return this.$route.query.group ? `?group=${this.$route.query.group}` : "";
    },

    username() {
      return this.appStore.username;
    },

    owner() {
      return this.appStore.owner;
    },
  },

  methods: {
    ...mapActions(useAppStore, [
      "toggleWordLoader",
      "downloadWordList",
      "initApp",
    ]),

    logout() {
      localStorage.removeItem("apikey");
      this.$router.push(`/${this.groupQueryParamString}`);
      this.initApp();
    },
  },
};
</script>

<style scoped>
.v-application--wrap .mdi-menu {
  font-size: 24px;
}
</style>
