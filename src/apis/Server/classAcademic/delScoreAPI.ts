import { request } from "../../request";

const token = localStorage.getItem('token')

const delScoreAPI = async (data:{
    student_ids: Array<string>
    course_id : number
}) => {
    return request('/api/score/delete',{
        method: "DELETE",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default delScoreAPI;