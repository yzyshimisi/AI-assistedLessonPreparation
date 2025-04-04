import { request } from "../../request";

const createTopicAPI = async (token:string,data:{topic:string}) => {
    return request("/api/chat/topic",{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data,
    })
}

export default createTopicAPI;