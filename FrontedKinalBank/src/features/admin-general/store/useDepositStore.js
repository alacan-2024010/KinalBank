import { create } from "zustand";

import {
    getDepositsRequest,
    createDepositRequest,
    revertDepositRequest,
    deleteDepositRequest,
    getDepositByIdRequest,
    updateDepositRequest
} from "../services/depositService.js";

export const useDepositStore = create((set, get) => ({

    deposits: [],
    selectedDeposit: null,
    isLoading: false,

    getDeposits: async () => {
        try {
            set({ isLoading: true });
            const response = await getDepositsRequest();
            if (response.data.success) {
                set({
                    deposits: response.data.deposits
                });
            }

        } catch (error) {
            console.log("ERROR GET DEPOSITS:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    createDeposit: async (data) => {
        try {
            set({ isLoading: true });
            const response = await createDepositRequest(data);
            if (response.data.success) {
                await get().getDeposits();
            }
            return response.data;
        } catch (error) {
            console.log("ERROR CREATE DEPOSIT:", error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    revertDeposit: async (id) => {
        try {
            set({ isLoading: true });
            const response = await revertDepositRequest(id);
            if (response.data.success) {

                await get().getDeposits();
            }

            return response.data;
        } catch (error) {
            console.log("ERROR REVERT DEPOSIT:", error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteDeposit: async (id) => {
        try {
            set({ isLoading: true });
            const response = await deleteDepositRequest(id);
            if (response.data.success) {
                await get().getDeposits();
            }
            return response.data;
        } catch (error) {
            console.log("ERROR DELETE DEPOSIT:", error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getDepositById: async (id) => {

        try {

            set({ isLoading: true });

            const response = await getDepositByIdRequest(id);

            if (response.data.success) {

                set({
                    selectedDeposit: response.data.data
                });
            }

            return response.data;

        } catch (error) {

            console.log("ERROR GET DEPOSIT BY ID:", error);

            throw error;

        } finally {

            set({ isLoading: false });
        }
    },

    updateDeposit: async (id, data) => {

        try {

            set({ isLoading: true });

            const response = await updateDepositRequest(
                id,
                data
            );

            if (response.data.success) {

                await get().getDeposits();
            }

            return response.data;

        } catch (error) {

            console.log("ERROR UPDATE DEPOSIT:", error);

            throw error;

        } finally {

            set({ isLoading: false });
        }
    }

}));