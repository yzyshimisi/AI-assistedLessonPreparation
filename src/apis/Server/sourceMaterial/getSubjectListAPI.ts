import { request } from "../../request";

const token = localStorage.getItem('token')

const getSubjectListAPI = async () => {
    return request('/api/share/course_list',{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getSubjectListAPI;