import { request } from "../../../request";

const getStuFinalGradesAPI = async (token:string,query:{
    academic_year: string,
    academic_term: number,
    name?: string
    student_id?: string
    class: string
}) => {
    let url = `/api/score/scores?academic_year=${query.academic_year}&academic_term=${query.academic_term}&name=${query.name}&student_id=${query.student_id}&class=${query.class}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getStuFinalGradesAPI;