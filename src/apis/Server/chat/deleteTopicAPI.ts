import { request } from "../../request";

const token = localStorage.getItem('token')

const deleteTopicAPI = async (query:{id:number}) => {
    return request("/api/chat/topic?id=".concat(String(query['id'])),{
        method: "delete",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default deleteTopicAPI;