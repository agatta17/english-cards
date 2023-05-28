<template>
  <div class="text-center text-h4 primary--text mt-8">
    <div class="blue-grey--text text--darken-3">Here is empty</div>
    <div>
      <img src="@/assets/cat.png" :height="isMobile ? '250px' : '600px'" />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>
