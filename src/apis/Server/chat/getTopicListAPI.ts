import { request } from "../../request";

const getTopicListAPI = async (token) => {
    return request("/api/chat/topic",{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getTopicListAPI;