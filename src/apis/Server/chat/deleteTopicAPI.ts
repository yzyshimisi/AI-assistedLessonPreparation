import { request } from "../../request";

const token = localStorage.getItem('token')

const deleteTopicAPI = async (params:{id:number}) => {
    return request("/api/chat/topic",{
        method: "delete",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        params: params,
    })
}

export default deleteTopicAPI;