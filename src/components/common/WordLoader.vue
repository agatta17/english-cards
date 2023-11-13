<template>
  <div class="text-center">
    <v-dialog v-model="wordLoaderOpened" width="1100" :fullscreen="isMobile">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Create new cards
        </v-card-title>

        <v-card-text class="pt-4 px-4">
          <v-tabs v-model="tab">
            <v-tab v-for="mode in modeTypes" :key="mode.id">
              <div>{{ mode.name }}</div>
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="mode in modeTypes" :key="mode.id">
              <component :is="mode.component" class="mt-4" />
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";

export default {
  name: "WordLoader",

  data: () => ({
    tab: null,

    modeTypes: [
      {
        id: "createCard",
        name: "Create card",
        component: () => import("./CreateCardForm.vue"),
      },
      {
        id: "addFromReverso",
        name: "Add from Reverso",
        component: () => import("./AddFromReversoForm.vue"),
      },
    ],
  }),

  computed: {
    ...mapStores(useAppStore),

    wordLoaderOpened: {
      get: function () {
        return this.appStore.wordLoaderOpened;
      },

      set: function () {
        this.toggleWordLoader();
      },
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["toggleWordLoader"]),
  },
};
</script>
