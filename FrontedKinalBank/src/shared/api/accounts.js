import { axiosAuth } from "./api";

export const getAccounts = (page = 1, limit = 15) =>
  axiosAuth.get(`/accounts/listar?page=${page}&limit=${limit}`);

export const createAccount = (data) =>
  axiosAuth.post("/accounts/create", data);

export const updateAccount = (id, data) =>
  axiosAuth.put(`/accounts/${id}`, data);

export const deleteAccount = (id) =>
  axiosAuth.delete(`/accounts/${id}`);