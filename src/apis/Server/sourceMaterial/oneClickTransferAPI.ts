import { request } from "../../request";

const token = localStorage.getItem('token')

const oneClickTransferAPI = async (data:{
    file_url: string,
    subject_name: string,
}) => {
    return request('/api/share/share_resource',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data
    })
}

export default oneClickTransferAPI;

