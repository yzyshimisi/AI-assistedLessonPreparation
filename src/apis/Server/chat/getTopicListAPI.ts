import { request } from "../../request";

const token = localStorage.getItem("token")

const getTopicListAPI = async () => {
    return request("/api/chat/topic",{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getTopicListAPI;