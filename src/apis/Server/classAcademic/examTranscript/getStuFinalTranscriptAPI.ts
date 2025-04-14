import { request } from "../../../request";

const getStuFinalTranscriptAPI = async (token:string,query:{
    student_id: string,
    academic_year: string,
    academic_term: number
}) => {
    let url = `/api/score/transcripts?student_id=${query.student_id}&academic_year=${query.academic_year}&academic_term=${query.academic_term}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getStuFinalTranscriptAPI;