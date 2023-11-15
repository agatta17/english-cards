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

        <v-btn @click="onAddNewGroup" :loading="isCreationLoading" icon>
          <v-icon color="white">mdi-plus-circle-outline</v-icon>
        </v-btn>

        <tool-bar />
      </v-list-item>

      <v-list dense nav>
        <v-list-item
          v-for="group in groups"
          :id="group.id"
          :key="group.id"
          :to="
            groupIdForEditing === group.id
              ? ''
              : `${$route.path}?group=${group.id}`
          "
          exact-active-class="active-item"
        >
          <v-list-item-content>
            <v-list-item-title>
              <template v-if="groupIdForEditing === group.id">
                <v-text-field
                  @blur="groupIdForEditing = null"
                  @input="newName = $event"
                  :value="group.name"
                  class="text-body-2"
                  hide-details
                  dense
                  outlined
                  color="white"
                  autofocus
                >
                  <template v-slot:append>
                    <v-btn
                      @click="onDeleteGroup(group._id)"
                      :loading="isDeletionLoading"
                      icon
                      small
                    >
                      <v-icon color="white" small>mdi-delete</v-icon>
                    </v-btn>

                    <v-btn
                      @click="onChangeGroup(group._id)"
                      :loading="isChangeLoading"
                      icon
                      small
                    >
                      <v-icon color="white" small>mdi-content-save</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </template>

              <template v-else>
                <span>{{ group.name }}</span>

                <v-btn
                  @click.prevent="toggleEditor(group.id)"
                  icon
                  x-small
                  class="ml-1"
                >
                  <v-icon color="sky" small> mdi-pencil </v-icon>
                </v-btn>
              </template>
            </v-list-item-title>
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

  data() {
    return {
      groupIdForEditing: null,
      newName: "",
      isDeletionLoading: false,
      isChangeLoading: false,
      isCreationLoading: false,
    };
  },

  computed: {
    ...mapStores(useAppStore),

    groups() {
      return [...this.appStore.groups];
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
    ...mapActions(useAppStore, [
      "setGroup",
      "changeGroup",
      "deleteGroup",
      "addNewGroup",
    ]),

    toggleEditor(id) {
      this.groupIdForEditing = id;
    },

    async onDeleteGroup(id) {
      this.isDeletionLoading = true;
      await this.deleteGroup(id);
      this.isDeletionLoading = false;
    },

    async onChangeGroup(id) {
      if (this.newName) {
        this.isChangeLoading = true;
        await this.changeGroup(id, this.newName);
        this.isChangeLoading = false;
        this.groupIdForEditing = null;
      }
    },

    async onAddNewGroup() {
      this.isCreationLoading = true;
      const id = await this.addNewGroup("New group");
      if (id) this.toggleEditor(id);
      this.isCreationLoading = false;
      document
        .getElementsByClassName("v-navigation-drawer__content")[0]
        .scrollIntoView({ behavior: "smooth", block: "end" });
    },
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
