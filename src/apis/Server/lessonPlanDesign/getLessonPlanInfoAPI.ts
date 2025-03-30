import { request } from "../../request";

const getLessonPlanInfoAPI = async (
    token: string,
    query: {
        message_id: number
    }
) => {
    let url = `/api/lesson/tplan?message_id=${query.message_id}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getLessonPlanInfoAPI;