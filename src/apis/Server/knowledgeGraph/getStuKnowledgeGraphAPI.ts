import { request } from "../../request";

const getStuKnowledgeGraphAPI = async (token:string) => {
    return request('/api/graph/student_graph',{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getStuKnowledgeGraphAPI;