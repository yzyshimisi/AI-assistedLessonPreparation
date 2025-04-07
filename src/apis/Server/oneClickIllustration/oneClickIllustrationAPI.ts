import { request } from "../../request";

const oneClickIllustrationAPI = async (token:string,data:{
    session_id: number,
}) => {
    return request('/api/chat/image_generate',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data,
    })
}

export default oneClickIllustrationAPI;