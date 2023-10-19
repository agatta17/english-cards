<template>
  <div class="wrap">
    <loader-component v-if="isLoading" />

    <choose-group v-else-if="currentGroupId === null" />

    <plug-component v-else-if="!words.length" />

    <v-container v-else class="wrap">
      <v-sheet :height="isMobile ? '100%' : 'auto'">
        <v-carousel
          v-model="wordIndex"
          hide-delimiters
          :show-arrows="!isMobile"
          height="100%"
        >
          <v-carousel-item v-for="(word, i) in words" :key="i">
            <div class="d-flex justify-center wrap">
              <v-sheet
                class="px-5 pt-1 pb-5"
                :width="isMobile ? '100%' : '400px'"
                :outlined="!isMobile"
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

                  <v-btn @click="removeWord(word._id)" icon>
                    <v-icon color="terracotta ">
                      {{ `mdi-delete-outline ${getIsSpinRemove(word._id)}` }}
                    </v-icon>
                  </v-btn>

                  <v-btn @click="toggleEditForm(word._id, true)" icon>
                    <v-icon color="sky"> mdi-pencil </v-icon>
                  </v-btn>
                </div>

                <v-sheet
                  @click="toggleTranslation"
                  min-height="480px"
                  height="95%"
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
                    v-if="
                      word.picture &&
                      word.picture !==
                        'https://cdn-icons-png.flaticon.com/512/3983/3983886.png' &&
                      !isEnglishFlashCard
                    "
                    class="mt-4 d-flex justify-center"
                  >
                    <img :src="word.picture" class="card-picture" />
                  </div>

                  <div v-if="!isRussianFlashCard" class="mt-4 text-h5">
                    {{ word.englishWord }}
                    <v-btn @click="say(word.englishWord)" icon small>
                      <v-icon color="peach" class="mb-1">mdi-bullhorn</v-icon>
                    </v-btn>
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
                    v-html="
                      word.srcSegment?.replace(
                        word.englishWord,
                        `<em>${word.englishWord}</em>`
                      ) || word.englishExample
                    "
                    class="mt-4 blue-grey--text"
                  ></div>

                  <template v-if="word.collocates && !isRussianFlashCard">
                    <div class="mt-4 body-2 font-weight-bold">Collocates</div>
                    <ul>
                      <li
                        v-for="item in word.collocates.split('\n')"
                        :key="item"
                      >
                        {{ item }}
                      </li>
                    </ul>
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
                        <ul class="mt-4">
                          <li
                            v-for="item in word.moreExamples.split('\n')"
                            :key="item"
                          >
                            {{ item }}
                          </li>
                        </ul>
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
                    <div
                      @click="(event) => event.stopPropagation()"
                      class="d-flex mt-4"
                    >
                      <a
                        :href="
                          word.reverso ||
                          `https://context.reverso.net/перевод/английский-русский/${word.englishWord}`
                        "
                        target="_blank"
                      >
                        <img height="20px" src="@/assets/reverso.png" />
                      </a>
                    </div>

                    <div
                      @click="(event) => event.stopPropagation()"
                      class="d-flex"
                    >
                      <a
                        v-if="word.youglish"
                        :href="word.youglish"
                        target="_blank"
                        class="ml-3"
                      >
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

    firstWord() {
      return this.words[0]?.englishWord;
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
      return this.$vuetify.breakpoint.xs;
    },

    isEnglishFlashCard() {
      return this.languageOfCard === "english" && !this.isShowTranslation;
    },

    isRussianFlashCard() {
      return this.languageOfCard === "russian" && !this.isShowTranslation;
    },
  },

  methods: {
    ...mapActions(useAppStore, [
      "say",
      "toggleDone",
      "removeWord",
      "toggleEditForm",
    ]),

    getIsSpinToggle(wordId) {
      return this.appStore.loadingToggleWordId === wordId ? "mdi-spin" : "";
    },

    getIsSpinRemove(wordId) {
      return this.appStore.loadingRemoveWordId === wordId ? "mdi-spin" : "";
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
    wordIndex: {
      handler() {
        this.isShowTranslation = false;
        if (this.languageOfCard === "english")
          this.say(this.words[this.wordIndex].englishWord);
      },
      immediate: true,
    },

    words(newVal, oldVal) {
      if (newVal.length < oldVal.length) this.isShowTranslation = false;
    },

    languageOfCard() {
      this.isShowTranslation = false;
      if (this.languageOfCard === "english")
        this.say(this.words[this.wordIndex].englishWord);
    },

    firstWord() {
      if (this.languageOfCard === "english")
        this.say(this.words[this.wordIndex].englishWord);
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

.card-picture {
  max-width: 100%;
  max-height: 220px;
}

.wrap {
  height: 100%;
}
</style>
