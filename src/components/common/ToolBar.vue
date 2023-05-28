<template>
  <div class="toolbar">
    <v-btn @click="setFilter('done')" icon :disabled="currentFilter === 'done'">
      <v-icon color="green darken-1" large>mdi-check</v-icon>
    </v-btn>

    <v-btn
      @click="setFilter('process')"
      icon
      :disabled="currentFilter === 'process'"
    >
      <v-icon color="amber darken-4" large>mdi-close</v-icon>
    </v-btn>

    <v-btn @click="setFilter('all')" icon :disabled="currentFilter === 'all'">
      all
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
    ...mapActions(useAppStore, ["setFilter"]),
  },
};
</script>

<style>
.toolbar {
  white-space: nowrap;
}
</style>
