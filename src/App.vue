<template>
  <div id="app">
    <loader-component v-if="appIsLoading" />

    <v-app v-else>
      <group-filter v-if="username" :is-open.sync="groupFilterIsOpen" />

      <v-main>
        <app-navigation :group-filter-is-open.sync="groupFilterIsOpen" />

        <error-component v-if="isErrorOfGettingWords" />
        <router-view v-else> </router-view>

        <word-loader />

        <edit-form />
      </v-main>

      <v-snackbar v-model="errorIsOpen" right top color="terracotta">
        {{ errorText }}

        <template v-slot:action="{ attrs }">
          <v-btn @click="errorIsOpen = false" text v-bind="attrs">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-app>

    <speech v-model="play" />
  </div>
</template>

<script>
import GroupFilter from "@/components/common/GroupFilter.vue";
import AppNavigation from "@/components/common/AppNavigation.vue";
import WordLoader from "@/components/common/WordLoader.vue";
import EditForm from "@/components/common/EditForm.vue";
import Speech from "@/components/common/SpeechComponent.vue";
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";
import ErrorComponent from "@/components/common/ErrorComponent.vue";
import LoaderComponent from "@/components/common/LoaderComponent.vue";

export default {
  name: "App",

  components: {
    GroupFilter,
    AppNavigation,
    WordLoader,
    EditForm,
    Speech,
    ErrorComponent,
    LoaderComponent,
  },

  data() {
    return {
      groupFilterIsOpen: false,
      errorTimeout: 4000,
    };
  },

  computed: {
    ...mapStores(useAppStore),

    appIsLoading() {
      return this.appStore.appIsLoading;
    },

    play: {
      get() {
        return this.appStore.speechSounds;
      },
      set(newVal) {
        this.appStore.speechSounds = newVal;
      },
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    errorText() {
      return this.appStore.errorText;
    },

    isErrorOfGettingWords() {
      return this.appStore.isErrorOfGettingWords;
    },

    username() {
      return this.appStore.username;
    },

    errorIsOpen: {
      get() {
        return this.appStore.errorText ? true : false;
      },
      set(newVal) {
        if (!newVal) this.appStore.errorText = "";
      },
    },
  },

  methods: {
    ...mapActions(useAppStore, ["initApp"]),
  },

  async mounted() {
    this.groupFilterIsOpen = this.isMobile ? false : true;

    await this.initApp();

    const initialGroupId = this.$router.currentRoute.query.group;

    if (!this.username && !initialGroupId) this.$router.push("/login");
  },
};
</script>

<style>
em {
  background: var(--v-error-lighten5);
}

.relative {
  position: relative;
}

.russian-word {
  background: #e3f2fd;
  border: solid 1px #78909c;
  border-radius: 4px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 6px;
}

@media (max-width: 600px) {
  .container {
    padding: 0 !important;
  }
}

.wrap {
  min-height: 100%;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.15s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(160px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-160px);
}
</style>
