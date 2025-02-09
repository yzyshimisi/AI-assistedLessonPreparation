import { request } from "../request";

const token = localStorage.getItem('token')

const getUserInfoAPI = async () => {
    return request("/api/user/personal",{
        method: 'get',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getUserInfoAPI;