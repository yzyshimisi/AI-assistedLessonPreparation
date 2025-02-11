import { request } from "../../request";

const token = localStorage.getItem('token')

const modifyFileNameAPI = async (data:{
    id: number,
    name: string,
}) => {
    return request('/api/disk/directory',{
        method: "put",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default modifyFileNameAPI;