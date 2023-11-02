<template>
  <v-card flat :outlined="!isMobile" width="400px" class="mt-8 mx-auto pa-10">
    <div class="text-h5">
      {{ `${page[1].toUpperCase()}${page.slice(2, page.length)}` }}
    </div>
    <v-text-field
      v-model="username"
      label="Username"
      outlined
      hide-details
      color="emerald"
      class="mt-4"
    >
    </v-text-field>

    <v-text-field
      v-model="password"
      type="password"
      label="Password"
      outlined
      hide-details
      color="emerald"
      class="mt-4"
    >
    </v-text-field>

    <div class="d-flex justify-end">
      <v-btn
        @click="sendData"
        :loading="isLoading"
        color="emerald"
        depressed
        class="mt-6"
      >
        <span class="white--text">Send</span>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import { useAppStore } from "@/store";
import { mapActions } from "pinia";

export default {
  name: "AuthorizationPage",

  data: () => ({
    username: "",
    password: "",
    isLoading: false,
  }),

  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xs;
    },

    page() {
      return this.$route.path;
    },
  },

  methods: {
    ...mapActions(useAppStore, ["register", "login", "initApp"]),

    async sendData() {
      if (!this.username || !this.password) return;

      const action = this.page === "/registration" ? this.register : this.login;

      try {
        this.isLoading = true;

        await action({
          username: this.username,
          password: this.password,
        });

        this.$router.push("/");

        const store = useAppStore();
        store.$reset();

        this.initApp();
      } catch {
        return;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
