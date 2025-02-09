import { defineStore } from "pinia";
import loginStore from "./Server/loginStore";
import userInfoStore from "./Server/userInfoStore";

export const useMainStore = defineStore("main", () => {
    return {
        loginStore,
        userInfoStore,
    };
},{ persist: true });
