<template>
  <div>
    <a
      :href="`https://context.reverso.net/перевод/английский-русский/${word}`"
      class="text-h5 text-md-h3 blue-grey--text text--darken-3 text-decoration-none"
      target="_blank"
    >
      {{ word }}
    </a>

    <div
      class="text-h6 blue-grey--text text--darken-1 mt-2"
      v-html="example"
    ></div>
  </div>
</template>

<script>
export default {
  name: "EnglishWord",

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
<style>
.text-decoration-none {
  text-decoration: none;
}
</style>
