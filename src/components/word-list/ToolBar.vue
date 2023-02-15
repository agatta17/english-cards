<template>
  <div>
    <v-btn @click="setFilter('done')" icon :disabled="currentFilter === 'done'">
      <v-icon color="green" large>mdi-check</v-icon>
    </v-btn>

    <v-btn
      @click="setFilter('process')"
      icon
      :disabled="currentFilter === 'process'"
    >
      <v-icon color="red" large>mdi-close</v-icon>
    </v-btn>

    <v-btn @click="setFilter('all')" icon :disabled="currentFilter === 'all'">
      all
    </v-btn>

    <!-- <v-btn icon>
      <v-icon color="orange" large>mdi-plus</v-icon>
    </v-btn> -->

    <v-btn @click="toggleWordLoader" icon>
      <v-icon color="info" large>mdi-upload</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { mapActions, mapStores } from "pinia";
// import { mapStores, mapActions } from "pinia";

export default {
  name: "ToolBar",

  computed: {
    ...mapStores(useAppStore),

    currentFilter() {
      return this.appStore.currentFilter;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["toggleWordLoader", "setFilter"]),
  },
};
</script>
