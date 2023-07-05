<template>
  <div>
    <v-btn @click="say(englishWord)" icon class="d-sm-inline-flex d-none">
      <v-icon color="peach ">mdi-bullhorn-outline</v-icon>
    </v-btn>

    <v-btn @click="toggleDone(wordId, !done)" icon>
      <v-icon :color="done ? 'cherry darken-1' : 'emerald '">
        {{ done ? "mdi-clock-outline" : "mdi-checkbox-marked-outline" }}
      </v-icon>
    </v-btn>

    <v-btn @click="removeWord(wordId)" icon>
      <v-icon color="terracotta ">mdi-delete-outline</v-icon>
    </v-btn>

    <v-btn @click="$emit('onEdit')" icon>
      <v-icon color="sky">
        {{ isEditMode ? "mdi-content-save" : "mdi-pencil" }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { mapActions, mapStores } from "pinia";

export default {
  name: "WordActions",

  props: {
    englishWord: { type: String, default: "" },
    wordId: { type: String, require: true },
    isEditMode: { type: Boolean, default: false },
  },

  computed: {
    ...mapStores(useAppStore),

    done() {
      return this.appStore.words.find(({ _id }) => _id === this.wordId).done;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["say", "toggleDone", "removeWord"]),
  },
};
</script>
