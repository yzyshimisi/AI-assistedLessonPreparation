import { request } from "../../request";

const token = localStorage.getItem('token')

const searchFileAPI = async (key:string) => {
    let url = '/api/disk/find?key='.concat(key)
    return request(url,{
        method: 'get',
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default searchFileAPI;