import { request } from "../../request";

const token = localStorage.getItem('token')

const completelyDelAPI = async (data:{ids:Array<number>}) => {
    return request('/api/disk/recycle',{
        method: 'delete',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data:data
    })
}

export default completelyDelAPI;