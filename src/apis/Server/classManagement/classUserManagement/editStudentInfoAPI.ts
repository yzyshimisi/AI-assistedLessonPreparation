import { request } from "../../../request";

const token = localStorage.getItem('token')

const editStudentInfoAPI = async (data:{
    student_id: string,
    name: string,
    college: string,
    class: string,
    major: string,
}) => {
    return request('/api/student/info',{
        method: "put",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default editStudentInfoAPI;