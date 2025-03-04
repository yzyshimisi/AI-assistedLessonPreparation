import { request } from "../../request";

const token = localStorage.getItem('token')

const deleteCourseAPI = async (course_id:number) => {
    let url = '/api/course/del?course_id='.concat(String(course_id))
    return request(url,{
        method: 'delete',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default deleteCourseAPI;