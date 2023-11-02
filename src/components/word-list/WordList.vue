<template>
  <div>
    <loader-component v-if="isLoading" />

    <choose-group v-else-if="currentGroupId === null" />

    <plug-component v-else-if="!words.length" />

    <template v-else>
      <div v-if="owner" class="text-center mt-2 blue-grey--text">
        Word list of {{ owner }}
      </div>

      <div class="d-flex justify-center">
        <v-btn
          @click="copyList"
          text
          class="text-body-2 font-weight-bold text-decoration-underline emerald--text"
        >
          Copy list
        </v-btn>
        <v-btn
          @click="isLineView = !isLineView"
          text
          class="text-body-2 font-weight-bold text-decoration-underline emerald--text"
        >
          {{ isLineView ? "Show cards" : "Show lines" }}
        </v-btn>
      </div>

      <v-container v-if="isLineView">
        <v-sheet max-width="1240" width="100%">
          <word-card v-for="word in words" :key="word._id" :word="word" />
        </v-sheet>
      </v-container>

      <div v-else class="d-flex flex-wrap justify-center pb-4">
        <div
          v-for="word in words"
          :key="word._id"
          class="pa-2 flex-grow-1 flex-sm-grow-0"
        >
          <full-card :word="word" />
          <v-divider v-if="isMobile"></v-divider>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores } from "pinia";
import WordCard from "./WordCard.vue";
import PlugComponent from "@/components/common/PlugComponent.vue";
import ChooseGroup from "@/components/common/ChooseGroup.vue";
import LoaderComponent from "@/components/common/LoaderComponent.vue";
import FullCard from "@/components/common/FullCard.vue";

export default {
  name: "WordList",

  components: {
    WordCard,
    PlugComponent,
    ChooseGroup,
    LoaderComponent,
    FullCard,
  },

  data() {
    return {
      isLineView: true,
    };
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

    owner() {
      return this.appStore.owner;
    },

    isMobile() {
      return this.$vuetify.breakpoint.xs;
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
