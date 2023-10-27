<template>
  <div class="wrap">
    <loader-component v-if="isLoading" />

    <choose-group v-else-if="currentGroupId === null" />

    <plug-component v-else-if="!words.length" />

    <div v-else-if="isError">Error!!!</div>

    <v-container v-else class="wrap">
      <v-sheet :height="isMobile ? '100%' : 'auto'">
        <v-carousel
          v-model="wordIndex"
          hide-delimiters
          :show-arrows="!isMobile"
          height="100%"
        >
          <v-carousel-item v-for="(word, i) in wordsWithOptions" :key="i">
            <div class="d-flex justify-center wrap">
              <v-sheet
                class="px-5 pt-1 pb-5"
                :width="isMobile ? '100%' : '400px'"
                :outlined="!isMobile"
                rounded
              >
                <v-sheet
                  min-height="480px"
                  height="95%"
                  class="d-flex flex-column justify-center"
                >
                  <div
                    v-if="
                      word.picture &&
                      word.picture !==
                        'https://cdn-icons-png.flaticon.com/512/3983/3983886.png'
                    "
                    class="mt-4 d-flex justify-center"
                  >
                    <img height="220px" :src="word.picture" />
                  </div>

                  <div v-if="word.definition" class="mt-4 font-italic">
                    {{ word.definition }}
                  </div>

                  <div
                    v-if="word.russianExample"
                    class="mt-1"
                    v-html="word.russianExample"
                  ></div>

                  <div v-if="word.russianWord" class="mt-3 d-flex flex-wrap">
                    <span
                      v-for="word in getWordArray(word.russianWord)"
                      :key="word"
                      class="russian-word mr-1 mt-1"
                    >
                      {{ word }}
                    </span>
                  </div>

                  <div class="mt-6 questions">
                    <v-card
                      v-for="option in word.options"
                      :key="option"
                      @click="checkAnswer(option, word.englishWord)"
                      outlined
                      class="px-3 py-2 mb-2"
                    >
                      <span
                        :class="{
                          correct:
                            answerIsHighlighted && option === word.englishWord,
                        }"
                      >
                        {{ option }}
                      </span>
                    </v-card>
                  </div>

                  <div class="mistake">
                    <v-card
                      v-if="isMistake"
                      class="mt-1 deep-orange--text d-flex align-center justify-center"
                      flat
                      color="deep-orange lighten-5"
                      height="100%"
                    >
                      Try again!
                    </v-card>
                  </div>
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
import { mapActions, mapStores } from "pinia";
import PlugComponent from "@/components/common/PlugComponent.vue";
import ChooseGroup from "@/components/common/ChooseGroup.vue";
import LoaderComponent from "@/components/common/LoaderComponent.vue";

export default {
  name: "WordQuiz",

  components: {
    PlugComponent,
    ChooseGroup,
    LoaderComponent,
  },

  data() {
    return {
      wordIndex: 0,
      randomWordList: [],
      optionCount: 4,
      wordsWithOptions: [],
      answerIsHighlighted: false,
      isMistake: false,
      isError: false,
    };
  },

  computed: {
    ...mapStores(useAppStore),

    words() {
      return this.appStore.filteredWordsForCards;
    },

    isLoading() {
      return this.appStore.isLoading;
    },

    currentGroupId() {
      return this.appStore.currentGroupId;
    },

    isMobile() {
      return this.$vuetify.breakpoint.xs;
    },

    firstWord() {
      return this.words[0]?.englishWord;
    },
  },

  methods: {
    getWordArray(string) {
      return string.split(",");
    },

    ...mapActions(useAppStore, ["getRandomWordList", "say"]),

    async getRandomList() {
      try {
        const list = await this.getRandomWordList(
          this.words.length * (this.optionCount - 1)
        );

        this.randomWordList = list.map(({ englishWord }) => englishWord);
      } catch {
        throw new Error("Error getting quiz data");
      }
    },

    randomInteger(min, max) {
      const rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    },

    checkAnswer(option, correct) {
      if (option === correct) {
        this.isMistake = false;
        this.answerIsHighlighted = true;
        this.say(correct);
        setTimeout(() => this.wordIndex++, 1300);
      } else {
        this.isMistake = true;
        this.say("try again");
      }
    },
  },

  watch: {
    firstWord: {
      async handler() {
        if (!this.words.length) return;

        try {
          this.isError = false;

          await this.getRandomList();

          this.wordsWithOptions = this.words.map((item, i) => {
            const start = (this.optionCount - 1) * i;
            const options = this.randomWordList.slice(
              start,
              start + this.optionCount - 1
            );
            const random = this.randomInteger(0, this.optionCount - 1);
            options.splice(random, 0, item.englishWord);
            return { ...item, options };
          });
        } catch {
          this.isError = true;
        }
      },

      immediate: true,
    },

    wordIndex() {
      this.answerIsHighlighted = false;
      this.isMistake = false;
    },
  },
};
</script>

<style scoped>
.questions {
  cursor: pointer;
}

.correct {
  color: var(--v-emerald-base);
  font-weight: bold;
}

.mistake {
  height: 30px;
}
</style>
