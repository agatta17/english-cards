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

    isLoading: false,
  }),

  getters: {
    // filteredWordsForList: (state) => {
    //   return state.words.filter(({ done }) => {
    //     const checkDone = () =>
    //       state.currentFilter === "all"
    //         ? true
    //         : state.currentFilter === "done"
    //         ? done
    //         : !done;

    //     return checkDone();
    //   });
    // },

    filteredWordsForCards: (state) => {
      return state.words.filter(({ groupId, done }) => {
        return (
          !done &&
          (state.currentGroupId ? groupId === state.currentGroupId : true)
        );
      });
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

    async getWords(groupId = null) {
      this.words = await apiFetch(`words?group_id=${groupId}`);
    },

    async getGroups() {
      this.isLoading = true;
      this.groups = await apiFetch("groups");
      this.isLoading = false;
    },

    toggleWordLoader() {
      this.wordLoaderOpened = !this.wordLoaderOpened;
    },

    async addWordList(list, groupId) {
      const words = list.map((word) => ({
        englishWord: word.srcText,
        englishExample: word.srcContext,
        russianWord: word.trgText,
        russianExample: word.trgContext,
        association: "",
        groupId: groupId,
        done: false,
        picture: "https://cdn-icons-png.flaticon.com/512/3983/3983886.png",
      }));

      await apiFetch("words", "POST", { words });
    },

    async addNewGroup(name) {
      const id = Date.now();
      await apiFetch("group", "POST", { group: { id, name } });
      return id;
    },

    async generateSetByList(wordList, groupId) {
      await apiFetch("generate-by-list", "POST", { wordList, groupId });
    },

    async setGroup(id) {
      this.isLoading = true;
      this.currentGroupId = Number(id);
      this.words = await apiFetch(`words?group_id=${id}`);
      this.isLoading = false;
    },

    addPicture(src, wordId) {
      const index = this.words.findIndex(({ _id }) => _id === wordId);
      this.words[index].picture = src;
    },

    addAssociation(text, wordId) {
      const index = this.words.findIndex(({ id }) => id === wordId);
      this.words[index].association = text;
    },

    say(text) {
      this.textForSpeech = text;
      this.speechSounds = true;
    },

    toggleDone(wordId) {
      const index = this.words.findIndex(({ id }) => id === wordId);
      this.words[index].done = !this.words[index].done;
    },

    removeWord(wordId) {
      this.words = this.words.filter(({ id }) => id !== wordId);
    },

    setFilter(filter) {
      this.currentFilter = filter;
    },
    saveWordsChanges({ englishWord, russianWord, wordId }) {
      const index = this.words.findIndex(({ id }) => id === wordId);
      this.words[index].englishWord = englishWord;
      this.words[index].russianWord = russianWord;
    },
  },
});
