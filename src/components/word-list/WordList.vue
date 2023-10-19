<template>
  <div>
    <loader-component v-if="isLoading" />

    <choose-group v-else-if="currentGroupId === null" />

    <plug-component v-else-if="!words.length" />

    <v-container v-else>
      <v-sheet max-width="1240" width="100%">
        <word-card v-for="word in words" :key="word._id" :word="word" />

        <div class="d-flex justify-center">
          <v-btn
            @click="copyList"
            text
            class="text-body-2 font-weight-bold text-decoration-underline emerald--text"
          >
            Copy list
          </v-btn>
        </div>
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores } from "pinia";
import WordCard from "./WordCard.vue";
import PlugComponent from "@/components/common/PlugComponent.vue";
import ChooseGroup from "@/components/common/ChooseGroup.vue";
import LoaderComponent from "@/components/common/LoaderComponent.vue";

export default {
  name: "WordList",

  components: {
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

  methods: {
    copyList() {
      const wordList = this.words
        .map(({ englishWord }) => englishWord)
        .join(", ");
      navigator.clipboard.writeText(wordList);
    },
  },
};
</script>
