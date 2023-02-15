<template>
  <div>
    <div class="text-h4">{{ word }}</div>
    <div class="text-h6" v-html="example"></div>
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
};
</script>
