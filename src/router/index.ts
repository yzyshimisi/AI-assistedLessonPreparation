import { loginStore } from "../stores";
import pinia from "../stores/createPinia";
import { storeToRefs } from "pinia";
import { createRouter,createWebHistory } from "vue-router";
import { HelloWorld } from "../components";

const routes = [
    {
        path: "/Login",
        component: HelloWorld
    },
]

const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

router.beforeEach((to,_,next) => {
    const loginstore = loginStore(pinia);
    const { loginSession } = storeToRefs(loginstore);

    if(loginSession.value === false){
        //解决无限重定向的问题
        if(to.path === "/Login"){
            next();
        }else{
            next("/Login");
        }
    }else{
        next();
    }
});

export default router;