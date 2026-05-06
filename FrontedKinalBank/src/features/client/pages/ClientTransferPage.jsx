import { useEffect, useState } from "react";
import { useClientStore } from "../store/clientStore.js";
import { TransferModal } from "../components/TransferModal.jsx";

const CURRENCY_SYMBOLS = {
    GTQ: "Q",
    USD: "$",
    EUR: "€",
    GBP: "£",
    MXN: "MX$",
    CAD: "C$",
    JPY: "¥",
    CHF: "Fr",
    BRL: "R$",
    COP: "COL$",
};

const getCurrencySymbol = (currency) =>
    CURRENCY_SYMBOLS[currency] ?? currency ?? "Q";

export const ClientTransferPage = () => {
    const {
        accounts, loadingTransfer, transferError, transferSuccess,
        fetchMyAccounts, transfer, clearTransferState,
    } = useClientStore();

    const [form, setForm] = useState({ fromAccount: "", toAccount: "", amount: "", description: "" });
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        fetchMyAccounts();
        return () => clearTransferState();
    }, []);

    const activeAccounts      = accounts.filter(a => a.status === "ACTIVA");
    const handleChange        = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = () => {
        if (!form.fromAccount || !form.toAccount || !form.amount) return;
        clearTransferState();
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        const result = await transfer({
            type:        "TRANSFERENCIA",
            fromAccount: form.fromAccount,
            toAccount:   form.toAccount,
            amount:      Number(form.amount),
            description: form.description || "Transferencia entre cuentas",
        });
        if (result.success) setForm({ fromAccount: "", toAccount: "", amount: "", description: "" });
    };

    const selectedAccount     = accounts.find(a => a._id === form.fromAccount);
    const toAccount = accounts.find(
        a => a.accountNumber === form.toAccount
    );
    const symbol              = getCurrencySymbol(selectedAccount?.currency);
    const destinationAccounts = activeAccounts.filter(a => a._id !== form.fromAccount);
    const canSubmit           = !!(form.fromAccount && form.toAccount && form.amount && !loadingTransfer);
    const amountPct           = Math.min((Number(form.amount) / 2000) * 100, 100);
    const barColor            = amountPct >= 90 ? "bg-red-500" : amountPct >= 60 ? "bg-amber-400" : "bg-indigo-500";

    // Aviso de conversión si las monedas son distintas
    const willConvert = selectedAccount && toAccount &&
        selectedAccount.currency !== toAccount.currency;

    return (
        <>
            <TransferModal
                open={showConfirm}
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirm(false)}
                data={form}
                accounts={accounts}
                loading={loadingTransfer}
            />

            <div className="max-w-2xl mx-auto space-y-5">

                {/* HEADER */}
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">
                        Transferir fondos
                    </h1>
                    <p className="text-base text-slate-600 mt-1">
                        Mueve dinero entre tus cuentas activas de forma segura e inmediata.
                    </p>
                </div>

                {/* ALERTAS */}
                {transferSuccess && (
                    <div className="bg-green-50 border border-green-100 text-green-700 rounded-2xl px-5 py-4 flex items-center gap-3 font-medium">
                        <span className="text-xl">✅</span> {transferSuccess}
                    </div>
                )}

                {transferError && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 flex items-center gap-3 font-medium">
                        <span className="text-xl">⚠️</span> {transferError}
                    </div>
                )}

                {/* CARD */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                    {/* HEADER CARD */}
                    <div className="bg-slate-900 px-7 py-6 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl">
                            💸
                        </div>
                        <div>
                            <p className="text-white font-bold">Nueva transferencia</p>
                            <p className="text-white/40 text-sm">
                                Límite: 2,000 por operación · 10,000 diarios
                            </p>
                        </div>
                    </div>

                    <div className="p-7 space-y-6">

                        {/* ORIGEN + DESTINO */}
                        <div className="grid grid-cols-2 gap-5">

                            {/* ORIGEN */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                    Cuenta origen
                                </label>

                                <div className="flex items-center gap-2">
                                    <span className="text-lg">💳</span>
                                    <select
                                        name="fromAccount"
                                        value={form.fromAccount}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm"
                                    >
                                        <option value="">Selecciona…</option>
                                        {activeAccounts.map(acc => (
                                            <option key={acc._id} value={acc._id}>
                                                {acc.accountNumber} · {getCurrencySymbol(acc.currency)}{" "}
                                                {Number(acc.balance).toLocaleString("es-GT", {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* DESTINO */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                    Cuenta destino
                                </label>

                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🏦</span>
                                    <input
                                        type="text"
                                        name="toAccount"
                                        value={form.toAccount}
                                        onChange={handleChange}
                                        placeholder="Número de cuenta destino"
                                        className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm"
                                    />
                                </div>

                                {form.fromAccount && destinationAccounts.length === 0 && (
                                    <p className="text-xs text-amber-500 mt-1">
                                        Sin cuentas destino disponibles.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* CONVERSIÓN */}
                        {willConvert && (
                            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-2.5">
                                <span>🔄</span>
                                <p className="text-xs text-amber-700 font-medium">
                                    Conversión automática de{" "}
                                    <strong>{selectedAccount.currency}</strong> →{" "}
                                    <strong>{toAccount.currency}</strong>
                                </p>
                            </div>
                        )}

                        {/* MONTO */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                Monto
                            </label>

                            <div className="flex items-center gap-3">
                                <div className="h-14 px-4 flex flex-col items-center justify-center bg-slate-100 border rounded-xl">
                                    <span className="font-bold">{symbol}</span>
                                    {selectedAccount && (
                                        <span className="text-[10px] text-slate-400">
                                            {selectedAccount.currency}
                                        </span>
                                    )}
                                </div>

                                <input
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="flex-1 border rounded-xl px-4 py-3 text-3xl font-bold"
                                />
                            </div>

                            {Number(form.amount) > 0 && (
                                <div className="mt-3">
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${barColor}`}
                                            style={{ width: `${amountPct}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* DESCRIPCIÓN */}
                        <input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Descripción opcional"
                            className="w-full border rounded-xl px-4 py-3 text-sm"
                        />

                        {/* BOTÓN */}
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold disabled:opacity-40"
                        >
                            {loadingTransfer ? "Procesando…" : "Continuar"}
                        </button>
                    </div>
                </div>

                {/* Mini cards informativas */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-xl mb-3">🛡️</div>
                        <p className="text-lg font-extrabold text-slate-900 mb-1 tracking-tight">Transferencia segura</p>
                        <p className="text-sm text-slate-600 leading-relaxed">Tus movimientos están cifrados de extremo a extremo.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-xl mb-3">⚡</div>
                        <p className="text-lg font-extrabold text-slate-900 mb-1 tracking-tight">Tiempo real</p>
                        <p className="text-sm text-slate-600 leading-relaxed">El saldo se actualiza al instante en ambas cuentas.</p>
                    </div>
                </div>

                <div className="text-center">
                    <p className="inline-block text-sm text-amber-900 bg-amber-100 px-4 py-2 rounded-lg font-semibold border border-amber-200 shadow-sm">
                        Las transferencias son procesadas en tiempo real. Verifica bien la cuenta destino.
                    </p>
                </div>
            </div>
        </>
    );
};
