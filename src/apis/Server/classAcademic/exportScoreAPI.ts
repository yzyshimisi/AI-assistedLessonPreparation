import { request } from "../../request";

const token = localStorage.getItem('token')

const exportScoreAPI = async (query:{
    course_id: number,
}) => {
    let url = `/api/score/export?course_id=${query.course_id}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default exportScoreAPI;