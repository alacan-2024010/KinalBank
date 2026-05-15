import { useEffect, useState } from "react";
import { useAdminTransactionsStore } from "../store/useAdminTransactionsStore.js";
import { Badge } from "../components/Badge.jsx";

const TxRow = ({ tx }) => {
    const isCredit = tx.type === "DEPOSITO" || tx.type === "CREDITO";
    const symbol = tx.currencyFrom === "USD" ? "$" : "Q";
    const amount = tx.amountSent ?? 0;

    return (
        <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${
                    isCredit ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                }`}>
                    {isCredit ? "↓" : "↑"}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-700">{tx.description}</p>
                    <p className="text-xs text-slate-400 font-mono">{tx.type}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`text-sm font-bold ${isCredit ? "text-emerald-600" : "text-red-500"}`}>
                    {isCredit ? "+" : "-"}{symbol} {Number(amount).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString("es-GT", {
                        day: "2-digit", month: "short", year: "numeric"
                    })}
                </p>
            </div>
        </div>
    );
};

const AccountActivityCard = ({ item, onSelect, selected }) => {
    const acc = item.account;
    const isSelected = selected?._id === item._id;

    return (
        <div
            onClick={() => onSelect(item)}
            className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                    ? "border-indigo-300 bg-indigo-50/60 shadow-md shadow-indigo-100"
                    : "border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30"
            }`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-base">
                        🏦
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 font-mono text-sm">{acc.accountNumber}</p>
                        <p className="text-xs text-slate-400">{acc.accountType}</p>
                    </div>
                </div>
                <Badge value={acc.status} />
            </div>

            <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-emerald-600 font-bold text-sm">
                        {acc.currency === "USD" ? "$" : "Q"}{" "}
                        {Number(acc.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100">
                    <span className="text-indigo-600 font-bold text-sm">{item.totalMovimientos}</span>
                    <span className="text-indigo-400 text-xs">movimientos</span>
                </div>
            </div>
        </div>
    );
};

export const AdminTransactionsPage = () => {
    const {
        accountsByActivity,
        accountTransactions,
        order,
        loading,
        loadingTransactions,
        error,
        fetchAccountsByActivity,
        fetchAccountTransactions,
        clearError,
    } = useAdminTransactionsStore();

    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchAccountsByActivity("desc");
    }, []);

    const handleSelect = (item) => {
        setSelected(item);
        fetchAccountTransactions(item.account._id);
    };

    const toggleOrder = () => {
        const next = order === "desc" ? "asc" : "desc";
        fetchAccountsByActivity(next);
        setSelected(null);
    };

    return (
        <div className="max-w-6xl mx-auto">

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 flex items-center justify-between">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                    <button onClick={clearError} className="text-red-400 hover:text-red-600">✕</button>
                </div>
            )}

            {/* Header */}
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#071126] via-[#0f1d3a] to-[#16284f] p-8 md:p-10 shadow-2xl shadow-slate-900/20 mb-8">
                <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full" />
                <div className="absolute bottom-[-100px] left-[-80px] w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-5">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold">
                                Administración bancaria
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            Actividad de
                            <span className="block bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                                cuentas
                            </span>
                        </h1>
                        <p className="text-slate-300 mt-4 max-w-2xl leading-relaxed">
                            Visualiza las cuentas con más movimientos y revisa el detalle de sus últimas transacciones.
                        </p>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-4">
                        <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md p-5 min-w-[170px]">
                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">Cuentas</p>
                            <h2 className="text-4xl font-black text-white">{accountsByActivity.length}</h2>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                <span className="text-cyan-300 text-xs font-medium">Con movimientos</span>
                            </div>
                        </div>

                        <button
                            onClick={toggleOrder}
                            className="group px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all duration-300"
                        >
                            {order === "desc" ? "↓ Mayor a menor" : "↑ Menor a mayor"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Lista de cuentas */}
                <div className="rounded-[28px] border border-white/50 bg-white/85 backdrop-blur-xl shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800">Cuentas por actividad</h2>
                        <p className="text-sm text-slate-400 mt-1">Ordenadas por número de movimientos</p>
                    </div>

                    <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                        {loading ? (
                            <div className="flex flex-col items-center py-16 gap-4">
                                <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />
                                <p className="text-slate-400 text-sm">Cargando cuentas...</p>
                            </div>
                        ) : accountsByActivity.length === 0 ? (
                            <div className="flex flex-col items-center py-16">
                                <span className="text-4xl mb-3">📊</span>
                                <p className="text-slate-500 font-medium">Sin datos de actividad</p>
                            </div>
                        ) : (
                            accountsByActivity.map((item) => (
                                <AccountActivityCard
                                    key={item._id}
                                    item={item}
                                    onSelect={handleSelect}
                                    selected={selected}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Últimos movimientos */}
                <div className="rounded-[28px] border border-white/50 bg-white/85 backdrop-blur-xl shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800">Últimos movimientos</h2>
                        <p className="text-sm text-slate-400 mt-1">
                            {selected
                                ? `Cuenta ${selected.account.accountNumber}`
                                : "Selecciona una cuenta para ver sus movimientos"}
                        </p>
                    </div>

                    <div className="px-6 py-4">
                        {!selected ? (
                            <div className="flex flex-col items-center py-16">
                                <span className="text-4xl mb-3">👈</span>
                                <p className="text-slate-500 font-medium text-center">
                                    Selecciona una cuenta de la lista para ver sus últimos 5 movimientos
                                </p>
                            </div>
                        ) : loadingTransactions ? (
                            <div className="flex flex-col items-center py-16 gap-4">
                                <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />
                                <p className="text-slate-400 text-sm">Cargando movimientos...</p>
                            </div>
                        ) : accountTransactions.length === 0 ? (
                            <div className="flex flex-col items-center py-16">
                                <span className="text-4xl mb-3">📋</span>
                                <p className="text-slate-500 font-medium">Sin movimientos registrados</p>
                            </div>
                        ) : (
                            <>
                                {/* Info de la cuenta seleccionada */}
                                <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-0.5">Saldo disponible</p>
                                        <p className="font-bold text-emerald-600">
                                            {selected.account.currency === "USD" ? "$" : "Q"}{" "}
                                            {Number(selected.account.balance).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 mb-0.5">Total movimientos</p>
                                        <p className="font-bold text-indigo-600">{selected.totalMovimientos}</p>
                                    </div>
                                </div>

                                <div>
                                    {accountTransactions.map((tx) => (
                                        <TxRow key={tx._id} tx={tx} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};