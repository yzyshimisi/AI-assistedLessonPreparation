import { request } from "../request";

const sendVerificationCodeAPI = async (data:{email:string}) => {
    return request("/api/email/code",{
        method: "post",
        headers: {"Content-Type":"application/json",},
        data: data,
    })
}

export default sendVerificationCodeAPI;