import { request } from "../../request";

const token = localStorage.getItem('token');

const createTopicAPI = async (data:{topic:string}) => {
    return request("/api/chat/topic",{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data,
    })
}

export default createTopicAPI;