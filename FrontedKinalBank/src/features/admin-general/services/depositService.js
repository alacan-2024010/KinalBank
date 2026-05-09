import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3006/kinalBank/v1",
    timeout: 5000
});

apiClient.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getDepositsRequest = async () => {
    return await apiClient.get("/deposits");
};


export const createDepositRequest = async (data) => {
    return await apiClient.post(
        "/deposits/create",
        data
    );
};


export const revertDepositRequest = async (id) => {
    return await apiClient.put(
        `/deposits/revert/${id}`
    );
};

export const deleteDepositRequest = async (id) => {
    return await apiClient.delete(
        `/deposits/${id}`
    );
};


export const getDepositByIdRequest = async (id) => {
    return await apiClient.get(
        `/deposits/${id}`
    );
};


export const updateDepositRequest = async (id, data) => {
    return await apiClient.put(
        `/deposits/update/${id}`,
        data
    );
};