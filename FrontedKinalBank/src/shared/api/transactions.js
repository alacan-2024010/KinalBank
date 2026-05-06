import { axiosTransaction } from "./api";

export const getTransactions = (page = 1, limit = 15) =>
    axiosTransaction.get(`/transactions/listar?page=${page}&limit=${limit}`);

export const createTransaction = (data) =>
    axiosTransaction.post("/transactions/create", data);

export const updateTransaction = (id, data) =>
    axiosTransaction.put(`/transactions/${id}`, data);

export const deleteTransaction = (id) =>
    axiosTransaction.delete(`/transactions/${id}`);