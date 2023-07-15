<template>
  <div>
    <v-navigation-drawer
      v-model="drawerIsOpen"
      app
      color="emerald"
      mobile-breakpoint="600"
      :temporary="isMobile"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6 white--text">
            Groups
          </v-list-item-title>
        </v-list-item-content>
        <tool-bar />
      </v-list-item>

      <v-list dense nav>
        <v-list-item
          v-for="group in groups"
          :key="group.id"
          :to="`${$route.path}?group=${group.id}`"
          class="item"
          exact-active-class="active-item"
        >
          <v-list-item-content>
            <v-list-item-title>{{ group.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";
import ToolBar from "@/components/common/ToolBar.vue";

export default {
  name: "GroupFilter",

  components: {
    ToolBar,
  },

  props: {
    isOpen: {
      type: Boolean,
    },
  },

  computed: {
    ...mapStores(useAppStore),

    groups() {
      return [...this.appStore.groups, { id: 0, name: "All" }];
    },

    group() {
      return this.$route.query.group;
    },

    drawerIsOpen: {
      get() {
        return this.isOpen;
      },
      set(value) {
        this.$emit("update:isOpen", value);
      },
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["setGroup"]),
  },

  watch: {
    group(value) {
      this.setGroup(value);
    },
  },
};
</script>

<style>
.v-list-item--link:before,
.v-list-item--link {
  background-color: #fff;
}
.active-item {
  background: var(--v-sky-base);
  color: #fff !important;
}

.v-navigation-drawer__content::-webkit-scrollbar-track {
  background: #fff;
}

.v-navigation-drawer__content::-webkit-scrollbar {
  width: 5px;
}

.v-navigation-drawer__content::-webkit-scrollbar-thumb {
  background: var(--v-sky-base);
  border-radius: 5px;
}
</style>
