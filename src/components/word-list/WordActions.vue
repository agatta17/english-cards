<template>
  <div>
    <v-btn @click="say(englishWord)" icon>
      <v-icon color="cyan">mdi-bullhorn</v-icon>
    </v-btn>

    <v-btn @click="toggleDone(wordId)" icon>
      <v-icon :color="done ? 'amber darken-4' : 'green darken-1'">
        {{ done ? "mdi-close" : "mdi-check" }}
      </v-icon>
    </v-btn>

    <v-btn @click="removeWord(wordId)" icon>
      <v-icon color="red lighten-2">mdi-delete-outline</v-icon>
    </v-btn>

    <v-btn @click="$emit('onEdit')" icon>
      <v-icon>
        {{ isEditMode ? "mdi-check" : "mdi-pencil" }}
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
    wordId: { type: Number, require: true },
    isEditMode: { type: Boolean, default: false },
  },

  computed: {
    ...mapStores(useAppStore),

    done() {
      return this.appStore.words.find(({ id }) => id === this.wordId).done;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["say", "toggleDone", "removeWord"]),
  },
};
</script>
