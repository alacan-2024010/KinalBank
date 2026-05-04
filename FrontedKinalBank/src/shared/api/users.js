
import { axiosAuth } from "./api";

export const getPendingUsers = () =>
  axiosAuth.get("/users/pending");

export const approveUser = (userId, role = "CLIENT") =>
  axiosAuth.put("/users/approve", { userId, role });