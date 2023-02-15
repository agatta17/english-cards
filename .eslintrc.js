module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/attributes-order": [
      "warn",
      {
        order: [
          "DEFINITION",
          "LIST_RENDERING",
          "CONDITIONALS",
          "RENDER_MODIFIERS",
          "GLOBAL",
          ["UNIQUE", "SLOT"],
          "TWO_WAY_BINDING",
          "EVENTS",
          "OTHER_DIRECTIVES",
          "OTHER_ATTR",
          "CONTENT",
        ],
      },
    ],

    "vue/order-in-components": [
      "error",
      {
        order: [
          "el",
          "name",
          "parent",
          "functional",
          ["delimiters", "comments"],
          "provide",
          "inject",
          "components",
          "ROUTER_GUARDS",
          ["directives", "filters"],
          "extends",
          "mixins",
          "inheritAttrs",
          "model",
          ["props", "propsData"],
          "data",
          "validate",
          "computed",
          "methods",
          "watch",
          "LIFECYCLE_HOOKS",
          ["template", "render"],
          "renderError",
        ],
      },
    ],
  },
};
