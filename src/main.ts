import { createApp } from "vue";
import "tailwindcss/tailwind.css"
import App from './App.vue'
import router from "./router";
import pinia from "./stores/createPinia";
import { themeChange } from 'theme-change';

themeChange(true);

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app')


