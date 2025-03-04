import { request } from "../../../request";

const token = localStorage.getItem('token')

const getCourseClassesListAPI = async (query:{
    course_id: number
}) => {
    let url = `/api/course/classList?course_id=${query.course_id}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getCourseClassesListAPI;