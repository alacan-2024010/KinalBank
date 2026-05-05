import { axiosAccount } from "./api";

// ── Cuentas del cliente autenticado ──────────────────────────────────────────
// GET /kinalBank/v1/client/accounts
export const getMyAccounts = () =>
    axiosAccount.get("/client/accounts");

// ── Transacciones del cliente ─────────────────────────────────────────────────
// GET /kinalBank/v1/client/transactions?page=1&limit=10
export const getMyTransactions = (page = 1, limit = 10) =>
    axiosAccount.get(`/client/transactions?page=${page}&limit=${limit}`);

// ── Crear transacción (transferencia) ─────────────────────────────────────────
// POST /kinalBank/v1/client/transactions/create
export const makeTransfer = (data) =>
    axiosAccount.post("/client/transactions/create", data);