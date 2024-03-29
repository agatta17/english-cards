<template>
  <div class="d-flex justify-center wrap">
    <v-sheet
      class="px-5 pt-1 pb-5"
      :width="isMobile ? '100%' : '400px'"
      :outlined="!isMobile"
      rounded
    >
      <div v-if="!owner" class="d-flex justify-end">
        <v-btn @click="toggleDone(word._id, !word.done)" icon>
          <v-icon :color="word.done ? 'cherry darken-1' : 'emerald'">
            {{
              word.done
                ? `mdi-clock-outline ${getIsSpinToggle(word._id)}`
                : `mdi-checkbox-marked-outline ${getIsSpinToggle(word._id)}`
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

        <v-btn
          v-if="checkSoundIsOn"
          @click="$emit('update:soundIsOn', !soundIsOn)"
          icon
        >
          <v-icon color="peach">
            {{ soundIsOn ? "mdi-music" : "mdi-music-off" }}
          </v-icon>
        </v-btn>

        <v-btn
          v-if="isShowFullCard"
          @click="$emit('update:isShowFullCard', false)"
          icon
        >
          <v-icon color="sky">{{
            isShowFullCard
              ? "mdi-help-circle-outline"
              : "mdi-information-outline"
          }}</v-icon>
        </v-btn>
      </div>

      <v-sheet
        @click="$emit('toggle')"
        min-height="480px"
        height="95%"
        class="d-flex flex-column justify-center"
      >
        <div v-if="!isEnglishFlashCard && !isRussianFlashCard && !owner">
          <v-chip small class="blue-grey--text text--darken-2 amber lighten-4">
            {{ getGroupName(word.groupId) }}
          </v-chip>
        </div>

        <div v-show="word.picture && !isEnglishFlashCard">
          <v-card height="220px" flat class="mt-4 d-flex justify-center">
            <img :src="word.picture" class="card-picture" />
          </v-card>
        </div>

        <div v-if="!isRussianFlashCard" class="mt-4 text-h5">
          {{ word.englishWord }}
          <v-btn @click.stop="say(word.englishWord)" icon small>
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
          class="mt-4 blue-grey--text"
        >
          <span
            v-html="
              word.srcSegment?.replace(
                word.englishWord,
                `<em>${word.englishWord}</em>`
              ) || word.englishExample
            "
          ></span>
          <v-btn @click.stop="say(word.srcSegment)" icon small>
            <v-icon color="peach" class="mb-1">mdi-bullhorn</v-icon>
          </v-btn>
        </div>

        <template v-if="word.collocates && !isRussianFlashCard">
          <div class="mt-4 body-2 font-weight-bold">Collocates</div>
          <ul>
            <li v-for="item in word.collocates.split('\n')" :key="item">
              {{ item }}
            </li>
          </ul>
        </template>

        <div
          v-if="word.englishExample && !isRussianFlashCard"
          class="mt-4 blue--text text--darken-4"
        >
          <span v-html="word.englishExample"></span>
          <v-btn
            @click.stop="say(word.englishExample.replace(/<em>|<\/em>/g, ''))"
            icon
            small
          >
            <v-icon color="peach" class="mb-1">mdi-bullhorn</v-icon>
          </v-btn>
        </div>

        <div
          v-if="word.russianExample && !isEnglishFlashCard"
          class="mt-1"
          v-html="word.russianExample"
        ></div>

        <template v-if="word.moreExamples && !isRussianFlashCard">
          <div class="mt-4 body-2 font-weight-bold">Extra Examples</div>
          <ul>
            <li v-for="item in word.moreExamples.split('\n')" :key="item">
              {{ item }}
            </li>
          </ul>
        </template>

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
          <div @click="(event) => event.stopPropagation()" class="d-flex mt-4">
            <a :href="reversoLink" target="_blank">
              <img height="20px" src="@/assets/reverso.png" />
            </a>
          </div>

          <div v-if="word.comments" class="mt-2 body-2">
            {{ word.comments }}
          </div>
        </template>
      </v-sheet>
    </v-sheet>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";
import { REVERSO_LINK } from "@/constants";

export default {
  name: "FullCard",

  props: {
    word: { type: Object, default: () => {} },
    isShowTranslation: { type: Boolean, default: true },
    soundIsOn: { require: false },
    isShowFullCard: { type: Boolean, default: false },
  },

  computed: {
    ...mapStores(useAppStore),

    groups() {
      return this.appStore.groups;
    },

    languageOfCard() {
      return this.$route.params.language;
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

    checkSoundIsOn() {
      return typeof this.soundIsOn !== "undefined";
    },

    owner() {
      return this.appStore.owner;
    },

    reversoLink() {
      return REVERSO_LINK(this.word.englishWord);
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
</style>
