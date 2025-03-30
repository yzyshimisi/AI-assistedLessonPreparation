import { request } from "../../request";

const token = localStorage.getItem('token')

const getTimetableAPI = async (token:string,query:{
    academic_year: string,
    academic_term: number,
    week: number,
}) => {
    let url = `/api/course/table?week=${query.week}&academic_year=${query.academic_year}&academic_term=${query.academic_term}`
    return request(url,{
        method: 'get',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getTimetableAPI;