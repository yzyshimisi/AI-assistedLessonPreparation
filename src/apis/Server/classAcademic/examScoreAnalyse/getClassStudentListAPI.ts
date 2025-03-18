import { request } from "../../../request";

const token = localStorage.getItem('token')

const getClassStudentListAPI = async (query:{class:string}) => {
    let url = `/api/class/stu?class=${query.class}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getClassStudentListAPI;