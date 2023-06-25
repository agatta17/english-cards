<template>
  <div class="text-center">
    <v-dialog v-model="wordLoaderOpened" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Загрузить слова
        </v-card-title>

        <v-card-text class="pt-4">
          <v-select
            v-model="modeId"
            :items="modeTypes"
            item-value="id"
            item-text="name"
            label="Mode"
            outlined
            hide-details
            color="cyan"
          >
          </v-select>

          <div class="d-flex align-center mt-4">
            <v-text-field
              v-if="showGroupInput"
              v-model="newGroupName"
              label="Group"
              outlined
              hide-details
              color="cyan"
            >
            </v-text-field>

            <v-select
              v-else
              v-model="groupId"
              :items="groups"
              item-value="id"
              item-text="name"
              label="Group"
              outlined
              hide-details
              color="cyan"
            >
            </v-select>

            <v-btn @click="showGroupInput = !showGroupInput" icon class="ml-2">
              <v-icon color="cyan" large>
                {{ showGroupInput ? "mdi-close" : "mdi-plus" }}
              </v-icon>
            </v-btn>
          </div>

          <v-textarea
            v-model="inputData"
            outlined
            name="input-7-4"
            :label="
              modeId === 'generateByList'
                ? 'Word list'
                : modeId === 'generateByTopic'
                ? 'Topic'
                : 'Json'
            "
            color="cyan"
            hide-details
            class="mt-4"
          ></v-textarea>

          <div v-if="modeId === 'addFromReverso'" class="mt-1">
            <a
              href="https://context.reverso.net/bst-web-user/user/favourites/shared?userName=adephimova&start=0&length=2000&order=10"
              target="_blank"
              class="grey--text"
            >
              Get Reverso data
            </a>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="toggleWordLoader" color="cyan" text> Отменить </v-btn>

          <v-btn @click="onAdd" color="cyan" depressed>
            <span class="white--text">Добавить</span>
          </v-btn>
        </v-card-actions>
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
    inputData: "",
    groupId: null,
    showGroupInput: false,
    newGroupName: "",
    modeId: "generateByList",
    modeTypes: [
      {
        id: "generateByList",
        name: "Generate by list",
      },
      {
        id: "generateByTopic",
        name: "Generate by topic",
      },
      {
        id: "addFromReverso",
        name: "Add from Reverso",
      },
    ],
  }),

  computed: {
    ...mapStores(useAppStore),

    groups() {
      return this.appStore.groups;
    },

    wordLoaderOpened: {
      get: function () {
        return this.appStore.wordLoaderOpened;
      },

      set: function () {
        this.toggleWordLoader();
      },
    },
  },

  methods: {
    ...mapActions(useAppStore, [
      "toggleWordLoader",
      "addWordList",
      "generateSetByList",
      "generateSetByTopic",
      "addNewGroup",
    ]),

    async onAdd() {
      if (this.showGroupInput)
        this.groupId = await this.addNewGroup(this.newGroupName);

      if (this.modeId === "generateByList")
        await this.generateSetByList(this.inputData, this.groupId);

      if (this.modeId === "generateByTopic")
        await this.generateSetByTopic(this.inputData, this.groupId);

      if (this.modeId === "addFromReverso")
        await this.addWordList(
          JSON.parse(this.inputData).results,
          this.groupId
        );
    },
  },
};
</script>
