import { request } from "../../request";

const modifyLessonPlanAPI = async (
    token: string,
    data: modifyLessonPlanInfoType
) => {
    return request('/api/lesson/tplan',{
        method: "put",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data,
    })
}

export default modifyLessonPlanAPI;