import { request } from "../../../request";

const token = localStorage.getItem('token')

const delStudentInfoAPI = async (data:{
    student_ids: Array<string>
}) => {
    return request('/api/student/info',{
        method: "DELETE",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default delStudentInfoAPI;