<template>
  <v-card class="word-card" flat tile>
    <div v-if="actionsOpen" @click="actionsOpen = false" class="actions-toggle">
      <word-actions
        @onEdit="toggleEditMode"
        :wordId="word._id"
        :englishWord="word.englishWord"
        :isEditMode="isEditMode"
      />
    </div>

    <v-container class="px-2 py-1 px-md-0 py-md-1 text-body-2 text-sm-body-1">
      <v-row no-gutters justify="space-between">
        <v-col
          v-if="showTranslation || !isMobile"
          @click="showTranslation = false"
          cols="12"
          sm="6"
          md="4"
        >
          <v-text-field
            v-if="isEditMode"
            v-model="changes.russianWord"
            @click="stopPropagation"
            dense
            hide-details
            color="cyan"
            class="mr-16"
          />
          <div v-else class="d-flex justify-space-between">
            <div class="blue-grey--text text--darken-3 font-weight-medium">
              {{ word.russianWord }}
            </div>
            <v-btn
              @click.stop="actionsOpen = !actionsOpen"
              icon
              small
              class="d-sm-none"
            >
              <v-icon color="green">mdi-dots-horizontal</v-icon>
            </v-btn>
          </div>

          <div
            class="blue-grey--text text--darken-1"
            v-html="word.russianExample"
          ></div>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="auto"
          class="d-sm-flex justify-center d-none"
        >
          <v-img max-height="50px" max-width="80px" :src="word.picture" />
        </v-col>

        <v-col
          v-if="!showTranslation || !isMobile"
          @click="showTranslation = true"
          cols="12"
          sm="6"
          md="4"
        >
          <v-text-field
            v-if="isEditMode"
            v-model="changes.englishWord"
            @click="stopPropagation"
            dense
            hide-details
            color="cyan"
            class="mr-16"
          />
          <div v-else class="d-flex justify-space-between">
            <div>
              <a
                :href="`https://context.reverso.net/перевод/английский-русский/${word.englishWord}`"
                class="blue-grey--text text--darken-3 font-weight-medium text-decoration-none"
                target="_blank"
              >
                {{ word.englishWord }}
              </a>
              <v-btn
                @click.stop="say(word.englishWord)"
                icon
                small
                class="d-sm-none"
              >
                <v-icon color="cyan">mdi-bullhorn</v-icon>
              </v-btn>
            </div>
            <v-btn
              @click.stop="actionsOpen = !actionsOpen"
              icon
              small
              class="d-sm-none"
            >
              <v-icon color="green">mdi-dots-horizontal</v-icon>
            </v-btn>
          </div>
          <div
            class="blue-grey--text text--darken-1"
            v-html="word.englishExample"
          ></div>
        </v-col>

        <v-col cols="12" sm="12" md="auto" class="d-sm-block d-none">
          <word-actions
            @onEdit="toggleEditMode"
            :wordId="word._id"
            :englishWord="word.englishWord"
            :isEditMode="isEditMode"
          />
          <div>
            <v-chip
              small
              class="blue-grey--text text--darken-1 blue-grey lighten-5"
              >{{ groupName }}</v-chip
            >
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";
import WordActions from "./WordActions.vue";

export default {
  name: "WordCard",

  components: {
    WordActions,
  },

  props: {
    word: Object,
  },

  data() {
    return {
      isEditMode: false,
      changes: {
        englishWord: "",
        russianWord: "",
      },
      showTranslation: false,
      actionsOpen: false,
    };
  },

  computed: {
    ...mapStores(useAppStore),

    groups() {
      return this.appStore.groups;
    },

    groupName() {
      return this.groups.find(({ id }) => id === this.word.groupId)?.name;
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["updateWord", "say"]),

    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
      if (this.isEditMode) {
        this.changes.englishWord = this.word.englishWord;
        this.changes.russianWord = this.word.russianWord;
      } else {
        this.updateWord(this.word._id, this.changes);
      }
    },

    stopPropagation(event) {
      event.stopPropagation();
    },
  },
};
</script>

<style scoped>
.word-card {
  border-bottom: 1px #cfd8dc solid;
  min-height: 68px;
  position: relative;
}

.actions-toggle {
  position: absolute;
  right: 45px;
  top: 0;
  background: rgb(255, 255, 255, 0.8);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-decoration-none {
  text-decoration: none;
}
</style>
