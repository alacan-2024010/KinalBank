import { create } from "zustand";
import {
    createProduct as apiCreateProduct,
    getProducts as apiGetProducts,
    updateProduct as apiUpdateProduct,
    deleteProduct as apiDeleteProduct
} from "../../../shared/api/products.js";

export const useProductsStore = create((set, get) => ({
    products: [],
    loading: false,
    error: null,
    successMessage: null,

    // Obtener todos los productos
    fetchProducts: async () => {
        set({ loading: true, error: null });

        try {
            const { data } = await apiGetProducts();
            set({
                products: data.products ?? [],
                loading: false
            });
        } catch (err) {
            set({
                error: err.response?.data?.message ?? "Error al cargar productos",
                loading: false
            });
        }
    },

    // Crear un producto
    createProduct: async (productData) => {
        set({ loading: true, error: null, successMessage: null });

        try {
            const { data } = await apiCreateProduct(productData);

            set((state) => ({
                products: [data.product ?? data, ...state.products],
                successMessage: "Producto creado correctamente",
                loading: false
            }));

            return data.product ?? data;
        } catch (err) {
            set({
                error: err.response?.data?.message ?? "Error al crear producto",
                loading: false
            });
            throw err;
        }
    },

    // Actualizar un producto
    updateProduct: async (productId, updatedData) => {
        set({ loading: true, error: null, successMessage: null });

        try {
            const { data } = await apiUpdateProduct(productId, updatedData);

            set((state) => ({
                products: state.products.map((p) =>
                    p._id === productId ? data.product ?? data : p
                ),
                successMessage: "Producto actualizado correctamente",
                loading: false
            }));

            return data.product ?? data;
        } catch (err) {
            set({
                error: err.response?.data?.message ?? "Error al actualizar producto",
                loading: false
            });
            throw err;
        }
    },

    // Eliminar un producto
    deleteProduct: async (productId) => {
        set({ loading: true, error: null, successMessage: null });

        try {
            await apiDeleteProduct(productId);

            set((state) => ({
                products: state.products.filter((p) => p._id !== productId),
                successMessage: "Producto eliminado correctamente",
                loading: false
            }));
        } catch (err) {
            set({
                error: err.response?.data?.message ?? "Error al eliminar producto",
                loading: false
            });
            throw err;
        }
    }
}));