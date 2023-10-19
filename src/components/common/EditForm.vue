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
            >
            </v-text-field>
            <v-text-field
              v-model="wordData.transcription"
              label="Transcription"
              outlined
              hide-details
              color="emerald"
              class="mt-4"
            >
              <template v-if="wordData.englishWord" v-slot:append>
                <a :href="dictionaryLink" target="_blank" icon>
                  <v-icon>mdi-magnify</v-icon>
                </a>
              </template>
            </v-text-field>
            <v-text-field
              v-model="wordData.partOfSpeech"
              label="Part of speech"
              outlined
              hide-details
              color="emerald"
              class="mt-4"
            >
              <template v-if="wordData.englishWord" v-slot:append>
                <a :href="dictionaryLink" target="_blank" icon>
                  <v-icon>mdi-magnify</v-icon>
                </a>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" order="1" order-sm="2">
            <div v-if="isImgEditorOpen" class="d-flex">
              <v-textarea
                v-model="wordData.picture"
                label="Picture"
                outlined
                hide-details
                color="emerald"
                height="200px"
              ></v-textarea>
              <div class="d-flex flex-column ml-2">
                <v-btn
                  href="https://dictionary.langeek.co/"
                  target="_blank"
                  color="emerald"
                  depressed
                >
                  <span class="white--text">langeek</span>
                </v-btn>

                <v-btn
                  href="https://quizlet.com/838325350/autosaved"
                  target="_blank"
                  color="emerald"
                  depressed
                  class="mt-2"
                >
                  <span class="white--text">quizlet</span>
                </v-btn>

                <v-btn
                  :href="`https://www.google.com/search?q=${wordData.englishWord}&tbm=isch`"
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
                :src="
                  wordData.picture ||
                  'https://cdn.dribbble.com/users/215249/screenshots/2575539/media/b1f1e90c56a4d81c3783b4fdc25acddf.gif'
                "
                width="auto"
                height="200px"
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
          rows="3"
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a :href="dictionaryLink" target="_blank" icon>
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
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a :href="dictionaryLink" target="_blank" icon>
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
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a :href="dictionaryLink" target="_blank" icon>
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
          rows="3"
        ></v-textarea>
        <v-textarea
          v-model="wordData.russianExample"
          outlined
          name="input-7-4"
          label="Russian example"
          color="emerald"
          hide-details
          class="mt-4"
          rows="3"
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
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a :href="dictionaryLink" target="_blank" icon>
              <v-icon>mdi-magnify</v-icon>
            </a>
          </template>
        </v-textarea>

        <v-text-field
          v-model="wordData.russianWord"
          label="Russian word"
          outlined
          hide-details
          color="emerald"
          class="mt-4"
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a :href="translateLink" target="_blank" icon>
              <v-icon>mdi-magnify</v-icon>
            </a>
          </template>
        </v-text-field>

        <v-text-field
          v-model="wordData.reverso"
          label="Reverso"
          outlined
          hide-details
          color="emerald"
          class="mt-4"
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a
              :href="`https://context.reverso.net/перевод/английский-русский/${wordData.englishWord}`"
              target="_blank"
              icon
            >
              <v-icon>mdi-magnify</v-icon>
            </a>
          </template>
        </v-text-field>

        <v-text-field
          v-model="wordData.youglish"
          label="Youglish"
          outlined
          hide-details
          color="emerald"
          class="mt-4"
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a href="https://youglish.com/" target="_blank" icon>
              <v-icon>mdi-magnify</v-icon>
            </a>
          </template>
        </v-text-field>

        <v-text-field
          v-model="wordData.comments"
          label="Comments"
          outlined
          hide-details
          color="emerald"
          class="mt-4"
        >
        </v-text-field>

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

export default {
  name: "EditForm",

  data: () => ({
    initData: {},
    wordData: {},
    isLoading: false,
    isImgEditorOpen: false,
    dictionaryLink: "https://www.oxfordlearnersdictionaries.com/",
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

    translateLink() {
      return `https://www.lingvolive.com/ru-ru/translate/en-ru/${this.wordData.englishWord}`;
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
