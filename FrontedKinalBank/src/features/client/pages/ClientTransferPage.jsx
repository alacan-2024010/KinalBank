import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useClientStore } from "../store/useClientStore.js";
import { TransferModal } from "../components/TransferModal.jsx";

const CURRENCY_SYMBOLS = {
    GTQ: "Q", USD: "$", EUR: "€", GBP: "£", MXN: "MX$",
    CAD: "C$", JPY: "¥", CHF: "Fr", BRL: "R$", COP: "COL$",
};

const getCurrencySymbol = (currency) =>
    CURRENCY_SYMBOLS[currency] ?? currency ?? "Q";

export const ClientTransferPage = () => {
    const location = useLocation();
    const prefill  = location.state ?? {};   // { toAccount, alias } si viene de Favoritos

    const {
        accounts, loadingTransfer, transferError, transferSuccess,
        fetchMyAccounts, transfer, clearTransferState,
    } = useClientStore();

    const [form, setForm] = useState({
        fromAccount: "",
        toAccount:   prefill.toAccount ?? "",
        amount:      "",
        description: prefill.alias ? `Transferencia a ${prefill.alias}` : "",
    });
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        fetchMyAccounts();
        return () => clearTransferState();
    }, []);

    const activeAccounts    = accounts.filter(a => a.status === "ACTIVA");
    const handleChange      = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = () => {
        if (!form.fromAccount || !form.toAccount || !form.amount) return;
        clearTransferState();
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        const fromAccountObj = accounts.find(a => a._id === form.fromAccount);
        const result = await transfer({
            type:        "TRANSFERENCIA",
            fromAccount: fromAccountObj?.accountNumber ?? form.fromAccount,
            toAccount:   form.toAccount,
            amount:      Number(form.amount),
            description: form.description || "Transferencia entre cuentas",
        });
        if (result.success) {
            setForm({ fromAccount: "", toAccount: "", amount: "", description: "" });
        }
    };

    const selectedAccount     = accounts.find(a => a._id === form.fromAccount);
    const toAccount           = accounts.find(a => a.accountNumber === form.toAccount);
    const symbol              = getCurrencySymbol(selectedAccount?.currency);
    const destinationAccounts = activeAccounts.filter(a => a._id !== form.fromAccount);
    const toAccountComplete   = form.toAccount.length === 10;
    const canSubmit           = !!(form.fromAccount && toAccountComplete && form.amount && !loadingTransfer);
    const amountPct           = Math.min((Number(form.amount) / 2000) * 100, 100);
    const barColor            = amountPct >= 90 ? "bg-red-500" : amountPct >= 60 ? "bg-amber-400" : "bg-emerald-500";
    const willConvert         = selectedAccount && toAccount && selectedAccount.currency !== toAccount.currency;

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

                {/* Encabezado */}
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Transferir fondos</h1>
                    <p className="text-base text-slate-600 mt-1">
                        Mueve dinero entre tus cuentas activas de forma segura e inmediata.
                    </p>
                </div>

                {/* Banner de favorito pre-cargado */}
                {prefill.toAccount && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3.5 flex items-center gap-3">
                        <span className="text-xl">⭐</span>
                        <div>
                            <p className="text-sm font-semibold text-indigo-800">
                                Transferencia a favorito
                            </p>
                            <p className="text-xs text-indigo-500 font-mono mt-0.5">
                                {prefill.alias && <span className="mr-2 not-italic">{prefill.alias} ·</span>}
                                {prefill.toAccount}
                            </p>
                        </div>
                    </div>
                )}

                {/* Alertas */}
                {transferSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-base rounded-2xl px-5 py-4 flex items-center gap-3 font-medium">
                        <span className="text-xl">✅</span> {transferSuccess}
                    </div>
                )}
                {transferError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-base rounded-2xl px-5 py-4 flex items-center gap-3 font-medium">
                        <span className="text-xl">⚠️</span> {transferError}
                    </div>
                )}

                {/* Card principal */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                    {/* Header */}
                    <div className="bg-slate-900 px-7 py-6 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl flex-shrink-0">
                            💸
                        </div>
                        <div>
                            <p className="text-white font-bold text-base">Nueva transferencia</p>
                            <p className="text-white/40 text-sm mt-0.5">Límite: 2,000 por operación · 10,000 diarios</p>
                        </div>
                    </div>

                    <div className="p-7 space-y-6">

                        {/* Fila: origen + destino */}
                        <div className="grid grid-cols-2 gap-5">

                            {/* Cuenta origen */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    Cuenta origen
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg pointer-events-none">💳</span>
                                    <select
                                        name="fromAccount"
                                        value={form.fromAccount}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 appearance-none cursor-pointer"
                                    >
                                        <option value="">Selecciona…</option>
                                        {activeAccounts.map(acc => (
                                            <option key={acc._id} value={acc._id}>
                                                {acc.accountNumber} · {getCurrencySymbol(acc.currency)}
                                                {Number(acc.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })} ({acc.currency})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selectedAccount && (
                                    <p className="text-xs text-slate-400 mt-1.5">
                                        Disponible: {symbol} {Number(selectedAccount.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })} {selectedAccount.currency}
                                    </p>
                                )}
                            </div>

                            {/* Cuenta destino */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    Cuenta destino
                                </label>

                                <div className={`flex items-center border rounded-xl overflow-hidden transition-all ${
                                    form.toAccount.length > 0 && !toAccountComplete
                                        ? "border-amber-300 ring-2 ring-amber-500/10"
                                        : "border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400"
                                }`}>
                                    <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center border-r text-lg bg-slate-50 border-slate-200">
                                        {prefill.toAccount ? "⭐" : "🏦"}
                                    </div>
                                    <input
                                        type="text"
                                        name="toAccount"
                                        value={form.toAccount}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                            setForm(p => ({ ...p, toAccount: val }));
                                        }}
                                        placeholder="0000000000"
                                        maxLength={10}
                                        className="flex-1 px-3 py-3 text-sm text-slate-800 bg-white focus:outline-none font-mono tracking-wider placeholder-slate-300"
                                    />
                                    <div className={`flex-shrink-0 px-3 text-xs font-bold tabular-nums ${
                                        toAccountComplete ? "text-slate-500" : "text-slate-300"
                                    }`}>
                                        {form.toAccount.length}/10
                                    </div>
                                </div>

                                <p className="text-xs mt-1.5 text-slate-400">
                                    {form.toAccount.length > 0 && !toAccountComplete
                                        ? `Faltan ${10 - form.toAccount.length} dígitos`
                                        : prefill.toAccount
                                            ? `Cuenta de ${prefill.alias ?? "favorito"}`
                                            : "Ingresa los 10 dígitos de la cuenta"}
                                </p>
                            </div>
                        </div>

                        {/* Aviso de conversión */}
                        {willConvert && (
                            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-2.5">
                                <span className="text-lg flex-shrink-0">🔄</span>
                                <p className="text-xs text-amber-700 font-medium">
                                    Se aplicará conversión automática de{" "}
                                    <strong>{selectedAccount.currency}</strong> →{" "}
                                    <strong>{toAccount.currency}</strong> al tipo de cambio vigente.
                                </p>
                            </div>
                        )}

                        {/* Monto */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Monto
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 h-14 px-4 flex flex-col items-center justify-center bg-slate-100 border border-slate-200 rounded-xl min-w-[56px]">
                                    <span className="text-base font-extrabold text-slate-700 font-mono leading-none">
                                        {symbol}
                                    </span>
                                    {selectedAccount && (
                                        <span className="text-[9px] text-slate-400 font-semibold tracking-wider mt-0.5">
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
                                    min="0.01" max="2000" step="0.01"
                                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-3xl font-extrabold text-slate-900 placeholder-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 h-14"
                                />
                            </div>
                            {Number(form.amount) > 0 && (
                                <div className="mt-3">
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                                            style={{ width: `${amountPct}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1.5">
                                        {amountPct.toFixed(0)}% del límite por transferencia
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Descripción <span className="text-slate-300 font-normal normal-case">· opcional</span>
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Ej. Pago de servicio, préstamo…"
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                            />
                        </div>

                        {/* Botón */}
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className={`w-full font-bold text-base py-4 rounded-xl transition-all ${
                                canSubmit
                                    ? "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 cursor-pointer"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                        >
                            {loadingTransfer ? "Procesando…" : "Continuar con la transferencia →"}
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