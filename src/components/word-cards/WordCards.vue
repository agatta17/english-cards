<template>
  <div>
    <loader-component v-if="isLoading" />

    <choose-group v-else-if="currentGroupId === null" />

    <plug-component v-else-if="!words.length" />

    <v-container v-else>
      <v-sheet>
        <v-carousel
          v-model="wordIndex"
          hide-delimiters
          :show-arrows="!isMobile"
          height="100%"
        >
          <v-carousel-item v-for="(word, i) in words" :key="i">
            <div class="d-flex justify-center">
              <v-sheet
                class="px-1 px-sm-16 py-1 py-sm-16 carousel-item-wrap"
                width="100%"
              >
                <div class="actions">
                  <v-btn @click="toggleDone(word._id, true)" icon x-large>
                    <v-icon x-large color="emerald">
                      {{
                        `mdi-checkbox-marked-outline ${getIsSpinToggle(
                          word._id
                        )}`
                      }}
                    </v-icon>
                  </v-btn>

                  <v-btn @click="say(word.englishWord)" icon x-large>
                    <v-icon x-large color="peach">mdi-bullhorn</v-icon>
                  </v-btn>

                  <v-btn @click="toggleEditForm(word._id, true)" icon x-large>
                    <v-icon x-large color="sky"> mdi-pencil </v-icon>
                  </v-btn>
                </div>

                <img class="picture" :src="word.picture" />

                <div>
                  <component
                    :is="`${languageOfCard}Word`"
                    :word="word[`${languageOfCard}Word`]"
                    :example="word[`${languageOfCard}Example`]"
                    class="mt-8"
                  />

                  <component
                    :is="`${languageOfTranslation}Word`"
                    v-show="isShowTranslation"
                    :word="word[`${languageOfTranslation}Word`]"
                    :example="word[`${languageOfTranslation}Example`]"
                    class="mt-8"
                  />

                  <v-btn
                    v-show="!isShowTranslation"
                    @click="showTranslation"
                    depressed
                    outlined
                    color="blue-grey darken-2"
                    class="mt-8"
                  >
                    Translation
                  </v-btn>
                </div>
              </v-sheet>
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";
import EnglishWord from "./EnglishWord.vue";
import RussianWord from "./RussianWord.vue";
import PlugComponent from "@/components/common/PlugComponent.vue";
import ChooseGroup from "@/components/common/ChooseGroup.vue";
import LoaderComponent from "@/components/common/LoaderComponent.vue";

export default {
  name: "WordCards",

  components: {
    EnglishWord,
    RussianWord,
    PlugComponent,
    ChooseGroup,
    LoaderComponent,
  },

  data() {
    return {
      wordIndex: 0,
      isShowTranslation: false,
      showAssociationEditor: false,
    };
  },

  computed: {
    ...mapStores(useAppStore),

    isLoading() {
      return this.appStore.isLoading;
    },

    words() {
      return this.appStore.filteredWordsForCards;
    },

    languageOfCard() {
      return this.$route.params.language;
    },

    languageOfTranslation() {
      return this.languageOfCard === "english" ? "russian" : "english";
    },

    currentGroupId() {
      return this.appStore.currentGroupId;
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    ...mapActions(useAppStore, [
      "addPicture",
      "addAssociation",
      "say",
      "toggleDone",
      "toggleEditForm",
    ]),

    getIsSpinToggle(wordId) {
      return this.appStore.loadingToggleWordId === wordId ? "mdi-spin" : "";
    },

    editAssociation(event, word) {
      this.addAssociation(event.target.value, word._id);
      this.showAssociationEditor = false;
    },

    showTranslation() {
      this.isShowTranslation = true;
      if (this.languageOfCard === "russian")
        this.say(this.words[this.wordIndex].englishWord);
    },
  },

  watch: {
    wordIndex() {
      this.isShowTranslation = false;
      if (this.languageOfCard === "english")
        this.say(this.words[this.wordIndex].englishWord);
    },

    words(newVal, oldVal) {
      if (newVal.length < oldVal.length) this.isShowTranslation = false;
    },

    languageOfCard() {
      this.isShowTranslation = false;
    },
  },
};
</script>

<style>
.carousel-item-wrap {
  position: relative;
}

.actions {
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
}

.picture {
  width: calc(100% - 52px);
}

@media (min-width: 450px) {
  .carousel-item-wrap {
    display: flex;
    column-gap: 30px;
  }

  .actions {
    flex-direction: row;
  }

  .picture {
    width: auto;
    height: 300px;
  }
}
</style>
