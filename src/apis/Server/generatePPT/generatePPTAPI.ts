import { request } from "../../request";

const generatePPTAPI = async (token:string,data:{
    session_id: number,
}) => {
    return request('/api/chat/ppt_generate',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data:data
    })
}

export default generatePPTAPI;