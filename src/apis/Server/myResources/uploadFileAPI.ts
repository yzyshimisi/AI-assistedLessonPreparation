import { request } from "../../request";

const token = localStorage.getItem('token')

const uploadFileAPI = async (data:FormData) => {
    return request('/api/disk/file',{
        method: 'post',
        headers: {"Content-Type":"multipart/form-data", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default uploadFileAPI;