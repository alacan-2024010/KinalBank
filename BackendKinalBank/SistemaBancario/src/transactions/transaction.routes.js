import { Router } from "express";
import {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getMyTransactions        // ← NUEVO
} from "./transaction.controller.js";
import { validateJWT }    from "../middlewares/validate-jwt.js";
import { validateClient } from "../middlewares/validate-client.js";
import { validateAdmin }  from "../middlewares/validate-admin.js";

const router = new Router();

router.post(
    '/create',
    validateJWT,
    validateClient,
    createTransaction
);

// ⚠️ IMPORTANTE: esta ruta va ANTES de /:id
router.get(
    '/my-transactions',
    validateJWT,
    validateClient,
    getMyTransactions
);

router.get(
    '/listar',
    validateJWT,
    validateAdmin,
    getTransactions
);

router.get(
    '/:id',
    validateJWT,
    validateClient,
    getTransactionById
);

router.put(
    '/:id',
    validateJWT,
    validateClient,
    updateTransaction
);

router.delete(
    '/:id',
    validateJWT,
    validateClient,
    deleteTransaction
);

export default router;