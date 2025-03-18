import { request } from "../../../request";

const token = localStorage.getItem('token')

const getScoreOverviewAPI = async (query:{
    class: string,
    year: string,
    term: number,
    course_name: string,
}) => {
    let url = `/api/score/number?class=${query.class}&year=${query.year}&term=${query.term}&course_name=${query.course_name}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getScoreOverviewAPI;