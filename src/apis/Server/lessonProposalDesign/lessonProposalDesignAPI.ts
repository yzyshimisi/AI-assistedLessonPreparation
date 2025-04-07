import { request } from "../../request";

const lessonProposalDesignAPI = async (token:string,data:{
    session_id: number,
}) => {
    return request('/api/chat/speech_generate',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data,
    })
}

export default lessonProposalDesignAPI;