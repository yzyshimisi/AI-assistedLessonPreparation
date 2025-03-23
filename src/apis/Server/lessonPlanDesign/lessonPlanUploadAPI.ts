import { request } from "../../request";

const token = localStorage.getItem('token')

const lessonPlanUploadAPI = (data:{
    file: File
}) => {
    let formData = new FormData()
    formData.append('file',data.file)
    return request('/api/lesson/upload_file',{
        method: "post",
        headers: {"Content-Type":"multipart/form-data", 'Authorization':`Bearer ${token}`},
        data: formData
    })
}

export default lessonPlanUploadAPI;