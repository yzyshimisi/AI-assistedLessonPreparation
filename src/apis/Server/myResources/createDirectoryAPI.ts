import { request } from "../../request";

const token = localStorage.getItem('token')

const createDirectoryAPI = async (data:{
    name: string,
    path: string,
    parent_id: number,
}) => {
    return request("/api/disk/directory",{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data:data
    })
}

export default createDirectoryAPI;