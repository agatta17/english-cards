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
  }),

  getters: {
    filteredWordsForList: (state) => {
      return state.words.filter(({ groupId, done }) => {
        const checkGroupId = () =>
          state.currentGroupId ? groupId === state.currentGroupId : true;

        const checkDone = () =>
          state.currentFilter === "all"
            ? true
            : state.currentFilter === "done"
            ? done
            : !done;

        return checkGroupId() && checkDone();
      });
    },

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
    async getInit() {
      this.groups = await apiFetch("groups");
      this.words = await apiFetch("words");
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

      await apiFetch("word", "POST", { words });
    },

    async addNewGroup(name) {
      const id = Date.now();
      await apiFetch("group", "POST", { group: { id, name } });
      return id;
    },

    async generateSetByList(wordList, groupId) {
      await apiFetch("ai", "POST", { wordList, groupId });
    },

    setGroup(id) {
      this.currentGroupId = id;
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
