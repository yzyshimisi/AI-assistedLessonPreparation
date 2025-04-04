import { request } from "../../../request";

const getTextbookResourcesListAPI = async (token:string) => {
    return request('/api/lesson/resource_list',{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getTextbookResourcesListAPI;