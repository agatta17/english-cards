<template>
  <v-dialog v-model="formOpened" width="700" :fullscreen="isMobile">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Word settings
      </v-card-title>

      <v-card-text v-if="wordData" class="pt-4">
        <v-row>
          <v-col cols="12" sm="6" order="2" order-sm="1">
            <v-text-field
              v-model="wordData.englishWord"
              label="English word"
              outlined
              hide-details
              color="emerald"
              clearable
              dense
            >
            </v-text-field>
            <v-text-field
              v-model="wordData.transcription"
              label="Transcription"
              outlined
              hide-details
              color="emerald"
              class="mt-4"
              clearable
              dense
            >
              <template v-if="wordData.englishWord" v-slot:append>
                <a @click="goTo(dictionaryLink)" icon>
                  <v-icon>mdi-magnify</v-icon>
                </a>
              </template>
            </v-text-field>

            <v-select
              v-model="wordData.partOfSpeech"
              :items="partOfSpeechList"
              label="Part of speech"
              outlined
              hide-details
              color="emerald"
              dense
              class="mt-4"
            >
            </v-select>
          </v-col>
          <v-col cols="12" sm="6" order="1" order-sm="2">
            <div v-if="isImgEditorOpen" class="d-flex">
              <v-textarea
                v-model="wordData.picture"
                label="Picture"
                outlined
                hide-details
                color="emerald"
                height="150px"
                clearable
                dense
              ></v-textarea>
              <div class="d-flex flex-column ml-2">
                <v-btn @click="goTo(langeekLink)" color="emerald" depressed>
                  <span class="white--text">langeek</span>
                </v-btn>

                <v-btn
                  @click="goTo(quizletLink)"
                  color="emerald"
                  depressed
                  class="mt-2"
                >
                  <span class="white--text">quizlet</span>
                </v-btn>

                <v-btn
                  :href="googleLink"
                  target="_blank"
                  color="emerald"
                  depressed
                  class="mt-2"
                >
                  <span class="white--text">google</span>
                </v-btn>

                <v-btn
                  @click="closeImgEditor"
                  color="emerald"
                  depressed
                  class="mt-2"
                >
                  <span class="white--text">Preview</span>
                </v-btn>
              </div>
            </div>

            <div v-else class="d-flex justify-center overflow-hidden relative">
              <img
                :src="wordData.picture || imgStubLink"
                width="auto"
                height="150px"
              />
              <v-btn
                @click="openImgEditor"
                color="white"
                depressed
                absolute
                class="img-btn"
              >
                <v-icon color="sky"> mdi-pencil </v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-textarea
          v-model="wordData.definition"
          label="Definition"
          outlined
          hide-details
          color="emerald"
          class="mt-4"
          rows="2"
          clearable
          dense
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a @click="goTo(dictionaryLink)" icon>
              <v-icon>mdi-magnify</v-icon>
            </a>
          </template>
        </v-textarea>
        <v-text-field
          v-model="wordData.srcSegment"
          label="Context"
          outlined
          hide-details
          color="emerald"
          class="mt-4"
          clearable
          dense
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a @click="goTo(dictionaryLink)" icon>
              <v-icon>mdi-magnify</v-icon>
            </a>
          </template>
        </v-text-field>
        <v-textarea
          v-model="wordData.collocates"
          outlined
          name="input-7-4"
          label="Collocates"
          color="emerald"
          hide-details
          class="mt-4"
          rows="3"
          clearable
          dense
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a @click="goTo(dictionaryLink)" icon>
              <v-icon>mdi-magnify</v-icon>
            </a>
          </template>
        </v-textarea>

        <v-textarea
          v-model="wordData.englishExample"
          outlined
          name="input-7-4"
          label="English example"
          color="emerald"
          hide-details
          class="mt-4"
          rows="2"
          clearable
          dense
        ></v-textarea>
        <v-textarea
          v-model="wordData.russianExample"
          outlined
          name="input-7-4"
          label="Russian example"
          color="emerald"
          hide-details
          class="mt-4"
          rows="2"
          clearable
          dense
        ></v-textarea>
        <v-textarea
          v-model="wordData.moreExamples"
          outlined
          name="input-7-4"
          label="Extra Examples"
          color="emerald"
          hide-details
          class="mt-4"
          rows="3"
          clearable
          dense
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a @click="goTo(dictionaryLink)" icon>
              <v-icon>mdi-magnify</v-icon>
            </a>
          </template>
        </v-textarea>

        <v-text-field
          v-model="wordData.russianWord"
          label="Translation"
          outlined
          hide-details
          color="emerald"
          class="mt-4"
          clearable
          dense
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a @click="goTo(translateLink)" icon>
              <v-icon>mdi-magnify</v-icon>
            </a>
          </template>
        </v-text-field>

        <v-textarea
          v-model="wordData.comments"
          label="Comments"
          outlined
          hide-details
          color="emerald"
          class="mt-4"
          clearable
          rows="3"
          dense
        >
        </v-textarea>

        <v-select
          v-model="wordData.groupId"
          :items="groups"
          item-value="id"
          item-text="name"
          label="Group"
          outlined
          hide-details
          color="emerald"
          class="mt-4"
          dense
        >
        </v-select>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="toggleEditForm(null, false)" color="emerald" text>
          Отменить
        </v-btn>

        <v-btn @click="onChange" color="emerald" depressed :loading="isLoading">
          <span class="white--text">Save</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";
import {
  PART_OF_SPEECH_LIST,
  DICTIONARY_LINK,
  LANGEEK_LINK,
  QUIZLET_LINK,
  GOOGLE_LINK,
  TRANSLATE_LINK,
  IMG_STUB_LINK,
} from "@/constants";

export default {
  name: "EditForm",

  data: () => ({
    initData: {},
    wordData: {},
    isLoading: false,
    isImgEditorOpen: false,
    dictionaryLink: DICTIONARY_LINK,
    partOfSpeechList: PART_OF_SPEECH_LIST,
    langeekLink: LANGEEK_LINK,
    quizletLink: QUIZLET_LINK,
    imgStubLink: IMG_STUB_LINK,
  }),

  computed: {
    ...mapStores(useAppStore),

    groups() {
      return this.appStore.groups;
    },

    word() {
      return this.appStore.words.find(
        ({ _id }) => _id === this.appStore.wordIdForEdit
      );
    },

    wordIdForEdit() {
      return this.appStore.wordIdForEdit;
    },

    formOpened: {
      get: function () {
        return this.appStore.editFormOpen;
      },

      set: function (value) {
        this.appStore.editFormOpen = value;
      },
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    googleLink() {
      return GOOGLE_LINK(this.wordData.englishWord);
    },

    translateLink() {
      return TRANSLATE_LINK(this.wordData.englishWord);
    },
  },

  methods: {
    ...mapActions(useAppStore, ["toggleEditForm", "updateWord"]),

    async onChange() {
      if (JSON.stringify(this.initData) === JSON.stringify(this.wordData)) {
        this.toggleEditForm(null, false);
        return;
      }

      try {
        this.isLoading = true;
        await this.updateWord(this.wordIdForEdit, this.wordData);
        this.toggleEditForm(null, false);
      } catch (error) {
        console.log("error >> ", error);
      } finally {
        this.isLoading = false;
      }
    },

    openImgEditor() {
      this.isImgEditorOpen = true;
    },

    closeImgEditor() {
      this.isImgEditorOpen = false;
    },

    goTo(link) {
      navigator.clipboard
        .writeText(this.wordData.englishWord)
        .then(() => window.open(link, "_blank"));
    },
  },

  watch: {
    wordIdForEdit() {
      this.isImgEditorOpen = false;

      this.wordData = { ...this.word };
      delete this.wordData._id;
      this.initData = { ...this.wordData };
    },
  },
};
</script>

<style scoped>
.relative {
  position: relative;
}

.img-btn {
  width: 35px !important;
  height: 35px !important;
  min-width: auto !important;
  border-radius: 50%;
  right: 20px;
  top: 16px;
}
</style>
