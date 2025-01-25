import axios, { type AxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
    baseURL:"http://127.0.0.1:4523/m1/5780860-0-default",
    timeout: 10000,
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