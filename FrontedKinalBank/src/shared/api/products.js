import { coreApi } from "./api.js";

export const createProduct = (productData) => {
    return coreApi.post("/products/crear", productData);
}

export const getProducts = () =>
    coreApi.get("/products/listar");

export const updateProduct = (productId, updatedData) =>
    coreApi.put(`/products/actualizar/${productId}`, updatedData);

export const deleteProduct = (productId) =>
    coreApi.delete(`/products/eliminar/${productId}`);