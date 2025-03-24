import { request } from "../../request";

const token = localStorage.getItem('token')

const getDirStructureAPI = async (query:{
    parent_id: number
}) => {
    let url = `/api/disk/directory_structure?parent_id=${query.parent_id}`
    return request(url,{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getDirStructureAPI;