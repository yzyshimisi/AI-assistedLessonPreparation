import { request } from "../../request";

const token = localStorage.getItem('token')

const sendMsgAPI = async (data:{
    session_id: number,
    message: string,
}) => {
    return request('/api/chat/answer',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data,
    })
}

export default sendMsgAPI;