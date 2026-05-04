import { axiosAuth } from "./api";

export const login = async (data) => {
  return await axiosAuth.post("/auth/login", data);
};

export const register = async (data) => {
  return await axiosAuth.post("/auth/register", data);
};

export const forgotPassword = async (data) => {
  return await axiosAuth.put("/auth/forgot-password", data);
};