<template>
  <div>
    <v-app-bar color="cyan darken-1" dense class="d-flex justify-center">
      <v-btn to="/" text color="white" class="mr-5"> Список </v-btn>

      <v-btn text to="/cards/english" color="white" class="mr-5"
        >Английские карточки</v-btn
      >

      <v-btn text to="/cards/russian" color="white" class="mr-5"
        >Русские карточки</v-btn
      >

      <v-btn @click="downloadWordList">Скачать слова</v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "AppNavigation",

  methods: {
    async downloadWordList() {
      const words = JSON.parse(localStorage.getItem("words"));
      const groups = JSON.parse(localStorage.getItem("groups"));

      const data = JSON.stringify({
        words,
        groups,
      });

      const options = {
        suggestedName: "words.json",
        types: [
          {
            description: "Text",
            accept: {
              "text/plain": ".json",
            },
          },
        ],
        excludeAcceptAllOption: true,
      };

      const fileHandle = await window.showSaveFilePicker(options);
      const writableStream = await fileHandle.createWritable(options);
      await writableStream.write(data);

      await writableStream.close();
    },
  },
};
</script>
