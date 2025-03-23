import { request } from "../../request";

const token = localStorage.getItem('token')

const createShareAPI = async (data:{
    ids: Array<number>,
    validity: number,
    code: string,
}) => {
    return request('/api/disk/share',{
        method: 'post',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default createShareAPI;