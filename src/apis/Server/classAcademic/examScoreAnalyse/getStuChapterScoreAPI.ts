import { request } from "../../../request";

const token = localStorage.getItem('token')

const getStuChapterScoreAPI = async (query:{
    course_id: number,
    student_id: string,
}) => {
    let url = `/api/class/chapter?course_id=${query.course_id}&student_id=${query.student_id}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getStuChapterScoreAPI;