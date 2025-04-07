import { request } from "../../request";

const unitHomeworkDesignAPI = async (token:string,data:{
    session_id: number,
}) => {
    return request('/api/chat/homework_generate',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default unitHomeworkDesignAPI;