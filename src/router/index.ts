import { useMainStore } from "../stores";
import pinia from "../stores/createPinia";
import { storeToRefs } from "pinia";
import { createRouter,createWebHistory } from "vue-router";

import { login, register, findPassword, changePassword, AIChat } from "../views"

const routes = [
    {
        path: "/login",
        component: login
    },
    {
        path: "/register",
        component: register
    },
    {
        path: "/login/findPassword",
        component: findPassword
    },
    {
        path: "/user/changePassword",
        component: changePassword
    },
    {
        path: "/chat",
        component: AIChat
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

router.beforeEach((to,_,next) => {
    const loginstore = useMainStore().loginStore(pinia);
    const { loginSession } = storeToRefs(loginstore);

    if(loginSession.value === false && to.path !== "/login" && to.path !== "/register" && to.path !== "/login/findPassword") {
        next("/login");
    }else{
        next();
    }
});

export default router;