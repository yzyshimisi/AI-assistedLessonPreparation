import { request } from "../../../request";

const token = localStorage.getItem('token')

const addStudentInfoAPI = async (data:{
    student_id: string,
    name: string,
    college: string,
    class: string,
    major: string,
    course_id: number,
}) => {
    return request('/api/student/info',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export  default addStudentInfoAPI;