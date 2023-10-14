<template>
  <v-card flat>
    <div class="d-flex align-center">
      <v-text-field
        v-if="showGroupInput"
        v-model="newGroupName"
        label="Group"
        outlined
        hide-details
        color="emerald"
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
        color="emerald"
      >
      </v-select>

      <v-btn @click="showGroupInput = !showGroupInput" icon class="ml-2">
        <v-icon color="emerald" large>
          {{ showGroupInput ? "mdi-close" : "mdi-plus" }}
        </v-icon>
      </v-btn>
    </div>

    <v-textarea
      v-model="inputData"
      outlined
      name="input-7-4"
      label="Json"
      color="emerald"
      hide-details
      class="mt-4"
    ></v-textarea>

    <div class="mt-1">
      <a
        href="https://context.reverso.net/bst-web-user/user/favourites/shared?userName=adephimova&start=0&length=2000&order=10"
        target="_blank"
        class="grey--text"
      >
        Get Reverso data
      </a>
    </div>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="toggleWordLoader" color="emerald" text> Отменить </v-btn>

      <v-btn @click="onAdd" color="emerald" depressed>
        <span class="white--text">Добавить</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";

export default {
  name: "AddFromReversoForm",

  data: () => ({
    inputData: "",
    groupId: null,
    showGroupInput: false,
    newGroupName: "",
  }),

  computed: {
    ...mapStores(useAppStore),

    groups() {
      return this.appStore.groups;
    },
  },

  methods: {
    ...mapActions(useAppStore, [
      "toggleWordLoader",
      "addWordList",
      "addNewGroup",
    ]),

    async onAdd() {
      if (this.showGroupInput)
        this.groupId = await this.addNewGroup(this.newGroupName);

      await this.addWordList(JSON.parse(this.inputData).results, this.groupId);
    },
  },
};
</script>
