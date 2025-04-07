import { request } from "../../request";

const createUnitTeachingDesignAPI = async (token:string,data:{
    session_id: number
}) => {
    return request('/api/chat/unit_generate',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default  createUnitTeachingDesignAPI;