<template>
  <div class="d-flex flex-column">
    <v-toolbar>
      <group-filter />
      <v-spacer></v-spacer>
      <tool-bar />
    </v-toolbar>

    <v-sheet
      v-if="words.length"
      color="white"
      max-width="1100"
      class="align-self-center mt-8"
    >
      <word-card v-for="(word, i) in words" :key="i" :word="word" />
    </v-sheet>
    <plug-component v-else />
  </div>
</template>

<script>
import GroupFilter from "@/components/common/GroupFilter.vue";
import ToolBar from "./ToolBar.vue";
import { useAppStore } from "@/store";
import { mapStores } from "pinia";
import WordCard from "./WordCard.vue";
import PlugComponent from "@/components/common/PlugComponent.vue";

export default {
  name: "WordList",

  components: {
    GroupFilter,
    ToolBar,
    WordCard,
    PlugComponent,
  },

  computed: {
    ...mapStores(useAppStore),

    words() {
      return this.appStore.filteredWordsForList;
    },
  },
};
</script>
