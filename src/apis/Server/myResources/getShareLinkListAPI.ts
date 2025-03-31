import { request } from "../../request";

const getShareLinkListAPI = async (token:string,query:{
    parent_id: number
}) => {
    let url = `/api/disk/shareDir?parent_id=${query.parent_id}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getShareLinkListAPI;