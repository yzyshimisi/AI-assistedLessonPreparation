import { request } from "../../request";

const getLessonPreGraphAPI = async (token:string) => {
    return request('/api/graph/material?filename=中国近代史重点.pdf&authorization_id=',{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getLessonPreGraphAPI