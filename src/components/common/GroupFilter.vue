<template>
  <div class="group-filter">
    <v-chip
      v-for="group in groups"
      :key="group.id"
      @click="onSetGroup(group.id)"
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

    onSetGroup(id) {
      this.setGroup(id);
      this.$router.push({
        path: this.$router.currentRoute.path,
        query: { group: this.currentGroupId },
      });
    },
  },
};
</script>

<style>
.group-filter {
  white-space: nowrap;
  overflow-x: auto;
}

.group-filter::-webkit-scrollbar {
  height: 4px;
}

.group-filter::-webkit-scrollbar-thumb {
  background: #00acc1;
  border-radius: 10px;
}
</style>
