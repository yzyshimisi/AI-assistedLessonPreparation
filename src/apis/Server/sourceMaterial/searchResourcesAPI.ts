import { request } from "../../request";

const token = localStorage.getItem('token')

const searchResourcesAPI = async (query:{
    resource_type: number,
    keyword: string,
}) => {
    let url = `/api/share/resource?resource_type=${query.resource_type}&keyword=${query.keyword}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default searchResourcesAPI;