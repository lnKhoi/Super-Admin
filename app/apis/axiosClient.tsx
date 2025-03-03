import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '~/constants/env.constant';

const axiosClient = axios.create({
    baseURL: API_URL,
    timeout: 200000,
    headers: { contentType: "application/json", "ngrok-skip-browser-warning": "true", },
});

axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("remix_us_tk");

        
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response.data,
    ({ message, response }) => {
        if (response?.status === 401) {
            localStorage.removeItem("remix_us_tk");
            window.location.replace("/login");
            return;
        }

        const errorMessage = response?.data?.message || response?.data?.error || message;
        const errorCode = response?.data?.code ?? -1;

        return Promise.reject({
            message: errorMessage,
            code: errorCode,
            status: response?.status ?? -1,
        });
    }
);

const getAuthHeaders = () => {
    const token = localStorage.getItem("remix_us_tk");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const getData = async (url: string, params = {}) => {
    try {
        const result = await axiosClient.get(url, { params, headers: getAuthHeaders() });
        return result;
    } catch (e) {
        throw e;
    }
};

const postData = async (url: string, data = {}) => {
    try {
        const result = await axiosClient.post(url, data, {
            headers: {
                ...getAuthHeaders(),
                "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json",
            },
        });
        return result;
    } catch (e) {
        throw e;
    }
};

const putData = async (url: string, data: any, isUpload = false) => {
    try {
        const headers = {
            ...getAuthHeaders(),
            "Content-Type": isUpload ? "multipart/form-data" : "application/json",
        };

        const payload = isUpload ? new FormData().append("upload", data) : data;

        const result = await axiosClient.put(url, payload, { headers });
        return result;
    } catch (e) {
        throw e;
    }
};

const deleteData = async (url: string, params = {}) => {
    try {
        const result = await axiosClient.delete(url, {
            params,
            headers: getAuthHeaders(),
        });
        return result;
    } catch (e) {
        throw e;
    }
};

const patchData = async (url: string, data = {}) => {
    try {
        const result = await axiosClient.patch(url, data, { headers: getAuthHeaders() });
        return result;
    } catch (e) {
        throw e;
    }
};

export { deleteData, getData, patchData, postData, putData };

export default axiosClient;
