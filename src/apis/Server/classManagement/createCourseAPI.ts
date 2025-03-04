import { request } from "../../request";

const token = localStorage.getItem('token')

const createCourseAPI = async (data:{
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
    classes: Array<string>
}) => {
    return request('/api/course/create',{
        method: 'post',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data:data
    })
}

export default createCourseAPI;