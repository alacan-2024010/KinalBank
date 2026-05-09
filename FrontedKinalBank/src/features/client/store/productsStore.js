import { create } from "zustand";
import { getProducts } from "../../../shared/api/products.js";

export const useProductsStore = create((set) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
        const { data } = await getProducts();
        set({ products: data.products ?? [] });
        } catch (err) {
        set({ error: err.response?.data?.message ?? "Error al cargar productos" });
        } finally {
        set({ loading: false });
        }
    },
}));