import { request } from "../../request";

const interdisciplinaryDesignAPI = async (token:string,data:{
    session_id: number,
}) => {
    return request('/api/chat/interdisciplinary_generate',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default interdisciplinaryDesignAPI;