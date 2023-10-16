<template>
  <v-card class="word-card" flat tile>
    <div v-if="actionsOpen" class="actions-toggle">
      <word-actions :wordId="word._id" :englishWord="word.englishWord" />
    </div>

    <v-container class="px-2 py-1 px-md-0 py-md-1 text-body-2 text-sm-body-1">
      <v-row no-gutters justify="space-between">
        <v-col
          v-if="!showTranslation || !isMobile"
          @click="showTranslation = true"
          cols="12"
          sm="6"
          md="4"
        >
          <div class="d-flex justify-space-between">
            <div>
              <a
                :href="`https://context.reverso.net/перевод/английский-русский/${word.englishWord}`"
                class="blue-grey--text text--darken-3 font-weight-medium text-decoration-none"
                target="_blank"
              >
                {{ word.englishWord }}
              </a>
              <v-btn @click.stop="say(word.englishWord)" icon small>
                <v-icon color="peach" class="mb-1">mdi-bullhorn</v-icon>
              </v-btn>
            </div>
            <v-btn
              @click.stop="actionsOpen = !actionsOpen"
              icon
              small
              class="d-sm-none"
            >
              <v-icon color="emerald">mdi-dots-horizontal</v-icon>
            </v-btn>
          </div>
          <div
            class="blue-grey--text text--darken-1"
            v-html="
              word.srcSegment?.replace(
                word.englishWord,
                `<em>${word.englishWord}</em>`
              ) || word.englishExample
            "
          ></div>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="auto"
          class="d-sm-flex justify-center d-none"
        >
          <v-card width="80px" height="50px" flat color="blue-grey lighten-5">
            <v-img
              v-if="
                word.picture &&
                word.picture !==
                  'https://cdn-icons-png.flaticon.com/512/3983/3983886.png'
              "
              max-height="50px"
              max-width="80px"
              :src="word.picture"
              :lazy-src="word.picture"
            >
            </v-img>
          </v-card>
        </v-col>

        <v-col
          v-if="showTranslation || !isMobile"
          @click="showTranslation = false"
          cols="12"
          sm="6"
          md="5"
        >
          <div class="d-flex justify-space-between">
            <div>
              <div
                class="blue-grey--text text--darken-1 body-2"
                v-html="word.definition"
              ></div>
              <div v-if="word.russianWord" class="d-flex flex-wrap">
                <span
                  v-for="word in getWordArray(word.russianWord)"
                  :key="word"
                  class="russian-word body-2 mr-1 mt-1"
                >
                  {{ word }}
                </span>
              </div>
            </div>

            <v-btn
              @click.stop="actionsOpen = !actionsOpen"
              icon
              small
              class="d-sm-none"
            >
              <v-icon color="emerald">mdi-dots-horizontal</v-icon>
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" sm="12" md="auto" class="d-sm-block d-none">
          <word-actions :wordId="word._id" :englishWord="word.englishWord" />
          <div>
            <v-chip
              small
              class="blue-grey--text text--darken-2 amber lighten-4"
            >
              {{ groupName }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";
import WordActions from "./WordActions.vue";

export default {
  name: "WordCard",

  components: {
    WordActions,
  },

  props: {
    word: Object,
  },

  data() {
    return {
      showTranslation: false,
      actionsOpen: false,
    };
  },

  computed: {
    ...mapStores(useAppStore),

    groups() {
      return this.appStore.groups;
    },

    groupName() {
      return this.groups.find(({ id }) => id === this.word.groupId)?.name;
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["say"]),

    stopPropagation(event) {
      event.stopPropagation();
    },

    getWordArray(string) {
      return string.split(",");
    },
  },
};
</script>

<style scoped>
.word-card {
  border-bottom: 1px #cfd8dc solid;
  min-height: 68px;
  position: relative;
}

.actions-toggle {
  position: absolute;
  right: 45px;
  top: 0;
  background: rgb(255, 255, 255, 0.8);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-decoration-none {
  text-decoration: none;
}

.russian-word {
  background: #e3f2fd;
  border: solid 1px #78909c;
  border-radius: 4px;
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 2px;
  padding-bottom: 4px;
}
</style>
