<template>
  <div>
    <v-toolbar>
      <group-filter />
    </v-toolbar>

    <v-container v-if="words.length">
      <v-sheet class="mt-8">
        <v-carousel v-model="wordIndex" hide-delimiters>
          <v-carousel-item v-for="(word, i) in words" :key="i">
            <v-sheet height="100%" tile outlined class="pa-16">
              <v-row justify="space-between">
                <v-col class="d-flex flex-column justify-center align-center">
                  <img class="picture" height="300px" :src="word.picture" />

                  <div class="mt-4">
                    <v-text-field
                      @keydown.enter="
                        (event) => addPicture(event.target.value, word.id)
                      "
                      label="change the picture"
                      dense
                      hide-details
                      color="cyan"
                    />
                  </div>
                </v-col>

                <v-col class="d-flex flex-column justify-space-between">
                  <component
                    :is="`${languageOfCard}Word`"
                    :word="word[`${languageOfCard}Word`]"
                    :example="word[`${languageOfCard}Example`]"
                    :wordId="word.id"
                  />

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
                      label="add association"
                      dense
                      hide-details
                      color="cyan"
                    />
                  </div>

                  <div class="translation d-flex align-end">
                    <div v-show="showTranslation">
                      <component
                        :is="`${languageOfTranslation}Word`"
                        :word="word[`${languageOfTranslation}Word`]"
                        :example="word[`${languageOfTranslation}Example`]"
                        :wordId="word.id"
                      />
                    </div>

                    <v-btn
                      v-show="!showTranslation"
                      @click="showTranslation = true"
                    >
                      Translation
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-sheet>
    </v-container>

    <plug-component v-else />
  </div>
</template>

<script>
import GroupFilter from "@/components/common/GroupFilter.vue";
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";
import EnglishWord from "./EnglishWord.vue";
import RussianWord from "./RussianWord.vue";
import PlugComponent from "@/components/common/PlugComponent.vue";

export default {
  name: "WordCards",

  components: {
    GroupFilter,
    EnglishWord,
    RussianWord,
    PlugComponent,
  },

  data() {
    return {
      wordIndex: 0,
      showTranslation: false,
      showAssociationEditor: false,
    };
  },

  computed: {
    ...mapStores(useAppStore),

    words() {
      return this.appStore.filteredWordsForCards;
    },

    languageOfCard() {
      return this.$route.params.language;
    },

    languageOfTranslation() {
      return this.languageOfCard === "english" ? "russian" : "english";
    },
  },

  methods: {
    ...mapActions(useAppStore, ["addPicture", "addAssociation"]),

    editAssociation(event, word) {
      this.addAssociation(event.target.value, word.id);
      this.showAssociationEditor = false;
    },
  },

  watch: {
    wordIndex() {
      this.showTranslation = false;
    },

    words(newVal, oldVal) {
      if (newVal.length < oldVal.length) this.showTranslation = false;
    },

    languageOfCard() {
      this.showTranslation = false;
    },
  },
};
</script>

<style scoped>
.picture {
  max-width: 500px;
}

.translation {
  min-height: 140px;
}
</style>
