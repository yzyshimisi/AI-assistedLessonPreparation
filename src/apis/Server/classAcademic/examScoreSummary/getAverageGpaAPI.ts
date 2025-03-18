import { request } from "../../../request";

const token = localStorage.getItem('token')

const getAverageGpaAPI = async (query:{
    year: string,
    term: number,
    class: string,
}) => {
    let url = `/api/score/perf?year=${query.year}&term=${query.term}&class=${query.class}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getAverageGpaAPI;