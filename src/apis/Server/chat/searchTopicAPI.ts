import { request } from "../../request";

const token = localStorage.getItem('token')

const searchTopicAPI = async (query:{
    key: string,
}) => {
    let url = `/api/chat/search?key=${query.key}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default searchTopicAPI;