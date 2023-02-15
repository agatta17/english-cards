<template>
  <div>
    <div class="text-h2">
      {{ word }}

      <v-btn @click="toggleDone(wordId)" icon x-large>
        <v-icon :color="done ? 'red' : 'green'" x-large>
          {{ done ? "mdi-close" : "mdi-check" }}
        </v-icon>
      </v-btn>

      <v-btn @click="say(word)" icon x-large>
        <v-icon color="primary" x-large>mdi-bullhorn</v-icon>
      </v-btn>
    </div>

    <div class="text-h6" v-html="example"></div>
  </div>
</template>

<script>
import { mapActions, mapStores } from "pinia";
import { useAppStore } from "@/store";

export default {
  name: "EnglishWord",

  props: {
    word: {
      type: String,
      require: true,
    },

    example: {
      type: String,
      require: true,
    },

    wordId: {
      type: Number,
      require: true,
    },
  },

  computed: {
    ...mapStores(useAppStore),

    done() {
      return this.appStore.words.find(({ id }) => id === this.wordId).done;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["say", "toggleDone"]),
  },
};
</script>
