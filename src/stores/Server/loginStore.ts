import { defineStore } from "pinia";
import { ref } from "vue";

const loginStore = defineStore('login',
    ()=>{
        const loginSession = ref<boolean>(false);
        const setLogin = (loginNewSession:boolean) => {
            loginSession.value = loginNewSession;
        };
        return {
            loginSession,
            setLogin,
        };
    },
    {
        persist: true
    }
)

export default loginStore