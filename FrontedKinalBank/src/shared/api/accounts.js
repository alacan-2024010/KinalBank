import { axiosAccount } from "./api";

export const getAccounts = (page = 1, limit = 15) =>
  axiosAccount.get(`/accounts/listar?page=${page}&limit=${limit}`);

export const createAccount = (data) =>
  axiosAccount.post("/accounts/create", data);

export const updateAccount = (id, data) =>
  axiosAccount.put(`/accounts/${id}`, data);

export const deleteAccount = (id) =>
  axiosAccount.delete(`/accounts/${id}`);