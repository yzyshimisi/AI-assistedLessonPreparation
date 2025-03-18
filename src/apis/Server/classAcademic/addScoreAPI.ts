import { request } from "../../request";

const token = localStorage.getItem('token')

const addScoreAPI = async (data:{
    course_id: number,
    create_scores: Array<addScoreType>
}) => {
    return request('/api/score/add',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data,
    })
}

export default addScoreAPI;