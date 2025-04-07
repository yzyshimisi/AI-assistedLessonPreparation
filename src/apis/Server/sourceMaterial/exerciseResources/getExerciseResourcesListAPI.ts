import { request } from "../../../request";

const getExerciseResourcesListAPI = async (token:string) => {
    return request('/api/lesson/exercise_list',{
        method: "get",
        headers: {"Content-Type":"application/json", 'Authorization':`Bearer ${token}`},
    })
}

export default getExerciseResourcesListAPI;