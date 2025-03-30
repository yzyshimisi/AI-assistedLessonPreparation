import { request } from "../../request";

const exportLessonPlanAPI = async (
    token: string,
    data: {
        message_id: number
    }
) => {
    return request('/api/lesson/export_tplan',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default exportLessonPlanAPI;