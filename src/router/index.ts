import { useMainStore } from "../stores";
import pinia from "../stores/createPinia";
import { storeToRefs } from "pinia";
import { createRouter,createWebHistory } from "vue-router";

import { login, register, findPassword, changePassword, AIChat, home, userInfo, myResources, lessonPreparationMaterials, classManagement, classAcademic } from "../views"

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
    },
    {
        path: "/",
        component: home
    },
    {
        path: "/userInfo",
        component: userInfo
    },
    {
        path: "/myResources",
        component: myResources,
    },
    {
        path: "/lessonPreparationMaterials",
        component: lessonPreparationMaterials,
    },
    {
        path: "/classManagement",
        component: classManagement,
    },
    {
        path: "/classAcademic",
        component: classAcademic,
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