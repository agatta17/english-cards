<template>
  <div class="d-flex flex-column">
    <v-toolbar>
      <tool-bar v-if="!isMobile" />
      <group-filter />
    </v-toolbar>

    <loader-component v-if="isLoading" />

    <choose-group v-else-if="currentGroupId === null" />

    <plug-component v-else-if="!words.length" />

    <v-sheet
      v-else
      max-width="1100"
      width="100%"
      class="align-self-center mt-md-8"
    >
      <word-card v-for="word in words" :key="word._id" :word="word" />
    </v-sheet>
  </div>
</template>

<script>
import GroupFilter from "@/components/common/GroupFilter.vue";
import ToolBar from "@/components/common/ToolBar.vue";
import { useAppStore } from "@/store";
import { mapStores } from "pinia";
import WordCard from "./WordCard.vue";
import PlugComponent from "@/components/common/PlugComponent.vue";
import ChooseGroup from "@/components/common/ChooseGroup.vue";
import LoaderComponent from "@/components/common/LoaderComponent.vue";

export default {
  name: "WordList",

  components: {
    GroupFilter,
    ToolBar,
    WordCard,
    PlugComponent,
    ChooseGroup,
    LoaderComponent,
  },

  computed: {
    ...mapStores(useAppStore),

    words() {
      return this.appStore.filteredWordsForList;
    },

    isLoading() {
      return this.appStore.isLoading;
    },

    currentGroupId() {
      return this.appStore.currentGroupId;
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>
