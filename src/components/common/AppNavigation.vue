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

      <v-btn @click="downloadWordList" class="mr-5" depressed>Download</v-btn>

      <v-btn @click="toggleWordLoader" depressed>Create</v-btn>
    </v-app-bar>
  </div>

  <div v-else>
    <v-app-bar color="emerald" app bottom class="d-flex justify-center">
      <v-btn
        @click="$emit('update:groupFilterIsOpen', true)"
        text
        color="white"
      >
        <v-icon large>mdi-folder-multiple</v-icon>
      </v-btn>

      <v-btn
        :to="`/?group=${$route.query.group}`"
        text
        color="white"
        exact-path
      >
        <v-icon large> mdi-view-list</v-icon>
      </v-btn>

      <v-btn
        text
        :to="`/cards/english?group=${$route.query.group}`"
        color="white"
      >
        <span class="text-h6">Eng</span>
      </v-btn>

      <v-btn
        text
        :to="`/cards/russian?group=${$route.query.group}`"
        color="white"
      >
        <span class="text-h6">Rus</span>
      </v-btn>

      <v-btn @click="toggleWordLoader" text color="white">
        <v-icon large>mdi-cloud-upload</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { mapActions } from "pinia";

export default {
  name: "AppNavigation",

  props: {
    groupFilterIsOpen: {
      type: Boolean,
    },
  },

  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    groupQueryParamString() {
      return this.$route.query.group ? `?group=${this.$route.query.group}` : "";
    },
  },

  methods: {
    ...mapActions(useAppStore, ["toggleWordLoader", "downloadWordList"]),
  },
};
</script>

<style scoped>
.v-application--wrap .mdi-menu {
  font-size: 24px;
}
</style>
