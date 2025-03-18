import { request } from "../../../request";

const token = localStorage.getItem('token')

const getStudentGpaRankAPI = async (query:{student_id: string}) => {
    let url = `/api/class/gpa?student_id=${query.student_id}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getStudentGpaRankAPI;