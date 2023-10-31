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
            <transition name="slide-up" mode="out-in">
              <full-card
                v-if="isShowTranslation"
                @toggle="toggleTranslation"
                :word="word"
                :sound-is-on.sync="soundIsOn"
                :is-show-translation="true"
                key="full"
              />
              <full-card
                v-else
                @toggle="toggleTranslation"
                :word="word"
                :sound-is-on.sync="soundIsOn"
                :is-show-translation="false"
                full="part"
              />
            </transition>
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
import FullCard from "@/components/common/FullCard.vue";

export default {
  name: "WordCards",

  components: {
    PlugComponent,
    ChooseGroup,
    LoaderComponent,
    FullCard,
  },

  data() {
    return {
      wordIndex: 0,
      isShowTranslation: false,
      soundIsOn: true,
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
    ...mapActions(useAppStore, ["say"]),

    toggleTranslation() {
      if (this.languageOfCard) this.isShowTranslation = !this.isShowTranslation;
    },
  },

  watch: {
    wordIndex: {
      handler() {
        this.isShowTranslation = false;
        if (this.languageOfCard === "english" && this.soundIsOn)
          this.say(this.words[this.wordIndex].englishWord);
      },
      immediate: true,
    },

    languageOfCard() {
      this.isShowTranslation = false;
      if (this.languageOfCard === "english" && this.soundIsOn)
        this.say(this.words[this.wordIndex].englishWord);
    },

    firstWord() {
      this.isShowTranslation = false;
      if (this.languageOfCard === "english" && this.soundIsOn)
        this.say(this.words[this.wordIndex].englishWord);
    },
  },
};
</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.15s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(160px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-160px);
}
</style>
