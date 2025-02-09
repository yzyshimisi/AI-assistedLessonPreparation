import { defineStore } from "pinia";
import { reactive, } from "vue";

const userInfoStore = defineStore('userInfo',
    ()=>{
        const userInfo = reactive({
            user_id: -1,
            username: "",
            email: "",
            avatar: "",
            created_at: "",
        })
        const setInfo = (data) => {
            Object.assign(userInfo,data);
        }
        const changeInfo = (key,value) => {
            userInfo[key] = value;
        }
        const clearInfo = () => {
            userInfo['user_id'] = -1;
            userInfo['username'] = "";
            userInfo['email'] = "";
            userInfo['avatar'] = "";
            userInfo['created_at'] = "";
        }
        return {
            userInfo,
            setInfo,
            changeInfo,
            clearInfo,
        };
    },
    {
        persist: true
    }
)

export default userInfoStore;