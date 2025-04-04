import { request } from "../../request";

const getSubjectListAPI = async (token:string) => {
    return request('/api/share/course_list',{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getSubjectListAPI;