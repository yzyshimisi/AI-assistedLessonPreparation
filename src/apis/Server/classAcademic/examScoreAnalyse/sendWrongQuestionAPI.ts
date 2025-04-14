import { request } from "../../../request";

const sendWrongQuestionAPI = async (token:string,data:{}) => {
    return request('/api/score/export_problem',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default sendWrongQuestionAPI;