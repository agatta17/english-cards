<template>
  <div>
    <div class="text-h5 text-md-h4 blue-grey--text text--darken-3">
      {{ word }}
    </div>
    <div
      class="text-h6 blue-grey--text text--darken-1 mt-2"
      v-html="example"
    ></div>
  </div>
</template>

<script>
export default {
  name: "RussianWord",

  props: {
    word: {
      type: String,
      require: true,
    },

    example: {
      type: String,
      require: true,
    },
  },

  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>
