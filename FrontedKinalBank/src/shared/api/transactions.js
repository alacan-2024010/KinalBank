import { axiosTransaction } from "./api.js";

export const makeTransfer = (data) =>
    axiosTransaction.post("/transactions/create", data);

export const getTransactionById = (id) =>
    axiosTransaction.get(`/transactions/${id}`);