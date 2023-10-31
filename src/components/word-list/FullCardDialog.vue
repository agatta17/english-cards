<template>
  <v-dialog v-model="formOpened" width="auto" :fullscreen="isMobile">
    <v-btn
      v-if="isMobile"
      @click="formOpened = false"
      icon
      absolute
      class="ml-3 mt-1"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <full-card :word="word" />
  </v-dialog>
</template>

<script>
import FullCard from "@/components/common/FullCard.vue";

export default {
  name: "FullCardDialog",

  components: {
    FullCard,
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },

    word: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    formOpened: {
      get: function () {
        return this.open;
      },

      set: function (value) {
        this.$emit("update:open", value);
      },
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>
