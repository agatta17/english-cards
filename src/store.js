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

    async addWordList(list, groupId) {
      this.isLoading = true;
      this.toggleWordLoader();
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

    async generateSetByList(wordList, groupId) {
      this.isLoading = true;
      this.toggleWordLoader();
      await apiFetch("generate-by-list", "POST", { wordList, groupId });
      await this.setGroup(groupId);
      this.isLoading = false;
    },

    async generateSetByTopic(topic, groupId) {
      this.isLoading = true;
      this.toggleWordLoader();
      await apiFetch("generate-by-topic", "POST", { topic, groupId });
      await this.setGroup(groupId);
      this.isLoading = false;
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
      this.isLoading = true;
      try {
        const data = await apiFetch("word", "DELETE", { _id: wordId });
        if (data?.ok)
          this.words = this.words.filter(({ _id }) => _id !== wordId);
      } catch (error) {
        console.log("error >> ", error);
      } finally {
        this.isLoading = false;
      }
    },

    async updateWord(wordId, newData) {
      this.isLoading = true;
      try {
        const data = await apiFetch("word", "PUT", { _id: wordId, newData });
        if (data?.ok) {
          this.words = this.words.map((word) =>
            word._id === wordId ? { ...word, ...newData } : word
          );
        }
      } catch (error) {
        console.log("error >> ", error);
      } finally {
        this.isLoading = false;
      }
    },

    async toggleDone(wordId, done) {
      await this.updateWord(wordId, { done });
    },

    async addPicture(src, wordId) {
      await this.updateWord(wordId, { picture: src });
    },

    async addAssociation(text, wordId) {
      await this.updateWord(wordId, { association: text });
    },

    setFilter(filter) {
      this.currentFilter = filter;
    },
  },
});
