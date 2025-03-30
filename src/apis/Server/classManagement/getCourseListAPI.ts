import { request } from "../../request";

const getCourseListAPI = async (token:string) => {
    return request('/api/course/get',{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getCourseListAPI;