import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import ru from "vuetify/lib/locale/ru";
import en from "vuetify/lib/locale/en";

Vue.use(Vuetify);

const colors = {
  primary: "#2A6EF1",

  profit: "#82D4BB",
  loss: "#E87461",

  primaryText: "#325276",
  secondaryText: "#7486AA",

  success: "#82D4BB",
  warning: "#E87461",
};

export default new Vuetify({
  lang: {
    locales: { ru, en },
    current: "en",
  },

  theme: {
    options: { customProperties: true },

    themes: {
      light: {
        ...colors,
        whiteCustom: "#ffffff",
        overlayBackground: "#f7f7f9",
        widgetBackground: "#ffffff",

        accentGray: "#eff0f4",
        accentGrayLight: "#F7F9FD",
      },
      dark: {
        ...colors,
        whiteCustom: "#121212",
        overlayBackground: "#121212",
        widgetBackground: "#1E1E1E",

        accentGray: "#161616",
        accentGrayLight: "#F7F9FD",
      },
    },
  },
});
