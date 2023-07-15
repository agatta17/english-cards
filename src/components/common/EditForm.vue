<template>
  <v-dialog v-model="formOpened" width="700">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Word settings
      </v-card-title>

      <v-card-text v-if="wordData" class="pt-4">
        <v-text-field
          v-model="wordData.englishWord"
          label="English word"
          outlined
          hide-details
          color="emerald"
        >
        </v-text-field>
        <v-text-field
          v-model="wordData.russianWord"
          label="Russian word"
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
        <v-text-field
          v-model="wordData.picture"
          label="Picture"
          outlined
          hide-details
          color="emerald"
          class="mt-4"
        ></v-text-field>
        <v-text-field
          v-model="wordData.association"
          label="Association"
          outlined
          hide-details
          color="emerald"
          class="mt-4"
        >
        </v-text-field>
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
  },

  watch: {
    wordIdForEdit() {
      this.wordData = { ...this.word };
      delete this.wordData._id;
      this.initData = { ...this.wordData };
    },
  },
};
</script>
