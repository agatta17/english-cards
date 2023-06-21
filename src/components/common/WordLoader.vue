<template>
  <div class="text-center">
    <v-dialog v-model="wordLoaderOpened" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Загрузить слова
        </v-card-title>

        <v-card-text class="pt-4">
          <div class="d-flex align-center mb-4">
            <v-text-field
              v-if="showGroupInput"
              v-model="newGroupName"
              label="Группа"
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
              label="Группа"
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
            v-model="wordList"
            outlined
            name="input-7-4"
            :label="mode === 'generate' ? 'Список слов через запятую' : 'Json'"
            color="cyan"
          ></v-textarea>
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
    wordList: "",
    groupId: null,
    showGroupInput: false,
    newGroupName: "",
    mode: "generate",
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
      "addNewGroup",
    ]),

    async onAdd() {
      if (this.showGroupInput)
        this.groupId = await this.addNewGroup(this.newGroupName);

      if (this.mode === "generate")
        await this.generateSetByList(this.wordList, this.groupId);

      if (this.mode === "add")
        await this.addWordList(JSON.parse(this.wordList).results, this.groupId);

      this.toggleWordLoader();
    },
  },
};
</script>
