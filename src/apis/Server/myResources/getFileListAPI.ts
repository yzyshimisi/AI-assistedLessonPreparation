import { request } from "../../request";

const token = localStorage.getItem('token')

const getFileListAPI = async (query:{
    parent_id: number,
    page_num: number,
    page_size: number,
}) => {
    let url = `/api/disk/directory?parent_id=${query['parent_id']}&page_num=${query['page_num']}&page_size=${query["page_size"]}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getFileListAPI;