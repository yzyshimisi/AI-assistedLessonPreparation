import { request } from "../request";

const loginAPI = async (data:{
    email:string,
    password:string,
}) => {
    return request("/api/user/login",{
        method: "post",
        headers: {"Content-Type":"application/json",},
        data: data,
    })
}

export default loginAPI;