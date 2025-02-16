import { request } from "../../request";

const token = localStorage.getItem('token')

const getRecycleListAPI = async () => {
    return request('/api/disk/recycle',{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getRecycleListAPI;