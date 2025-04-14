import { request } from "../../request";

const generateKnowledgeGraphAPI = async (token:string, data:{
    session_id: number
}) => {
    return request('/api/graph/material_generate',{
        method: "post",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
        data: data,
    })
}

export default generateKnowledgeGraphAPI;