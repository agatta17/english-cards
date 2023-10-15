<template>
  <div>
    <v-btn @click="toggleDone(wordId, !done)" icon>
      <v-icon :color="done ? 'cherry darken-1' : 'emerald'">
        {{
          done
            ? `mdi-clock-outline ${isSpinToggle}`
            : `mdi-checkbox-marked-outline ${isSpinToggle}`
        }}
      </v-icon>
    </v-btn>

    <v-btn @click="removeWord(wordId)" icon>
      <v-icon color="terracotta ">
        {{ `mdi-delete-outline ${isSpinRemove}` }}
      </v-icon>
    </v-btn>

    <v-btn @click="toggleEditForm(wordId, true)" icon>
      <v-icon color="sky"> mdi-pencil </v-icon>
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
  },

  computed: {
    ...mapStores(useAppStore),

    done() {
      return this.appStore.words.find(({ _id }) => _id === this.wordId).done;
    },

    isSpinToggle() {
      return this.appStore.loadingToggleWordId === this.wordId
        ? "mdi-spin"
        : "";
    },

    isSpinRemove() {
      return this.appStore.loadingRemoveWordId === this.wordId
        ? "mdi-spin"
        : "";
    },
  },

  methods: {
    ...mapActions(useAppStore, ["toggleDone", "removeWord", "toggleEditForm"]),
  },
};
</script>
