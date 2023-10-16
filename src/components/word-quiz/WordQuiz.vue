<template>
  <div>
    <loader-component v-if="isLoading" />

    <choose-group v-else-if="!currentGroupId" />

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
              <v-sheet class="px-5 pt-1 pb-5" width="400" outlined rounded>
                <v-sheet
                  min-height="480px"
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
                      v-for="(item, i) in 4"
                      :key="i"
                      outlined
                      class="px-3 py-2 mb-2"
                    >
                      {{ word.englishWord }}
                    </v-card>
                  </div>

                  <v-btn depressed color="cyan" class="mt-4 white--text">
                    Done
                  </v-btn>
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
import { mapStores } from "pinia";
import PlugComponent from "@/components/common/PlugComponent.vue";
import ChooseGroup from "@/components/common/ChooseGroup.vue";
import LoaderComponent from "@/components/common/LoaderComponent.vue";

export default {
  name: "WordList",

  components: {
    PlugComponent,
    ChooseGroup,
    LoaderComponent,
  },

  data() {
    return {
      wordIndex: 0,
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
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    getWordArray(string) {
      return string.split(",");
    },
  },
};
</script>

<style scoped>
.questions {
  cursor: pointer;
}
</style>
