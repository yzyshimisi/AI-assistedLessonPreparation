import { request } from "../request";

const registerAPI = async (data:{
    username: string,
    email: string,
    password: string,
}) => {
    return request("/api/user/reg",{
        method: "post",
        headers: {"Content-Type":"application/json",},
        data: data,
    })
}

export default registerAPI;