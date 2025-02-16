import { request } from "../request";

const token = localStorage.getItem('token')

const userUploadAPI = async (data:FormData) => {
    return request('/api/user/upload',{
        method: 'post',
        headers: {'Content-Type':'multipart/form-data','Authorization':`Bearer ${token}`},
        data: data
    })
}

export default userUploadAPI;