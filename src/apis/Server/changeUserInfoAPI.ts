import { request } from "../request";
import { useMainStore } from "../../stores";

const token = localStorage.getItem('token')

const changeUserInfoAPI = async (data:{
    username: string,
    avatar: string
}) => {
    return request("/api/user/personal",{
        method: "put",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default changeUserInfoAPI;