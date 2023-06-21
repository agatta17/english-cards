<template>
  <div>
    <div class="text-h5 text-md-h3 blue-grey--text text--darken-3">
      {{ word }}

      <v-btn @click="toggleDone(wordId)" icon x-large>
        <v-icon :color="done ? 'amber darken-4' : 'green darken-1'" x-large>
          {{ done ? "mdi-close" : "mdi-check" }}
        </v-icon>
      </v-btn>

      <v-btn @click="say(word)" icon x-large>
        <v-icon color="cyan" x-large>mdi-bullhorn</v-icon>
      </v-btn>
    </div>

    <div class="text-h6 blue-grey--text text--darken-1" v-html="example"></div>
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
