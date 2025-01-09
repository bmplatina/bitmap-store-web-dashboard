import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

// i18n
import { i18n, useI18n } from "@/i18n";

// date
import dayjs from "dayjs";

// Markdown
import VueMarkdown from "vue-markdown-render";

loadFonts();

const app = createApp(App);

app.config.globalProperties.$filters = {
  formatDate(value: string, locale: string) {
    return locale === 'ko'
      ? dayjs(value).format('YYYY/MM/DD')
      : dayjs(value).format('MM/DD/YYYY');
  },
  getLanguage(): string {
    return useI18n().locale.value;
  },
};

app.use(router).use(store).use(vuetify).use(i18n).component("v-markdown-renderer", VueMarkdown).mount("#app");
