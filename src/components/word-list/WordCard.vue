<template>
  <v-card class="word-card" flat tile>
    <v-container class="px-0 py-1">
      <v-row no-gutters justify="space-between">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-if="isEditMode"
            v-model="changes.russianWord"
            dense
            hide-details
            color="cyan"
          />
          <div v-else class="blue-grey--text text--darken-3 font-weight-medium">
            {{ word.russianWord }}
          </div>
          <div
            class="blue-grey--text text--darken-1"
            v-html="word.russianExample"
          ></div>
        </v-col>

        <v-col cols="12" sm="6" md="auto" class="d-flex justify-center">
          <v-img max-height="50px" max-width="80px" :src="word.picture" />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-if="isEditMode"
            v-model="changes.englishWord"
            dense
            hide-details
            color="cyan"
          />
          <div v-else>
            <a
              :href="`https://context.reverso.net/перевод/английский-русский/${word.englishWord}`"
              class="blue-grey--text text--darken-3 font-weight-medium text-decoration-none"
              target="_blank"
            >
              {{ word.englishWord }}
            </a>
          </div>
          <div
            class="blue-grey--text text--darken-1"
            v-html="word.englishExample"
          ></div>
        </v-col>

        <v-col cols="12" sm="12" md="auto">
          <word-actions
            @onEdit="toggleEditMode"
            :wordId="word._id"
            :englishWord="word.englishWord"
            :isEditMode="isEditMode"
          />
          <div>
            <v-chip
              small
              class="blue-grey--text text--darken-1 blue-grey lighten-5"
              >{{ groupName }}</v-chip
            >
          </div>
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
          wordId: this.word._id,
        });
      }
    },
  },
};
</script>

<style scoped>
.word-card {
  border-bottom: 1px #cfd8dc solid;
}

.text-decoration-none {
  text-decoration: none;
}
</style>
