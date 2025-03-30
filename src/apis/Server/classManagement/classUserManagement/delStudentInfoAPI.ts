import { request } from "../../../request";

const delStudentInfoAPI = async (token:string,data:{
    student_ids: Array<string>,
    course_id: number
}) => {
    return request('/api/student/info',{
        method: "DELETE",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default delStudentInfoAPI;