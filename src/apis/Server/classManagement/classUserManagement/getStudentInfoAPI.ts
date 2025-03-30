import { request } from "../../../request";

const getStudentInfoAPI = async (token:string,query:{
    course_id: number,
    class: string,
}) => {
    let url = `/api/student/info?course_id=${query.course_id}&class=${query.class}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getStudentInfoAPI;