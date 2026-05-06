import Transaction from './transaction.model.js';
import Account from '../accounts/account.model.js';
import { convertirMoneda } from "../services/divisas-service.js";

export const createTransaction = async (req, res) => {
    try {
        const { type, amount, fromAccount, toAccount, description } = req.body;

        // ─────────────────────────────
        // VALIDACIÓN BÁSICA
        // ─────────────────────────────
        if (!type || !amount || !fromAccount || !description) {
            return res.status(400).json({
                success: false,
                message: "Datos incompletos para la transacción"
            });
        }

        const amountNumber = Number(amount);

        if (isNaN(amountNumber) || amountNumber <= 0) {
            return res.status(400).json({
                success: false,
                message: "Monto inválido"
            });
        }

        // ─────────────────────────────
        // CUENTAS (por accountNumber)
        // ─────────────────────────────
        const sourceAccount = await Account.findOne({ accountNumber: fromAccount });

        if (!sourceAccount) {
            return res.status(404).json({
                success: false,
                message: "Cuenta de origen no encontrada"
            });
        }

        const destinationAccount = toAccount
            ? await Account.findOne({ accountNumber: toAccount })
            : null;

        if (toAccount && !destinationAccount) {
            return res.status(404).json({
                success: false,
                message: "Cuenta de destino no encontrada"
            });
        }

        // ─────────────────────────────
        // LÍMITE POR OPERACIÓN: 2,000
        // ─────────────────────────────
        if (type === "TRANSFERENCIA" && amountNumber > 2000) {
            return res.status(400).json({
                success: false,
                message: `No puede transferir más de 2,000 ${sourceAccount.currency} por operación`
            });
        }

        // ─────────────────────────────
        // LÍMITE DIARIO: 10,000
        // ─────────────────────────────
        if (type === "TRANSFERENCIA") {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const transaccionesHoy = await Transaction.find({
                fromAccount: sourceAccount._id,
                type: "TRANSFERENCIA",
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });

            const totalHoy = transaccionesHoy.reduce(
                (sum, t) => sum + t.amountSent, 0
            );

            if (totalHoy + amountNumber > 10000) {
                const disponible = 10000 - totalHoy;
                return res.status(400).json({
                    success: false,
                    message: `Límite diario de 10,000 ${sourceAccount.currency} alcanzado. Disponible hoy: ${disponible.toFixed(2)} ${sourceAccount.currency}`
                });
            }
        }

        // ─────────────────────────────
        // SALDO
        // ─────────────────────────────
        if (sourceAccount.balance < amountNumber) {
            return res.status(400).json({
                success: false,
                message: "Saldo insuficiente"
            });
        }

        // ─────────────────────────────
        // CONVERSIÓN SEGURA
        // ─────────────────────────────
        let finalAmount = amountNumber;
        let exchangeRate = 1;

        if (
            destinationAccount &&
            sourceAccount.currency !== destinationAccount.currency
        ) {
            try {
                const conversion = await convertirMoneda(
                    sourceAccount.currency,
                    destinationAccount.currency,
                    amountNumber
                );

                console.log("🔁 CONVERSIÓN:", conversion);

                finalAmount = conversion?.montoConvertido ?? amountNumber;
                exchangeRate = conversion?.tasa ?? 1;

            } catch (error) {
                console.error("❌ ERROR DIVISAS:", error.message);
                finalAmount = amountNumber;
                exchangeRate = 1;
            }
        }

        // ─────────────────────────────
        // ACTUALIZAR SALDOS
        // ─────────────────────────────
        sourceAccount.balance -= amountNumber;

        if (destinationAccount) {
            destinationAccount.balance += finalAmount;
            await destinationAccount.save();
        }

        await sourceAccount.save();

        // ─────────────────────────────
        // CREAR TRANSACCIÓN
        // ─────────────────────────────
        const transaction = new Transaction({
            type,
            amountSent: amountNumber,
            amountReceived: finalAmount,
            currencyFrom: sourceAccount.currency,
            currencyTo: destinationAccount?.currency || sourceAccount.currency,
            exchangeRate,
            fromAccount: sourceAccount._id,
            toAccount: destinationAccount ? destinationAccount._id : null,
            description,
            ownerId: req.user.id
        });

        await transaction.save();

        return res.status(201).json({
            success: true,
            message: "Transacción realizada con éxito",
            transaction
        });

    } catch (error) {
        console.error("💥 CREATE TRANSACTION ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Error interno al realizar la transacción",
            error: error.message
        });
    }
};

export const getTransactions = async (req, res) => {
    const transactions = await Transaction.find()
        .populate('fromAccount', 'accountNumber balance')
        .populate('toAccount', 'accountNumber');

    res.json({
        success: true,
        data: transactions
    });
};

export const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id)
            .populate('fromAccount')
            .populate('toAccount');

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transacción no encontrada' });
        }

        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({
                success: false,
                message: 'Debe enviar una descripción'
            });
        }

        const transaction = await Transaction.findById(id);

        if (!transaction) {
            return res.status(400).json({
                success: false,
                message: 'Transacción no encontrada'
            });
        }

        const fiveMinutes = 5 * 60 * 1000;
        const now = new Date();
        const createdAt = new Date(transaction.createdAt);

        if (now - createdAt > fiveMinutes) {
            return res.status(400).json({
                success: false,
                message: 'Solo puede modificar la transacción dentro de los primeros 5 minutos'
            });
        }

        transaction.description = description;
        await transaction.save();

        res.status(200).json({
            success: true, data: transaction
        });
    } catch (error) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByIdAndDelete(id);

        if (!transaction) {
            return res.status(404).json({
                success: false, message: 'Transacción no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Registro de transacción eliminado'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};