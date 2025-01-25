import { defineStore } from "pinia";
import loginStore from "./Server/loginStore";

export const useMainStore = defineStore("main", () => {
    return {
        loginStore,
    };
},{ persist: true });
