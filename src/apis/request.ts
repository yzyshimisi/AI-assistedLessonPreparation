import axios, { type AxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
    baseURL: '/api',
    timeout: 30000,
})

const request = <ResponseType = unknown>(
    url: string,
    options?: AxiosRequestConfig<unknown>,
): Promise<ResponseType> => {
    return new Promise((resolve, reject) => {
        axiosInstance({
            url,
            ...options,
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => reject(err))
    })
}
export { axiosInstance, request }