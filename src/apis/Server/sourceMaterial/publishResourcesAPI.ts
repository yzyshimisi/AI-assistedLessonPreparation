import { request } from "../../request";

const token = localStorage.getItem('token')

const publishResourcesAPI = async (data:{
    resource_type: number,
    title: string,
    content: string,
    cover_img?: string,
}) => {
    return request('/api/share/resource',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data,
    })
}

export default publishResourcesAPI;