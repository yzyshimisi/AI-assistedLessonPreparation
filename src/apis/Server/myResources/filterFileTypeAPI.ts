import { request } from "../../request";

const token = localStorage.getItem('token')

const filterFileTypeAPI = async (query:{
    file_type: number,
    page_num: number,
    page_size: number,
}) => {
    let url = `/api/disk/fileType?file_type=${query["file_type"]}&page_num=${query['page_num']}&page_size=${query['page_size']}`
    return request(url,{
        method: 'get',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default filterFileTypeAPI;