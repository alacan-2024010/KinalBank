import { coreApi } from "./api.js";

export const getProducts = () =>
    coreApi.get("/products/listar");