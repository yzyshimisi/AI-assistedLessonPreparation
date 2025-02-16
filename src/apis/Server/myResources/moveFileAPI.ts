import { request } from "../../request";

const token = localStorage.getItem('token')

const moveFileAPI = async (data:{
    ids: Array<number>,
    parent_id: number,
}) => {
    return request('/api/disk/move',{
        method: 'post',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data:data,
    })
}

export default moveFileAPI;