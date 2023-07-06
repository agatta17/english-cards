<template>
  <div v-if="!isMobile">
    <v-app-bar color="terracotta" dense class="d-flex justify-center">
      <v-btn to="/" text color="white" class="mr-5"> Список </v-btn>

      <v-btn text to="/cards/english" color="white" class="mr-5"
        >Английские карточки</v-btn
      >

      <v-btn text to="/cards/russian" color="white" class="mr-5"
        >Русские карточки</v-btn
      >

      <v-btn @click="downloadWordList" class="mr-5">Скачать слова</v-btn>

      <v-btn @click="toggleWordLoader">Загрузить слова</v-btn>
    </v-app-bar>
  </div>

  <div v-else>
    <v-app-bar color="terracotta" dense class="d-flex justify-end">
      <tool-bar />
      <v-btn @click="toggleDrawer" icon>
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawerOpen" app>
      <v-list>
        <v-list-item to="/" link>
          <v-list-item-icon>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Список</v-list-item-title>
        </v-list-item>

        <v-list-item to="/cards/english" link>
          <v-list-item-icon>
            <v-icon>mdi-cards-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Английские карточки</v-list-item-title>
        </v-list-item>

        <v-list-item to="/cards/russian" link>
          <v-list-item-icon>
            <v-icon>mdi-cards-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Русские карточки</v-list-item-title>
        </v-list-item>

        <v-list-item @click="downloadWordList">
          <v-list-item-icon>
            <v-icon>mdi-download</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Скачать слова</v-list-item-title>
        </v-list-item>

        <v-list-item @click="toggleWordLoader">
          <v-list-item-icon>
            <v-icon>mdi-upload</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Загрузить слова</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { useAppStore } from "@/store";
import { mapActions } from "pinia";
import ToolBar from "@/components/common/ToolBar.vue";

export default {
  name: "AppNavigation",

  components: {
    ToolBar,
  },

  data() {
    return {
      drawerOpen: false,
    };
  },

  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["toggleWordLoader", "downloadWordList"]),

    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },
  },
};
</script>

<style scoped>
.v-application--wrap .mdi-menu {
  font-size: 24px;
}
</style>
