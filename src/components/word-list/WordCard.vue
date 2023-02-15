<template>
  <v-card class="mb-4" outlined>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-if="isEditMode"
            v-model="changes.russianWord"
            dense
            hide-details
          />
          <div v-else class="text-h6 primary--text">
            {{ word.russianWord }}
          </div>
          <div v-html="word.russianExample"></div>
        </v-col>

        <v-col cols="2" class="d-flex justify-center">
          <img class="picture" height="100px" :src="word.picture" />
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-if="isEditMode"
            v-model="changes.englishWord"
            dense
            hide-details
          />
          <div v-else class="text-h6 primary--text">{{ word.englishWord }}</div>
          <div v-html="word.englishExample"></div>
        </v-col>

        <v-col cols="2">
          <word-actions
            @onEdit="toggleEditMode"
            :wordId="word.id"
            :englishWord="word.englishWord"
            :isEditMode="isEditMode"
          />
          <div>
            <v-chip small>{{ groupName }}</v-chip>
          </div>
          <div>{{ word.association }}</div>
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
      isEditMode: false,
      changes: {
        englishWord: "",
        russianWord: "",
      },
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
  },

  methods: {
    ...mapActions(useAppStore, ["saveWordsChanges"]),

    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
      if (this.isEditMode) {
        this.changes.englishWord = this.word.englishWord;
        this.changes.russianWord = this.word.russianWord;
      } else {
        this.saveWordsChanges({
          englishWord: this.changes.englishWord,
          russianWord: this.changes.russianWord,
          wordId: this.word.id,
        });
      }
    },
  },
};
</script>

<style scoped>
.picture {
  max-width: 160px;
}
</style>
