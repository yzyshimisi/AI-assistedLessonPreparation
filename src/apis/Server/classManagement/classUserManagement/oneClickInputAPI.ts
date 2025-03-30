import { request } from "../../../request";

const token = localStorage.getItem('token')

const oneClickInputAPI = async (token:string,form_data:{
    file?: File,
    course_id?: number,
}) => {
    let _formData = new FormData();
    _formData.append('course_id',String(form_data.course_id))
    _formData.append('file',form_data.file)

    return request('/api/score/import',{
        method: 'post',
        headers: {"Content-Type":"multipart/form-data", 'Authorization':`Bearer ${token}`},
        data: _formData,
    })
}

export default oneClickInputAPI;