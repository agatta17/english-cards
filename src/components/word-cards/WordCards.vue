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
          :height="isMobile ? '100%' : 500"
          :show-arrows="!isMobile"
        >
          <v-carousel-item v-for="(word, i) in words" :key="i">
            <v-sheet
              class="px-1 px-sm-16 py-1 py-sm-16 carousel-item-wrap"
              rounded
            >
              <div v-if="isMobile" class="actions">
                <v-btn @click="toggleDone(word._id, !done)" icon x-large>
                  <v-icon x-large>
                    {{ done ? "mdi-close" : "mdi-checkbox-marked-outline" }}
                  </v-icon>
                </v-btn>

                <v-btn @click="say(word.englishWord)" icon x-large>
                  <v-icon x-large>mdi-bullhorn</v-icon>
                </v-btn>
              </div>

              <v-row justify="center" :align="isMobile ? 'center' : 'start'">
                <v-col
                  :cols="isMobile ? 12 : 6"
                  class="d-flex flex-column justify-center align-center"
                >
                  <img
                    class="picture"
                    :src="word.picture"
                    :height="isMobile ? '150px' : '300px'"
                  />

                  <div v-if="!isMobile" class="mt-4">
                    <v-text-field
                      @keydown.enter="
                        (event) => addPicture(event.target.value, word._id)
                      "
                      label="Change the picture"
                      dense
                      hide-details
                      color="cyan"
                    />
                  </div>
                </v-col>

                <v-col
                  :cols="isMobile ? 12 : 6"
                  class="d-flex flex-column justify-space-between"
                >
                  <component
                    :is="`${languageOfCard}Word`"
                    :word="word[`${languageOfCard}Word`]"
                    :example="word[`${languageOfCard}Example`]"
                    :wordId="word._id"
                  />

                  <div class="translation d-flex align-end">
                    <div v-show="isShowTranslation">
                      <component
                        :is="`${languageOfTranslation}Word`"
                        :word="word[`${languageOfTranslation}Word`]"
                        :example="word[`${languageOfTranslation}Example`]"
                        :wordId="word._id"
                      />
                    </div>

                    <v-btn
                      v-show="!isShowTranslation"
                      @click="showTranslation"
                      depressed
                      outlined
                      color="blue-grey darken-2"
                    >
                      Translation
                    </v-btn>
                  </div>

                  <div class="mt-8">
                    <span
                      v-if="word.association && !showAssociationEditor"
                      @click="showAssociationEditor = true"
                      class="text-h6"
                    >
                      {{ word.association }}
                    </span>

                    <v-text-field
                      v-else
                      @keydown.enter="(event) => editAssociation(event, word)"
                      :value="word.association"
                      label="Add association"
                      dense
                      hide-details
                      color="cyan"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-sheet>
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
    ]),

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
.translation {
  min-height: 140px;
}

.carousel-item-wrap {
  position: relative;
  /* border: 4px solid;
  border-color: var(--v-sky-base) !important; */
}

.actions {
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
}

/* @media (min-width: 700px) {
  .v-main__wrap {
    background: var(--v-peach-lighten2);
  }
} */
</style>
