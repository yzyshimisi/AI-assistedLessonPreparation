import { request } from "../../request";

const token = localStorage.getItem('token')

const editCourseAPI = async (data:{
    id: number,
    course_name: string,
    course_number: string,
    course_img: string,
    course_introduction: string,
    course_class: string,
    course_type: number,
    course_addr: string,
    lecturer_profile: string,
    credit: string,
    academic_year: string,
    academic_term: number,
    week: string,
    weekday: string,
    section: string,
    is_completed?: false
}) => {
    return request('/api/course/put',{
        method: "put",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default editCourseAPI;