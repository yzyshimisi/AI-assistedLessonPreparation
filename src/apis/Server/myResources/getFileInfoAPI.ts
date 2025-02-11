import { request } from "../../request";

const token = localStorage.getItem('token')

const getFileInfoAPI = async (id:number) => {
    let url = `/api/disk/file?id=${id}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getFileInfoAPI;