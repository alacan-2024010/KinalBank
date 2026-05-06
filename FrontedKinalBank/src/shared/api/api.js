import axios from "axios";

const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json"
  }
});

const axiosAccount = axios.create({
  baseURL: import.meta.env.VITE_ACCOUNT_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json"
  }
})

const axiosTransaction = axios.create({
  baseURL: import.meta.env.VITE_TRANSACTION_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json"
  }
})

axiosAuth.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axiosAccount.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axiosTransaction.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) { 
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export { axiosAuth , axiosAccount, axiosTransaction};