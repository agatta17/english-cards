<template>
  <div>
    <v-chip
      v-for="group in groups"
      :key="group.id"
      @click="setGroup(group.id)"
      class="ma-2"
      :color="currentGroupId === group.id ? 'cyan lighten-3' : 'grey lighten-2'"
    >
      {{ group.name }}
    </v-chip>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";

export default {
  name: "GroupFilter",

  computed: {
    ...mapStores(useAppStore),

    groups() {
      return [...this.appStore.groups, { id: null, name: "All" }];
    },

    currentGroupId() {
      return this.appStore.currentGroupId;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["setGroup"]),
  },
};
</script>
