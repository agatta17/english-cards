<template>
  <div class="d-flex flex-column">
    <v-toolbar>
      <tool-bar v-if="!isMobile" />
      <group-filter />
    </v-toolbar>

    <div v-if="isLoading" class="loader-wrap"><div class="loader"></div></div>

    <plug-component v-else-if="!words.length" />

    <v-sheet v-else max-width="1100" class="align-self-center mt-8">
      <word-card v-for="word in words" :key="word._id" :word="word" />
    </v-sheet>
  </div>
</template>

<script>
import GroupFilter from "@/components/common/GroupFilter.vue";
import ToolBar from "@/components/common/ToolBar.vue";
import { useAppStore } from "@/store";
import { mapStores } from "pinia";
import WordCard from "./WordCard.vue";
import PlugComponent from "@/components/common/PlugComponent.vue";

export default {
  name: "WordList",

  components: {
    GroupFilter,
    ToolBar,
    WordCard,
    PlugComponent,
  },

  computed: {
    ...mapStores(useAppStore),

    words() {
      return this.appStore.words;
    },

    isLoading() {
      return this.appStore.isLoading;
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>
<style scoped>
.loader-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 500px;
  align-items: center;
}
.loader {
  position: relative;
  width: 108px;
  display: flex;
  justify-content: space-between;
}
.loader::after,
.loader::before {
  content: "";
  display: inline-block;
  width: 48px;
  height: 48px;
  background-color: #00acc1;
  background-image: radial-gradient(circle 14px, #0d161b 100%, transparent 0);
  background-repeat: no-repeat;
  border-radius: 50%;
  animation: eyeMove 10s infinite, blink 10s infinite;
}
@keyframes eyeMove {
  0%,
  10% {
    background-position: 0px 0px;
  }
  13%,
  40% {
    background-position: -15px 0px;
  }
  43%,
  70% {
    background-position: 15px 0px;
  }
  73%,
  90% {
    background-position: 0px 15px;
  }
  93%,
  100% {
    background-position: 0px 0px;
  }
}
@keyframes blink {
  0%,
  10%,
  12%,
  20%,
  22%,
  40%,
  42%,
  60%,
  62%,
  70%,
  72%,
  90%,
  92%,
  98%,
  100% {
    height: 48px;
  }
  11%,
  21%,
  41%,
  61%,
  71%,
  91%,
  99% {
    height: 18px;
  }
}
</style>
