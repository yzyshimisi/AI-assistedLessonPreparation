import { request } from "../../request";

const token = localStorage.getItem('token')

const collectFileAPI = async (data:{
    ids: Array<number>
}) => {
    return request('/api/disk/collect',{
        method: 'post',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data,
    })
}

export default collectFileAPI;