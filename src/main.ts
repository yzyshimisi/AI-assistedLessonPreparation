import { createApp } from "vue";
import "tailwindcss/tailwind.css"
import App from './App.vue'
import router from "./router";
import pinia from "./stores/createPinia";
import { themeChange } from 'theme-change';
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from "element-plus/es/locale/lang/zh-cn"

zhCn.el.pagination.goto = "跳转至"

themeChange(true);

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(ElementPlus,{ locale: zhCn });

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


app.mount('#app')


