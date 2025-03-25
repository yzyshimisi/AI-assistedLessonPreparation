import { request } from "../../request";

const token = localStorage.getItem('token')

const resourceFileUploadAPI = async (data:{
    file: File
}) => {
    let formFile = new FormData()
    formFile.append('file',data.file)
    return request('/api/share/share_file',{
        method: "post",
        headers: {"Content-Type":"multipart/form-data", 'Authorization':`Bearer ${token}`},
        data: formFile,
    })
}

export default resourceFileUploadAPI;