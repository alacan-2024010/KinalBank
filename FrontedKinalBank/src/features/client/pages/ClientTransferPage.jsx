import { useEffect, useState } from "react";
import { useClientStore } from "../store/clientStore.js";

export const ClientTransferPage = () => {
    const {
        accounts,
        loadingTransfer,
        transferError,
        transferSuccess,
        fetchMyAccounts,
        transfer,
        clearTransferState,
    } = useClientStore();

    const [form, setForm] = useState({
        fromAccount: "",   // _id de la cuenta origen
        toAccount: "",     // _id de la cuenta destino
        amount: "",
        description: "",
    });

    useEffect(() => {
        fetchMyAccounts();
        return () => clearTransferState();
    }, []);

    const activeAccounts = accounts.filter(a => a.status === "ACTIVA");

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async () => {
        if (!form.fromAccount || !form.toAccount || !form.amount) return;
        clearTransferState();

        const result = await transfer({
            type: "TRANSFERENCIA",
            fromAccount: form.fromAccount,
            toAccount: form.toAccount,
            amount: Number(form.amount),
            description: form.description || "Transferencia entre cuentas",
        });

        if (result.success) {
            setForm({ fromAccount: "", toAccount: "", amount: "", description: "" });
        }
    };

    const selectedAccount = accounts.find(a => a._id === form.fromAccount);
    const symbol = selectedAccount?.currency === "GTQ" ? "Q" : "$";

    // Cuentas disponibles como destino (todas excepto la origen)
    const destinationAccounts = activeAccounts.filter(a => a._id !== form.fromAccount);

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Transferir fondos</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Transfiere dinero entre tus cuentas activas. Límite: 2,000 por transferencia y 10,000 diarios.
                </p>
            </div>

            {transferSuccess && (
                <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                    <span>✅</span> {transferSuccess}
                </div>
            )}

            {transferError && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                    <span>⚠️</span> {transferError}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

                {/* Cuenta origen */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Cuenta origen
                    </label>
                    <select
                        name="fromAccount"
                        value={form.fromAccount}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white"
                    >
                        <option value="">Selecciona una cuenta…</option>
                        {activeAccounts.map((acc) => (
                            <option key={acc._id} value={acc._id}>
                                {acc.accountNumber} — {acc.currency === "GTQ" ? "Q" : "$"}{" "}
                                {Number(acc.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })} ({acc.currency})
                            </option>
                        ))}
                    </select>
                    {selectedAccount && (
                        <p className="text-[11px] text-gray-400 mt-1">
                            Saldo disponible: {symbol}{" "}
                            {Number(selectedAccount.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                        </p>
                    )}
                </div>

                {/* Cuenta destino */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Cuenta destino
                    </label>
                    <select
                        name="toAccount"
                        value={form.toAccount}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white"
                    >
                        <option value="">Selecciona cuenta destino…</option>
                        {destinationAccounts.map((acc) => (
                            <option key={acc._id} value={acc._id}>
                                {acc.accountNumber} ({acc.currency})
                            </option>
                        ))}
                    </select>
                    {form.fromAccount && destinationAccounts.length === 0 && (
                        <p className="text-[11px] text-amber-500 mt-1">
                            No tienes otras cuentas activas disponibles como destino.
                        </p>
                    )}
                </div>

                {/* Monto */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Monto
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono">
                            {selectedAccount ? symbol : "Q"}
                        </span>
                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0.01"
                            max="2000"
                            step="0.01"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pl-8 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                        />
                    </div>
                    <p className="text-[11px] text-gray-300 mt-1">Máximo 2,000 por transferencia</p>
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Descripción <span className="text-gray-300 font-normal">(opcional)</span>
                    </label>
                    <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Ej. Pago de servicio, préstamo…"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loadingTransfer || !form.fromAccount || !form.toAccount || !form.amount}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {loadingTransfer ? "Procesando…" : "Realizar transferencia →"}
                </button>
            </div>

            <p className="text-center text-[11px] text-gray-300">
                Las transferencias son procesadas en tiempo real. Verifica bien la cuenta destino.
            </p>
        </div>
    );
};