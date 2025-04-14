import { request } from "../../../request";

const sendTranscriptAPI = async (token:string,data:{
    student_id: string
}) => {
    return request('/api/score/transcripts',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data,
    })
}

export default sendTranscriptAPI;