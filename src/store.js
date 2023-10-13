import { defineStore } from "pinia";
import apiFetch from "@/utils/api";

export const useAppStore = defineStore("app", {
  state: () => ({
    wordLoaderOpened: false,

    currentGroupId: null,
    currentFilter: "all",

    speechSounds: false,
    textForSpeech: "",

    words: [],
    groups: [],

    wordIdForEdit: null,
    editFormOpen: false,

    isLoading: false,
    loadingToggleWordId: null,
    loadingRemoveWordId: null,
  }),

  getters: {
    filteredWordsForList: (state) => {
      return state.words.filter(({ done }) => {
        const checkDone = () =>
          state.currentFilter === "all"
            ? true
            : state.currentFilter === "done"
            ? done
            : !done;

        return checkDone();
      });
    },

    filteredWordsForCards: (state) => {
      return state.words.filter(({ done }) => !done);
    },
  },

  actions: {
    async downloadWordList() {
      const data = JSON.stringify({
        words: this.words,
        groups: this.groups,
      });

      const options = {
        suggestedName: "words.json",
        types: [
          {
            description: "Text",
            accept: {
              "text/plain": ".json",
            },
          },
        ],
        excludeAcceptAllOption: true,
      };

      const fileHandle = await window.showSaveFilePicker(options);
      const writableStream = await fileHandle.createWritable(options);
      await writableStream.write(data);

      await writableStream.close();
    },

    async getGroups() {
      this.isLoading = true;
      this.groups = await apiFetch("groups");
      this.isLoading = false;
    },

    toggleWordLoader() {
      this.wordLoaderOpened = !this.wordLoaderOpened;
    },

    async addWord(word, groupId) {
      this.isLoading = true;
      this.toggleWordLoader();

      await apiFetch("word", "POST", {
        word: { ...word, groupId, done: false },
      });
      await this.setGroup(groupId);
      this.isLoading = false;
    },

    async addWordList(list, groupId) {
      this.isLoading = true;
      this.toggleWordLoader();
      const words = list.map((word) => ({
        englishWord: word.srcText,
        englishExample: word.srcContext,
        russianWord:
          word.comment && word.comment !== "..." ? word.comment : word.trgText,
        russianExample: word.trgContext,
        srcSegment: word.srcSegment,
        document: word.document,
        documentTitle: word.documentTitle,
        groupId: groupId,
        done: false,
        picture: "",
        collocates: "",
        comments: "",
        transcription: "",
        partOfSpeech: "",
        definition: "",
        moreExamples: "",
        outcomes: "https://www.eltoutcomes.com/vocabulary",
        oxfordlearnersdictionaries:
          "https://www.oxfordlearnersdictionaries.com/",
        reverso: `https://context.reverso.net/перевод/английский-русский/${word.srcText}`,
        youglish: "https://youglish.com/",
      }));

      await apiFetch("words", "POST", { words });
      await this.setGroup(groupId);
      this.isLoading = false;
    },

    async addNewGroup(name) {
      try {
        const id = Date.now();
        await apiFetch("group", "POST", { group: { id, name } });
        this.groups.push({ id, name });
        return id;
      } catch (error) {
        console.log("error >> ", error);
      }
    },

    async setGroup(id) {
      this.isLoading = true;
      this.currentGroupId = Number(id);
      this.words = await apiFetch(`words?group_id=${id}`);
      this.isLoading = false;
    },

    say(text) {
      this.textForSpeech = text;
      this.speechSounds = true;
    },

    async removeWord(wordId) {
      this.loadingRemoveWordId = wordId;
      try {
        const data = await apiFetch("word", "DELETE", { _id: wordId });
        if (data?.ok)
          this.words = this.words.filter(({ _id }) => _id !== wordId);
      } catch (error) {
        console.log("error >> ", error);
      } finally {
        this.loadingRemoveWordId = null;
      }
    },

    async updateWord(wordId, newData) {
      try {
        const data = await apiFetch("word", "PUT", { _id: wordId, newData });
        if (data?.ok) {
          this.words = this.words.map((word) =>
            word._id === wordId ? { ...word, ...newData } : word
          );
        }
      } catch (error) {
        console.log("error >> ", error);
      }
    },

    async toggleDone(wordId, done) {
      this.loadingToggleWordId = wordId;
      await this.updateWord(wordId, { done });
      this.loadingToggleWordId = null;
    },

    setFilter(filter) {
      this.currentFilter = filter;
    },

    toggleEditForm(wordId, isFormOpen) {
      this.wordIdForEdit = wordId;
      this.editFormOpen = isFormOpen;
    },
  },
});
