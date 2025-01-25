import { useMainStore } from "../stores";
import pinia from "../stores/createPinia";
import { storeToRefs } from "pinia";
import { createRouter,createWebHistory } from "vue-router";

import { login, register } from "../views"

const routes = [
    {
        path: "/login",
        component: login
    },
    {
        path: "/register",
        component: register
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

router.beforeEach((to,_,next) => {
    const loginstore = useMainStore().loginStore(pinia);
    const { loginSession } = storeToRefs(loginstore);

    if(loginSession.value === false && to.path !== "/login" && to.path !== "/register") {
        next("/login");
    }else{
        next();
    }
});

export default router;