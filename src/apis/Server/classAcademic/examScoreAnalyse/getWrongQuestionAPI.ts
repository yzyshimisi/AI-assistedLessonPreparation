import { request } from "../../../request";

const getWrongQuestionAPI = async (token:string) => {
    return request('/api/score/wrong_problem',{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getWrongQuestionAPI;