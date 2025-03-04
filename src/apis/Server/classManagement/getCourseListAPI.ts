import { request } from "../../request";

const token = localStorage.getItem('token')

const getCourseListAPI = async () => {
    return request('/api/course/get',{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getCourseListAPI;