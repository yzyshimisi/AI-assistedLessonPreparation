import { request } from "../../../request";

const generateExercisesAPI = async (token:string,data:{}) => {
    return request('/api/score/generate',{
        method: 'post',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default generateExercisesAPI;