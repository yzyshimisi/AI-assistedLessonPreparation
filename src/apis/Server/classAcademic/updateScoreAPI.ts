import { request } from "../../request";
import '../../../interface/classAcademic'

const token = localStorage.getItem('token')

const updateScoreAPI = async (data:{
    course_id: number
    update_scores: Array<updateScoreType>
}) => {
    return request('/api/score/update',{
        method: "put",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default updateScoreAPI;