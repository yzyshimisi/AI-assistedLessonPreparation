import { request } from "../../request";

const token = localStorage.getItem('token')

const getClassListAPI = async () => {
    return request('/api/class/allList',{
        method: 'get',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getClassListAPI;