import { request } from "../../../request";

const token = localStorage.getItem('token')

const obtainClassListAPI = async () => {
    return request('/api/class/list',{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default obtainClassListAPI;

