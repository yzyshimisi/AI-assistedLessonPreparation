import { request } from "../../request";

const generatePPTOutlineAPI = async (token:string,data:{
    session_id: number
}) => {
    return request('/api/chat/outline_generate',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data:data
    })
}

export default generatePPTOutlineAPI;