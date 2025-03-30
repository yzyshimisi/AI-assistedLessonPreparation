import { request } from "../../request";

const getClassListAPI = async (token:string) => {
    return request('/api/class/allList',{
        method: 'get',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getClassListAPI;