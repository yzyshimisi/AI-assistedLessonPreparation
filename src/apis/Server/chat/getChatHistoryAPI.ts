import { request } from "../../request";

const token = localStorage.getItem('token')

const getChatHistoryAPI = async (query:{
    id: number,
    page_num: number,
    page_size: number,
}) => {
    let url = "/api/chat/history?";
    for(let key in query){
        url=url.concat(key.concat('=').concat(query[key]).concat('&'))
    }
    return request(url,{
        method: 'get',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getChatHistoryAPI;