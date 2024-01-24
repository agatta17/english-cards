import { defineStore } from "pinia";
import apiFetch from "@/utils/api";

export const useAppStore = defineStore("app", {
  state: () => ({
    username: null,
    owner: null,

    wordLoaderOpened: false,

    currentGroupId: null,
    currentFilter: "all",

    speechSounds: false,
    textForSpeech: "",

    words: [],
    groups: [],

    wordIdForEdit: null,
    editFormOpen: false,

    appIsLoading: false,
    isLoading: false,
    loadingToggleWordId: null,
    loadingRemoveWordId: null,

    errorText: "",
    isErrorOfGettingWords: false,
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
    async initApp() {
      await this.getGroups();

      const initialGroupId = this.router.currentRoute.query.group;

      if (initialGroupId) {
        this.setGroup(initialGroupId);
      }
    },

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
      try {
        this.appIsLoading = true;
        const { username, groups } = await apiFetch("groups");
        this.username = username;
        this.groups = groups;
      } catch {
        this.errorText = "Error getting groups";
      } finally {
        this.appIsLoading = false;
      }
    },

    toggleWordLoader() {
      this.wordLoaderOpened = !this.wordLoaderOpened;
    },

    async addWord(word, groupId) {
      try {
        this.isLoading = true;

        await apiFetch("word", "POST", {
          word: { ...word, groupId, done: false },
        });

        if (this.currentGroupId === groupId) {
          await this.setGroup(groupId);
        } else {
          this.router.push({ query: { group: groupId } });
        }
      } catch {
        this.errorText = "Error adding word";
      } finally {
        this.isLoading = false;
      }
    },

    async addWordList(text, groupId) {
      try {
        this.isLoading = true;
        this.toggleWordLoader();

        const pairs = text.split("\n");

        const words = pairs.map((pair) => {
          const [englishWord, russianWord] = pair.split(" - ");
          return {
            englishWord,
            russianWord,
            groupId,
            done: false,
          };
        });

        await apiFetch("words", "POST", { words });
        if (this.currentGroupId === groupId) {
          this.setGroup(groupId);
        } else {
          this.router.push({ query: { group: groupId } });
        }
      } catch {
        this.errorText = "Error adding words";
      } finally {
        this.isLoading = false;
      }
    },

    async addNewGroup(name) {
      try {
        const id = Date.now();
        const user = this.username;
        const data = await apiFetch("group", "POST", {
          group: { id, name, user },
        });
        this.groups.push({ id, name, _id: data.insertedId });
        return id;
      } catch {
        this.errorText = "Error adding group";
        throw new Error();
      }
    },

    async setGroup(id) {
      if (typeof id === "undefined") return;

      try {
        this.isErrorOfGettingWords = false;
        this.isLoading = true;

        this.currentGroupId = Number(id);
        const data = await apiFetch(`words?group_id=${id}`);

        this.words = data.words;
        this.owner = data.owner || null;
      } catch (error) {
        this.errorText = error?.message || "Error getting words";
        this.isErrorOfGettingWords = true;
      } finally {
        this.isLoading = false;
      }
    },

    say(text) {
      this.textForSpeech = text;
      this.speechSounds = true;
    },

    async getRandomWordList(count) {
      try {
        this.isLoading = true;
        const data = await apiFetch(`random-words?count=${count}`);
        return data;
      } catch {
        this.errorText = "Error getting quiz data";
        throw new Error("Error getting quiz data");
      } finally {
        this.isLoading = false;
      }
    },

    async removeWord(wordId) {
      this.loadingRemoveWordId = wordId;
      try {
        const data = await apiFetch("word", "DELETE", { _id: wordId });
        if (data?.ok)
          this.words = this.words.filter(({ _id }) => _id !== wordId);
      } catch {
        this.errorText = "Deletion error";
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
      } catch {
        this.errorText = "Update error";
      }
    },

    async toggleDone(wordId, done) {
      try {
        this.loadingToggleWordId = wordId;
        await this.updateWord(wordId, { done });
      } finally {
        this.loadingToggleWordId = null;
      }
    },

    setFilter(filter) {
      this.currentFilter = filter;
    },

    toggleEditForm(wordId, isFormOpen) {
      this.wordIdForEdit = wordId;
      this.editFormOpen = isFormOpen;
    },

    async deleteGroup(id) {
      try {
        const data = await apiFetch("group", "DELETE", { _id: id });
        if (data?.ok) this.groups = this.groups.filter(({ _id }) => _id !== id);
      } catch {
        this.errorText = "Deletion error";
      }
    },

    async changeGroup(id, name) {
      try {
        const data = await apiFetch("group", "PUT", { _id: id, name });
        if (data?.ok) {
          this.groups = this.groups.map((group) =>
            group._id === id ? { ...group, name } : group
          );
        }
      } catch {
        this.errorText = "Update error";
      }
    },

    async register(userData) {
      try {
        const { token } = await apiFetch("register", "POST", userData);
        localStorage.setItem("apikey", token);
      } catch (error) {
        this.errorText = error.message;
        throw error;
      }
    },

    async login(userData) {
      try {
        const { token } = await apiFetch("login", "POST", userData);
        localStorage.setItem("apikey", token);
      } catch (error) {
        this.errorText = error.message;
        throw error;
      }
    },

    setErrorText(text) {
      this.errorText = text;
    },
  },
});
