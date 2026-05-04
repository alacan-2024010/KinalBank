// front/src/shared/api/users.js
import { axiosAuth } from "./api";

export const getPendingUsers = () =>
  axiosAuth.get("/users/pending");

export const approveUser = (userId, role = "CLIENT") =>
  axiosAuth.put("/users/approve", { userId, role });