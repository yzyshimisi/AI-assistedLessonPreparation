import { request } from "../request";

const getUserInfoAPI = async (token) => {
    return request("/api/user/personal",{
        method: 'get',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getUserInfoAPI;