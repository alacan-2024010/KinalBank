import { coreApi } from "./api.js";

export const createProduct = (productData) => {
    return coreApi.post("/products/create", productData);
}

export const getProducts = () =>
    coreApi.get("/products/listar");

export const updateProduct = (productId, updatedData) =>
    coreApi.put(`/products/update/${productId}`, updatedData);

export const deleteProduct = (productId) =>
    coreApi.delete(`/products/delete/${productId}`);