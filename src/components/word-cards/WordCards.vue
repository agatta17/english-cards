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
                @click="toggleTranslation"
                class="px-5 pt-1 pb-5"
                width="400"
                outlined
                rounded
              >
                <div class="d-flex justify-end">
                  <v-btn @click="toggleDone(word._id, true)" icon>
                    <v-icon color="emerald">
                      {{
                        `mdi-checkbox-marked-outline ${getIsSpinToggle(
                          word._id
                        )}`
                      }}
                    </v-icon>
                  </v-btn>

                  <v-btn @click="say(word.englishWord)" icon>
                    <v-icon color="peach">mdi-bullhorn</v-icon>
                  </v-btn>

                  <v-btn @click="toggleEditForm(word._id, true)" icon>
                    <v-icon color="sky"> mdi-pencil </v-icon>
                  </v-btn>
                </div>

                <v-sheet
                  min-height="480px"
                  class="d-flex flex-column justify-center"
                >
                  <div v-if="!isEnglishFlashCard && !isRussianFlashCard">
                    <v-chip
                      small
                      class="blue-grey--text text--darken-2 amber lighten-4"
                    >
                      {{ getGroupName(word.groupId) }}
                    </v-chip>
                  </div>

                  <div
                    v-if="word.picture && !isEnglishFlashCard"
                    class="mt-4 d-flex justify-center"
                  >
                    <img height="220px" :src="word.picture" />
                  </div>

                  <div v-if="!isRussianFlashCard" class="mt-4 text-h5">
                    {{ word.englishWord }}
                  </div>

                  <div
                    v-if="word.transcription && !isRussianFlashCard"
                    class="blue-grey--text"
                  >
                    {{ word.transcription }}
                  </div>

                  <div v-if="word.partOfSpeech && !isRussianFlashCard">
                    <span class="part-of-speech">{{ word.partOfSpeech }}</span>
                  </div>

                  <div
                    v-if="word.definition && !isEnglishFlashCard"
                    class="mt-4 font-italic"
                  >
                    {{ word.definition }}
                  </div>

                  <div
                    v-if="word.srcSegment && !isRussianFlashCard"
                    class="mt-4 blue-grey--text"
                  >
                    {{ word.srcSegment }}
                  </div>

                  <template v-if="word.collocates && !isRussianFlashCard">
                    <div class="mt-4 body-2 font-weight-bold">Collocates</div>
                    <div v-html="word.collocates"></div>
                  </template>

                  <div
                    v-if="word.englishExample && !isRussianFlashCard"
                    class="mt-4 blue--text text--darken-4"
                    v-html="word.englishExample"
                  ></div>
                  <div
                    v-if="word.russianExample && !isEnglishFlashCard"
                    class="mt-1"
                    v-html="word.russianExample"
                  ></div>

                  <v-expansion-panels
                    v-if="word.moreExamples && !isRussianFlashCard"
                    class="mt-4"
                    flat
                  >
                    <v-expansion-panel
                      @click="(event) => event.stopPropagation()"
                    >
                      <v-expansion-panel-header color="deep-orange lighten-4">
                        Extra Examples
                      </v-expansion-panel-header>
                      <v-expansion-panel-content color="deep-orange lighten-5">
                        <div class="mt-4" v-html="word.moreExamples"></div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>

                  <div
                    v-if="word.russianWord && !isEnglishFlashCard"
                    class="mt-3 d-flex flex-wrap"
                  >
                    <span
                      v-for="word in getWordArray(word.russianWord)"
                      :key="word"
                      class="russian-word mr-1 mt-1"
                    >
                      {{ word }}
                    </span>
                  </div>

                  <template v-if="!isEnglishFlashCard && !isRussianFlashCard">
                    <div class="d-flex mt-4">
                      <a :href="word.outcomes" target="_blank">
                        <img height="15px" src="@/assets/outcomes.png" />
                      </a>
                      <a :href="word.reverso" target="_blank" class="ml-3">
                        <img height="20px" src="@/assets/reverso.png" />
                      </a>
                    </div>

                    <div class="d-flex">
                      <a
                        :href="word.oxfordlearnersdictionaries"
                        target="_blank"
                      >
                        <img height="15px" src="@/assets/oxford.png" />
                      </a>
                      <a :href="word.youglish" target="_blank" class="ml-3">
                        <img height="15px" src="@/assets/youglish.png" />
                      </a>
                    </div>

                    <div v-if="word.comments" class="mt-2 body-2">
                      {{ word.comments }}
                    </div>
                  </template>
                </v-sheet>
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
import PlugComponent from "@/components/common/PlugComponent.vue";
import ChooseGroup from "@/components/common/ChooseGroup.vue";
import LoaderComponent from "@/components/common/LoaderComponent.vue";

export default {
  name: "WordCards",

  components: {
    PlugComponent,
    ChooseGroup,
    LoaderComponent,
  },

  data() {
    return {
      wordIndex: 0,
      isShowTranslation: false,
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

    groups() {
      return this.appStore.groups;
    },

    languageOfCard() {
      return this.$route.params.language;
    },

    currentGroupId() {
      return this.appStore.currentGroupId;
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    isEnglishFlashCard() {
      return this.languageOfCard === "english" && !this.isShowTranslation;
    },

    isRussianFlashCard() {
      return this.languageOfCard === "russian" && !this.isShowTranslation;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["say", "toggleDone", "toggleEditForm"]),

    getIsSpinToggle(wordId) {
      return this.appStore.loadingToggleWordId === wordId ? "mdi-spin" : "";
    },

    getGroupName(groupId) {
      return this.groups.find(({ id }) => id === groupId)?.name;
    },

    getWordArray(string) {
      return string.split(",");
    },

    toggleTranslation() {
      if (this.languageOfCard) this.isShowTranslation = !this.isShowTranslation;
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
<style scoped>
.part-of-speech {
  color: #fff;
  background: #4577bf;
  border-radius: 4px;
  padding-left: 6px;
  padding-right: 6px;
  padding-bottom: 1px;
  font-size: 14px;
}

.russian-word {
  background: #e3f2fd;
  border: solid 1px #78909c;
  border-radius: 4px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 6px;
}
</style>
