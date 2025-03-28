import { request } from "../../request";

const token = localStorage.getItem('token')

const getResourcesListAPI = async (query:{
    resource_type: number,
    subject_name: string,
}) => {
    let url = `/api/share/resource?resource_type=${query.resource_type}&subject_name=${query.subject_name}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getResourcesListAPI;