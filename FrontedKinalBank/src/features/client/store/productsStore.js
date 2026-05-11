import { create } from "zustand";
import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} from "../../../shared/api/products.js";

export const useProductsStore = create((set) => ({
    products: [],
    loading: false,
    error: null,
    successMessage: null,

    createProduct: async (productData) => {
        set({ loading: true, error: null, successMessage: null });

        try {
            const { data } = await createProduct(productData);

            set((state) => ({
                products: [...state.products, data.product],
                successMessage: data.message ?? "Producto creado correctamente",
                loading: false
            }));

            return { success: true };

        } catch (err) {

            const msg =
                err.response?.data?.message ??
                "Error al crear producto";

            set({
                error: msg,
                loading: false
            });

            return {
                success: false,
                message: msg
            };
        }
    },

    fetchProducts: async () => {
        set({
            loading: true,
            error: null
        });

        try {

            const { data } = await getProducts();

            set({
                products: data.products ?? [],
                loading: false
            });

        } catch (err) {

            set({
                error:
                    err.response?.data?.message ??
                    "Error al cargar productos",
                loading: false
            });
        }
    },

    updateProduct: async (productId, updatedData) => {
        set({
            loading: true,
            error: null,
            successMessage: null
        });

        try {

            const { data } = await updateProduct(productId, updatedData);

            set((state) => ({
                products: state.products.map((p) =>
                    p._id === productId
                        ? { ...p, ...data.product }
                        : p
                ),
                successMessage:
                    data.message ??
                    "Producto actualizado correctamente",
                loading: false
            }));

            return { success: true };

        } catch (err) {

            const msg =
                err.response?.data?.message ??
                "Error al actualizar producto";

            set({
                error: msg,
                loading: false
            });

            return {
                success: false,
                message: msg
            };
        }
    },

    deleteProduct: async (productId) => {
        set({
            loading: true,
            error: null,
            successMessage: null
        });

        try {

            const { data } = await deleteProduct(productId);

            set((state) => ({
                products: state.products.filter(
                    (p) => p._id !== productId
                ),
                successMessage:
                    data.message ??
                    "Producto eliminado correctamente",
                loading: false
            }));

            return { success: true };

        } catch (err) {

            const msg =
                err.response?.data?.message ??
                "Error al eliminar producto";

            set({
                error: msg,
                loading: false
            });

            return {
                success: false,
                message: msg
            };
        }
    }
}));