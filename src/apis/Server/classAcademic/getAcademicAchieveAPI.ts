import { request } from "../../request";

const token = localStorage.getItem('token')

const getAcademicAchieveAPI = async (query:{
    course_id: number,
    class: string
}) => {
    let url = `/api/score/student?course_id=${query.course_id}&class=${query.class}`
    return request(url,{
        method: 'get',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getAcademicAchieveAPI;