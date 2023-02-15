const path = require("path");
// const { defineConfig } = require("@vue/cli-service");

module.exports = {
  transpileDependencies: ["vuetify"],

  configureWebpack: {
    cache: {
      type: process.env.NODE_ENV === "production" ? "filesystem" : "memory",
    },
  },

  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [
        path.resolve(__dirname, "./src/assets/styles/constants/*.scss"),
      ],
    },
  },
};
