import { request } from "../request";

const findPasswordAPI = async (data:{
    email: string,
    code: string,
    new_password: string,
}) => {
    return request("/api/user/findpwd",{
        method: "put",
        headers: {"Content-Type":"application/json",},
        data: data,
    })
}

export default findPasswordAPI;