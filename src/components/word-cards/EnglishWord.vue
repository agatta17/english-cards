<template>
  <div>
    <div>
      <a
        :href="`https://context.reverso.net/перевод/английский-русский/${word}`"
        class="text-h5 text-md-h3 blue-grey--text text--darken-3 text-decoration-none"
        target="_blank"
      >
        {{ word }}
      </a>

      <v-btn v-if="!isMobile" @click="toggleDone(wordId, !done)" icon x-large>
        <v-icon x-large>
          {{ done ? "mdi-close" : "mdi-checkbox-marked-outline" }}
        </v-icon>
      </v-btn>

      <v-btn v-if="!isMobile" @click="say(word)" icon x-large>
        <v-icon x-large>mdi-bullhorn</v-icon>
      </v-btn>
    </div>

    <div
      class="text-h6 blue-grey--text text--darken-1 mt-2"
      v-html="example"
    ></div>
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
      return this.appStore.words.find(({ _id }) => _id === this.wordId).done;
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["say", "toggleDone"]),
  },
};
</script>
<style>
.text-decoration-none {
  text-decoration: none;
}
</style>
