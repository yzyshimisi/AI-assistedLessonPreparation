import { request } from "../../request";

const token = localStorage.getItem('token')

const createLessonPlanAPI = async (data:createLessonPlanInfoType) => {
    return request('/api/lesson/tplan',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default createLessonPlanAPI;