import { request } from "../../request";

const token = localStorage.getItem('token')

const deleteFileAPI = async (data:{
    ids: Array<number>,
}) => {
    return request('/api/disk/directory',{
        method: "delete",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data,
    })
}

export default deleteFileAPI