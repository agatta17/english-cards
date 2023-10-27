<template>
  <v-card flat>
    <v-row>
      <v-col cols="12" sm="6" order="2" order-sm="1">
        <v-text-field
          v-model="wordData.englishWord"
          label="English word"
          outlined
          hide-details
          color="emerald"
          clearable
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
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a @click="goTo(dictionaryLink)" icon>
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
          clearable
        >
          <template v-if="wordData.englishWord" v-slot:append>
            <a @click="goTo(dictionaryLink)" icon>
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
            clearable
          ></v-textarea>
          <div class="d-flex flex-column ml-2">
            <template v-if="wordData.englishWord">
              <v-btn
                @click="goTo('https://dictionary.langeek.co/')"
                color="emerald"
                depressed
              >
                <span class="white--text">langeek</span>
              </v-btn>

              <v-btn
                @click="goTo('https://quizlet.com/838325350/autosaved')"
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
            </template>

            <v-btn
              @click="closeImgEditor"
              color="emerald"
              depressed
              :class="{ 'mt-2': wordData.englishWord }"
            >
              <span class="white--text">Preview</span>
            </v-btn>
          </div>
        </div>

        <div v-else class="d-flex justify-center overflow-hidden relative">
          <img :src="wordData.picture" width="auto" height="200px" />
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
      clearable
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
    >
      <template v-if="wordData.englishWord" v-slot:append>
        <a @click="goTo(dictionaryLink)" icon>
          <v-icon>mdi-magnify</v-icon>
        </a>
      </template>
    </v-textarea>

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
    >
      <template v-if="wordData.englishWord" v-slot:append>
        <a @click="goTo(dictionaryLink)" icon>
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
      clearable
    >
      <template v-if="wordData.englishWord" v-slot:append>
        <a @click="goTo(translateLink)" icon>
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
      clearable
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
      clearable
    >
      <template v-if="wordData.englishWord" v-slot:append>
        <a @click="goTo('https://youglish.com/')" icon>
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
      clearable
    >
    </v-text-field>

    <div class="d-flex align-center mt-4">
      <v-text-field
        v-if="showGroupInput"
        v-model="newGroupName"
        label="Group"
        outlined
        hide-details
        color="emerald"
        clearable
      >
      </v-text-field>

      <v-select
        v-else
        v-model="groupId"
        :items="groups"
        item-value="id"
        item-text="name"
        label="Group"
        outlined
        hide-details
        color="emerald"
      >
      </v-select>

      <v-btn @click="showGroupInput = !showGroupInput" icon class="ml-2">
        <v-icon color="emerald" large>
          {{ showGroupInput ? "mdi-close" : "mdi-plus" }}
        </v-icon>
      </v-btn>
    </div>

    <v-card-actions class="px-0">
      <v-spacer></v-spacer>
      <v-btn @click="toggleWordLoader" color="emerald" text> Cancel </v-btn>

      <v-btn @click="onSave" color="emerald" depressed>
        <span class="white--text">Save</span>
      </v-btn>

      <v-btn
        @click="onSaveAndAdd"
        color="emerald"
        depressed
        :loading="isLoading"
      >
        <span class="white--text">Save and add more</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";

export default {
  name: "CreateCardForm",

  data: () => ({
    isImgEditorOpen: true,
    wordData: {},
    groupId: null,
    showGroupInput: false,
    newGroupName: "",
    isLoading: false,
    dictionaryLink: "https://www.oxfordlearnersdictionaries.com/",
  }),

  computed: {
    ...mapStores(useAppStore),

    groups() {
      return this.appStore.groups;
    },

    currentGroupId() {
      return this.appStore.currentGroupId;
    },

    wordLoaderOpened() {
      return this.appStore.wordLoaderOpened;
    },

    translateLink() {
      return `https://www.lingvolive.com/ru-ru/translate/en-ru/${this.wordData.englishWord}`;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["toggleWordLoader", "addWord", "addNewGroup"]),

    openImgEditor() {
      this.isImgEditorOpen = true;
    },

    closeImgEditor() {
      this.isImgEditorOpen = false;
    },

    onSave() {
      this.toggleWordLoader();
      this.save();
    },

    async onSaveAndAdd() {
      try {
        this.isLoading = true;
        await this.save();
        this.clearData();
      } catch (error) {
        console.log("error >> ", error);
      } finally {
        this.isLoading = false;
      }
    },

    async save() {
      try {
        if (this.showGroupInput)
          this.groupId = await this.addNewGroup(this.newGroupName);

        await this.addWord(this.wordData, this.groupId);
      } catch {
        return;
      }
    },

    clearData() {
      this.isImgEditorOpen = true;
      this.wordData = {};
      this.showGroupInput = false;
      this.newGroupName = "";
    },

    initData() {
      this.groupId = this.currentGroupId;
      this.clearData();
    },

    goTo(link) {
      navigator.clipboard
        .writeText(this.wordData.englishWord)
        .then(() => window.open(link, "_blank"));
    },
  },

  watch: {
    wordLoaderOpened: {
      handler(val) {
        if (val) this.initData();
      },

      immediate: true,
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
