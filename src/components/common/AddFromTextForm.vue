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
      label="Word list"
      color="emerald"
      hide-details
      class="mt-4"
    ></v-textarea>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="toggleWordLoader" color="emerald" text> Cancel </v-btn>

      <v-btn @click="onAdd" color="emerald" depressed>
        <span class="white--text">Save</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useAppStore } from "@/store";
import { mapStores, mapActions } from "pinia";

export default {
  name: "AddFromTextForm",

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

    currentGroupId() {
      return this.appStore.currentGroupId;
    },

    wordLoaderOpened() {
      return this.appStore.wordLoaderOpened;
    },
  },

  methods: {
    ...mapActions(useAppStore, [
      "toggleWordLoader",
      "addWordList",
      "addNewGroup",
    ]),

    async onAdd() {
      try {
        if (this.showGroupInput)
          this.groupId = await this.addNewGroup(this.newGroupName);

        await this.addWordList(this.inputData, this.groupId);
      } catch {
        return;
      }
    },

    initData() {
      this.groupId = this.currentGroupId;
      this.inputData = "";
      this.showGroupInput = false;
      this.newGroupName = "";
    },
  },

  watch: {
    wordLoaderOpened: {
      handler(val) {
        if (val) this.initData();
      },

      immediate: true,
    },
  },
};
</script>
